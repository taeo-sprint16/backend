import { Context, Next } from 'koa';

export function responseData(success: boolean, message: string, data?: any) {
  return {
    success,
    message,
    data,
  }
}

export async function errorHandler(ctx: Context, next: Next) {
  try {
    await next();
  } catch (err) {
    console.log('Error handler');
    if (err instanceof Error) {
      if (err.message.includes('DB_ERROR') || err.message.includes('SERVER_ERROR')) {
        const message = err.message.split(' ')[1];

        ctx.status = 400;
        ctx.response.body = errorCase(message);
        ctx.app.emit('error', err, ctx);
      } else {
        ctx.status = 500;
        ctx.response.body = responseData(false, err.message);
        ctx.app.emit('error', err, ctx);
      }
    }
  }
}

function errorCase(error: string) {
  switch (error) {
    case 'DB_ERROR':
      return responseData(false, error);
    case 'SERVER_ERROR':
      return responseData(false, error);
    default:
      return responseData(false, error);
  }
}
