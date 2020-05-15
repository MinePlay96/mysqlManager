/* eslint max-len: ['warn', 90] */
import cors from 'cors';
import express from 'express';
import MysqlConnector from './mysqlConnector';

const routerFunction = express.Router;
const router = routerFunction();
const PATH_NOT_FOUND_CODE = 404;

enum EHttpCodes {
  'notFound' = 404,
  'error' = 500
}

router.use(cors());

// TODO: add check for isConnected
// Simple requests vor just names
router.post('/connect', (req, res) => {
  const connection = new MysqlConnector(req.body);

  connection.connect()
    .then(args => {
      res.json({
        args,
        token: connection.uuid
      });
    })
    .catch(error => {
      res.status(EHttpCodes.error).json(error);
    });
});

router.post('/query', (req, res) => {

  const body = req.body as {token?: string; query?: string} | undefined;

  if (!body) {
    // TODO: add Error codes
    res.status(EHttpCodes.error)
      .json({ error: 'body is missing ' });

    return;
  }

  if (!body.token) {
    // TODO: add Error codes
    res.status(EHttpCodes.error)
      .json({ error: 'token is missing in body' });

    return;
  }

  if (!body.query) {
    // TODO: add Error codes
    res.status(EHttpCodes.error)
      .json({ error: 'query is missing in body' });

    return;
  }

  const connection = MysqlConnector.connections[body.token] as MysqlConnector | undefined;

  if (!connection || connection === null) {
    // TODO: add Error codes
    res.status(EHttpCodes.error)
      .json({ error: 'token not used or is got invalid' });

    return;
  }

  connection.updateLastUse();

  connection.query(body.query)
    .then(response => {
      res.json(response);
    })
    .catch(error => {
      res.status(EHttpCodes.error).json(error);
    });
});

router.all('/*', (req, res) => {
  res.status(PATH_NOT_FOUND_CODE).send(`Can't ${req.method} ${req.url}`);
});

export default router;
