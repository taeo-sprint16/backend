import 'dotenv/config';

import Koa from 'koa';
import { koaBody } from 'koa-body';
import cors from '@koa/cors';

import mongodbConn from './config/mongo_config';
import { healthCheckRouter } from './src/routes/healthchecker_router';
import { serviceRouter } from './src/routes/service_router';
import { errorHandler } from './src/util';

const app = new Koa();

app.use(cors({
  origin: '*',
}));
app.use(koaBody());

app.use(errorHandler);

app.use(healthCheckRouter.allowedMethods()).use(healthCheckRouter.routes());
app.use(serviceRouter.allowedMethods()).use(serviceRouter.prefix('/api/content').routes());

app.listen(process.env.PORT, async () => {
  console.log(`Server is running on port ${process.env.PORT}`);
  await mongodbConn();
});
