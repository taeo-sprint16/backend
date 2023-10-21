import Router from '@koa/router';
import { Context, Next } from 'koa';

const healthchecker_router = new Router();

export const healthCheckRouter = healthchecker_router
  .get('health check', '/', async (ctx: Context, next: Next) => {
    ctx.status = 200;
    ctx.response.body = 'OK';
    await next();
  });
