import express from 'express';
import apiRouter from './api';
import webRouter from './web';

const server = express();

server.use(express.json());

server.all('/toll/mega', (req, res) => {
  res.json({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    body: req.body,
    // eslint-disable-next-line id-blacklist
    data: req.params,
    methode: req.method,
    query: req.query
  });
});

server.use('/api', apiRouter);

server.use('/', webRouter);

export function start(port: number): void {
  server.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
  });
}
