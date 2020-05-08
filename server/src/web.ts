import express from 'express';
import path from 'path';

const CACHE_MAX_AGE = 60000;

const routerFunction = express.Router;
const router = routerFunction();
const publicPath = path.join(__dirname, '../../', '/frondend/dist');

router.use(express.static(publicPath, {
  cacheControl: true,
  maxAge: CACHE_MAX_AGE
}));
router.use('/*', express.static(path.join(publicPath, 'index.html')));

export default router;
