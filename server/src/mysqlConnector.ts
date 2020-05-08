/* eslint-disable function-paren-newline */
/* eslint-disable id-length */
/* eslint-disable max-len */
import {
  AConnector,
  ASchema,
  ATable,
  AField,
  IConnectionOptions
} from './aConnector';
import { ISchemaResponse, ITablesResponse, IFieldsResponse } from './mysqlConnectorInterfaces';
import mysql from 'mysql';

const GET_SCHEMATA_SQL = 'SELECT * FROM information_schema.SCHEMATA WHERE SCHEMA_NAME = ?';
const GET_SCHEMATAS_SQL = 'SELECT * FROM information_schema.SCHEMATA';
const GET_TABLE_SQL = 'SELECT * FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?';
const GET_TABLES_SQL = 'SELECT * FROM information_schema.TABLES WHERE TABLE_SCHEMA = ?';
const GET_FIELD_SQL = 'SELECT * FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? and TABLE_NAME = ? and COLUMN_NAME = ?';
const GET_FIELDS_SQL = 'SELECT * FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? and TABLE_NAME = ?';

const FIRST_ARRAY_KEY = 0;

class MysqlField extends AField {

  public table: MysqlTable;

  public catalog: string;

  public schema: MysqlSchema;

  public name: string;

  public type: string;

  public length?: number;

  public originalPosition: number;

  public isNullable: string;

  public key: string;

  public extra: string;

  public privileges: string;

  public coment: string;

  public generationExpression: string;

  public numericScale?: number;

  public numericPersition?: number;

  public datetimePersicion?: number;

  public columnDefault?: string;

  public characterSetName?: string;

  public characterOctetLength?: number;

  public characterMaximumLength?: number;

  private _mysqlConnection: mysql.Connection;

  public constructor(connection: mysql.Connection, table: MysqlTable, fieldData: IFieldsResponse) {
    super();

    this.table = table;
    this.schema = table.schema;

    this.catalog = fieldData.TABLE_CATALOG;
    this.name = fieldData.COLUMN_NAME;
    this.type = fieldData.DATA_TYPE;
    this.length = fieldData.CHARACTER_MAXIMUM_LENGTH;
    this.originalPosition = fieldData.ORDINAL_POSITION;
    this.isNullable = fieldData.IS_NULLABLE; // change to boolean
    // this.columnType = fieldData.COLUMN_TYPE;
    this.key = fieldData.COLUMN_KEY;
    this.extra = fieldData.EXTRA;
    this.privileges = fieldData.PRIVILEGES;
    this.coment = fieldData.COLUMN_COMMENT;
    this.generationExpression = fieldData.GENERATION_EXPRESSION;

    this.characterMaximumLength = fieldData.CHARACTER_MAXIMUM_LENGTH;
    this.characterOctetLength = fieldData.CHARACTER_OCTET_LENGTH;
    this.characterSetName = fieldData.CHARACTER_SET_NAME;
    this.columnDefault = fieldData.COLUMN_DEFAULT;
    this.datetimePersicion = fieldData.DATETIME_PRECISION;
    this.numericPersition = fieldData.NUMERIC_PRECISION;
    this.numericScale = fieldData.NUMERIC_SCALE;

    this._mysqlConnection = connection;
  }
}

class MysqlTable extends ATable {

  public catalog: string;

  public name: string;

  public schema: MysqlSchema;

  public type: string;

  public comment: string;

  public autoIncrement?: number;

  public avgRowLength?: number;

  public checksum?: number;

  public checkTime?: Date;

  public createOptions?: string;

  public createTime?: Date;

  public dataFree?: number;

  public dataLength?: number;

  public engine?: string;

  public indexLength?: number;

  public maxDataLength?: number;

  public rowFormat?: string;

  private _mysqlConnection: mysql.Connection;

  public constructor(connection: mysql.Connection, schema: MysqlSchema, tableData: ITablesResponse) {
    super();

    this.schema = schema;

    this.catalog = tableData.TABLE_CATALOG;
    this.name = tableData.TABLE_NAME;
    this.type = tableData.TABLE_TYPE;
    this.comment = tableData.TABLE_COMMENT;

    this.autoIncrement = tableData.AUTO_INCREMENT;
    this.avgRowLength = tableData.AVG_ROW_LENGTH;
    this.checksum = tableData.CHECKSUM;
    this.createOptions = tableData.CREATE_OPTIONS;
    this.dataFree = tableData.DATA_FREE;
    this.dataLength = tableData.DATA_LENGTH;
    this.engine = tableData.ENGINE;
    this.indexLength = tableData.INDEX_LENGTH;
    this.maxDataLength = tableData.MAX_DATA_LENGTH;
    this.rowFormat = tableData.ROW_FORMAT;

    if (tableData.CHECK_TIME) {
      this.checkTime = new Date(tableData.CHECK_TIME);
    }

    if (tableData.CREATE_TIME) {
      this.createTime = new Date(tableData.CREATE_TIME);
    }

    this._mysqlConnection = connection;
  }

