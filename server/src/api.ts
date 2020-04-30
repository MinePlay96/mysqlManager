import express from 'express';

const routerFunction = express.Router;
const router = routerFunction();
const PATH_NOT_FOUND = 404;

router.get('/test', (req, res) => {
  res.send('test');
});

router.all('/*', (req, res) => {
  res.status(PATH_NOT_FOUND).send(`Can't ${req.method} ${req.url}`);
});

export default router;
