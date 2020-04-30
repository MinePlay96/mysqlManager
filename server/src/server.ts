import express from 'express';
import apiRouter from './api';
import webRouter from './web';

const server = express();

server.use('/api', apiRouter);

server.use('/', webRouter);

export function start(port: number): void {
  server.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
  });
}
