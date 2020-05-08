import express from 'express';
import MysqlConnector from './mysqlConnector';
import { firstLevelObject } from './helper';

const routerFunction = express.Router;
const router = routerFunction();
const PATH_NOT_FOUND = 404;

let isConnected = false;

const mysql = new MysqlConnector({
  host: '127.0.0.1',
  password: '12345678',
  user: 'root'
});

mysql.connect()
  .then(() => {
    isConnected = true;
  })
  .catch(console.log);

// TODO: add check for isConnected

// Simple requests vor just names
router.get('/schemas', async(req, res) => {
  const schemaNames = await mysql.getSchemas()
    .then(schemas => schemas.map(schema => schema.name));

  res.json(schemaNames);
});

router.get('/tables/:schema', async(req, res) => {
  const tableNames = await mysql.getSchema(req.params.schema)
    .then(async schema => schema.getTables())
    .then(tables => tables.map(table => table.name));

  res.json(tableNames);
});

router.get('/fields/:schema/:table', async(req, res) => {
  const tableNames = await mysql.getSchema(req.params.schema)
    .then(async schema => schema.getTable(req.params.table))
    .then(async table => table.getFields())
    .then(fields => fields.map(field => field.name));

  res.json(tableNames);
});

// Requests vor details
router.get('/schema/:schema', async(req, res) => {
  const schemaDetails = await mysql.getSchema(req.params.schema)
    .then(schema => firstLevelObject({ ...schema }));

  res.json(schemaDetails);
});

router.get('/table/:schema/:table', async(req, res) => {
  const tableDetails = await mysql.getSchema(req.params.schema)
    .then(async schema => schema.getTable(req.params.table))
    .then(table => firstLevelObject({ ...table }));

  res.json(tableDetails);
});

router.get('/field/:schema/:table/:field', async(req, res) => {
  const fieldDetails = await mysql.getSchema(req.params.schema)
    .then(async schema => schema.getTable(req.params.table))
    .then(async table => table.getField(req.params.field))
    .then(field => firstLevelObject({ ...field }));

  res.json(fieldDetails);
});

router.all('/*', (req, res) => {
  res.status(PATH_NOT_FOUND).send(`Can't ${req.method} ${req.url}`);
});

export default router;
