import Koa from 'koa';
import { createServer } from 'http';
import KoaRouter from 'koa-router';
import logger from 'koa-logger';
import chalk from 'chalk';
import { promisify } from 'util';
import { PORT } from './env';

main();

async function main () {
    await startServer()
    console.log( chalk.green( 'Application started successfully' ) );
}

async function startServer () {
    const app = new Koa();
    app.use( errorHandlerMiddleware() );
    app.use( logger() )

    const router = new KoaRouter();

    app.use( router.routes() );
    app.use( router.allowedMethods() );
    app.on( 'error', err => {
        console.log( chalk.bgRedBright( err ) );
    });
    const server = await createServer( app );

    await promisify( server.listen.bind( server ) )( PORT );

    console.log( `HTTP server listening on port ${chalk.bold( PORT )}` );
}

function errorHandlerMiddleware () {
    return async ( ctx, next ) => {
        try {
            await next();
        } catch ( err ) {
            ctx.status = err.status || 500;
            ctx.body = err.message || err.toString();
        }
    };
}