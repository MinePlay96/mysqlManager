/* eslint-disable id-length */
/* eslint max-len: ['warn', 90] */
import { v4 as uuid4 } from 'uuid';
import mysql from 'mysql';

const SESSION_CECK_INTERVAL = 60000;
const SESSION_LIVE_TIME = 3600000;

interface IQueryResponse {
  fields: Array<mysql.FieldInfo> | undefined;
  result: unknown;
}

export default class MysqlConnector {
  public static connections: {[key: string]: MysqlConnector} = {};

  public uuid: string;

  public lastUse: Date;

  private _mysqlConnection: mysql.Connection;

  public constructor(options: mysql.ConnectionOptions) {
    this.uuid = uuid4();
    this.lastUse = new Date();
    this._mysqlConnection = mysql.createConnection(options);
  }

  public async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this._mysqlConnection.connect((error, args) => {
        if (error !== null) {
          reject(error);
        }
        MysqlConnector.connections[this.uuid] = this;
        resolve(args);
      });
    });
  }

  public async query(queryString: string): Promise<Array<IQueryResponse>> {
    const queryPromises = queryString.split(';')
      .map(string => string.trim())
      .filter(string => Boolean(string))
      .map(async string => this._singelQuery(string));

    return Promise.all(queryPromises);
  }

  public updateLastUse(): void {
    this.lastUse = new Date();
  }

  public closeSession(): void {
    this._mysqlConnection.end();
  }

  private async _singelQuery(queryString: string): Promise<IQueryResponse> {
    return new Promise((resolve, reject) => {
      this._mysqlConnection.query(queryString, (error, result: unknown, fields) => {
        if (error !== null) {
          reject(error);
        }
        resolve({
          fields,
          result
        });
      });
    });
  }
}

setInterval(() => {
  Object.keys(MysqlConnector.connections).forEach(key => {
    const value = MysqlConnector.connections[key];
    const now = new Date();
    const diff = now.getTime() - value.lastUse.getTime();

    if (diff > SESSION_LIVE_TIME) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete MysqlConnector.connections[key];
      value.closeSession();
    }
  });
}, SESSION_CECK_INTERVAL);
