import cors from 'cors';
import express from 'express';
import MysqlConnector from './mysqlConnector';
import { cleanClass, getBody, testForToken } from './hepler';
import { v4 as uuidv4 } from 'uuid';

const routerFunction = express.Router;
const router = routerFunction();
const NOT_AUTHORISED = 403;
const PATH_NOT_FOUND = 404;
const SERVER_ERROR = 500;

const mysqlConnetions: {
  [token: string]: {
    lastUsed: Date;
    connection: MysqlConnector;
  };
} = {};

router.use(cors());

// TODO: add check for isConnected
// Simple requests vor just names
router.post('/connect', (req, res) => {
  const connection = new MysqlConnector(req.body);

  connection.connect()
    .then(() => {
      const uuid = uuidv4();

      mysqlConnetions[uuid] = {
        connection,
        lastUsed: new Date()
      };

      res.json({
        success: true,
        token: uuid
      });
    })
    .catch(error => {
      res.status(NOT_AUTHORISED);
      res.json(error);
    });
});

router.get('/schemas', (req, res) => {
  getBody(req)
    .then(async body => testForToken(body, mysqlConnetions))
    .then(async({ token }) => mysqlConnetions[token].connection.getSchemas())
    .then(schemas => schemas.map(schema => schema.name))
    .then(schemas => {
      console.log(schemas);
      res.json(schemas);
    })
    .catch(console.log);
});

router.get('/tables/:schema', (req, res) => {
  getBody(req)
    .then(async body => testForToken(body, mysqlConnetions))
    .then(({ token }) => mysqlConnetions[token].connection)
    .then(async connection => connection.getSchema(req.params.schema))
    .then(async schema => schema.getTables())
    .then(tables => tables.map(table => table.name))
    .then(res.json)
    .catch(console.log);
});

router.get('/fields/:schema/:table', (req, res) => {
  getBody(req)
    .then(async body => testForToken(body, mysqlConnetions))
    .then(({ token }) => mysqlConnetions[token].connection)
    .then(async connection => connection.getSchema(req.params.schema))
    .then(async schema => schema.getTable(req.params.table))
    .then(async table => table.getFields())
    .then(fields => fields.map(field => field.name))
    .then(res.json)
    .catch(console.log);
});

// Requests vor details
router.get('/schema/:schema', (req, res) => {
  getBody(req)
    .then(async body => testForToken(body, mysqlConnetions))
    .then(({ token }) => mysqlConnetions[token].connection)
    .then(async schema => schema.getSchema(req.params.schema))
    .then(res.json)
    .catch(console.log);
});

router.get('/table/:schema/:table', (req, res) => {
  getBody(req)
    .then(async body => testForToken(body, mysqlConnetions))
    .then(({ token }) => mysqlConnetions[token].connection)
    .then(async connection => connection.getSchema(req.params.schema))
    .then(async schema => schema.getTable(req.params.table))
    .then(res.json)
    .catch(console.log);
});

router.get('/field/:schema/:table/:field', (req, res) => {
  getBody(req)
    .then(async body => testForToken(body, mysqlConnetions))
    .then(({ token }) => mysqlConnetions[token].connection)
    .then(async connection => connection.getSchema(req.params.schema))
    .then(async schema => schema.getTable(req.params.table))
    .then(async table => table.getField(req.params.field))
    .then(res.json)
    .catch(console.log);
});

router.post('/query', async(req, res) => {
  const body = await getBody(req)
    .then(async bodyData => testForToken(bodyData, mysqlConnetions));

  if (typeof body.query !== 'string') {
    throw new Error('QUERY IS NOT DEFINED');
  }

  const queryPromisses = body.query.split(';')
    .filter(string => Boolean(string.trim()))
    .map(async query => mysqlConnetions[body.token].connection
      .query(query.trim()));

  Promise.all(queryPromisses)
    .then(response => res.json(response))
    .catch(error => {
      res.status(SERVER_ERROR);
      res.json(error);
    });
});

router.all('/*', (req, res) => {
  res.status(PATH_NOT_FOUND).send(`Can't ${req.method} ${req.url}`);
});

export default router;