  public async getFields(): Promise<Array<MysqlField>> {
    return new Promise((resolve, reject) => {
      this._mysqlConnection.query(
        GET_FIELDS_SQL,
        [ this.schema.name, this.name ],
        (error, result: Array<IFieldsResponse>) => {
          if (error === null) {

            const mysqlFields = result.map(rawFieldData => new MysqlField(this._mysqlConnection, this, rawFieldData));

            resolve(mysqlFields);
          } else {
            reject(error);
          }
        }
      );
    });
  }

  public async getField(name: string): Promise<MysqlField> {
    return new Promise((resolve, reject) => {
      this._mysqlConnection.query(
        GET_FIELD_SQL,
        [ this.schema.name, this.name, name ],
        (error, result: Array<IFieldsResponse>) => {
          if (error === null && result[FIRST_ARRAY_KEY]) {
            resolve(new MysqlField(this._mysqlConnection, this, result[FIRST_ARRAY_KEY]));
          } else {
            reject(error);
          }
        }
      );
    });
  }
}

class MysqlSchema extends ASchema {

  public catalog: string;

  public name: string;

  public characterSet: string;

  public collation: string;

  private _mysqlConnection: mysql.Connection;

  public constructor(connection: mysql.Connection, schemaData: ISchemaResponse) {
    super();
    this.catalog = schemaData.CATALOG_NAME;
    this.name = schemaData.SCHEMA_NAME;
    this.characterSet = schemaData.DEFAULT_CHARACTER_SET_NAME;
    this.collation = schemaData.DEFAULT_COLLATION_NAME;
    this._mysqlConnection = connection;
  }

  public async getTables(): Promise<Array<MysqlTable>> {
    return new Promise((resolve, reject) => {
      this._mysqlConnection.query(
        GET_TABLES_SQL,
        [this.name],
        (error, result: Array<ITablesResponse>) => {
          if (error === null) {
            const mysqlTables = result.map(rawTableData => new MysqlTable(this._mysqlConnection, this, rawTableData));

            resolve(mysqlTables);
          } else {
            reject(error);
          }
        }
      );
    });
  }

  public async getTable(tableName: string): Promise<MysqlTable> {
    return new Promise((resolve, reject) => {
      this._mysqlConnection.query(
        GET_TABLE_SQL,
        [ this.name, tableName ],
        (error, result: Array<ITablesResponse>) => {
          if (error === null && result[FIRST_ARRAY_KEY]) {

            resolve(new MysqlTable(this._mysqlConnection, this, result[FIRST_ARRAY_KEY]));
          } else {
            reject(error);
          }
        }
      );
    });
  }
}

export default class MysqlConnector extends AConnector {

  private _mysqlConnection: mysql.Connection;

  public constructor(options: IConnectionOptions) {
    super();
    this._mysqlConnection = mysql.createConnection(options);
  }

  public async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this._mysqlConnection.connect(error => {
        if (error === null) {
          resolve();
        } else {
          reject(error);
        }
      });
    });
  }

  public async getSchemas(): Promise<Array<MysqlSchema>> {
    return new Promise((resolve, reject) => {
      this._mysqlConnection.query(
        GET_SCHEMATAS_SQL,
        [],
        (error, result: Array<ISchemaResponse>) => {
          if (error === null) {
            const mysqlSchemas = result.map(rawSchemaData => new MysqlSchema(this._mysqlConnection, rawSchemaData));

            resolve(mysqlSchemas);
          } else {
            reject(error);
          }
        }
      );
    });
  }

  public async getSchema(name: string): Promise<MysqlSchema> {
    return new Promise((resolve, reject) => {
      this._mysqlConnection.query(
        GET_SCHEMATA_SQL,
        [name],
        (error, result: Array<ISchemaResponse>) => {
          if (error === null && result[FIRST_ARRAY_KEY]) {

            resolve(new MysqlSchema(this._mysqlConnection, result[FIRST_ARRAY_KEY]));
          } else {
            reject(error);
          }
        }
      );
    });
  }

}
