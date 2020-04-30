import express from 'express';
import path from 'path';

const routerFunction = express.Router;
const router = routerFunction();
const publicPath = path.join(__dirname, '../../', '/frondend/dist');

router.use(express.static(publicPath));
router.use('/*', express.static(path.join(publicPath, 'index.html')));

export default router;
