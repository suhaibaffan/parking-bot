import Koa from 'koa';
import parser from 'koa-bodyparser';
import KoaRouter from 'koa-router';
import logger from 'koa-logger';
import chalk from 'chalk';
import { promisify } from 'util';
import { PORT } from './env';
import './db/init';
import { checkForExistingBooking, checkForReservedParkings, checkForNormalParkings, saveBooking } from './routes/api/booking';
import { validateInputs } from './utils/validator';

main();

async function main () {
    await startServer()
    console.log( chalk.green( 'Application started successfully' ) );
}

async function startServer () {
    const app = new Koa();
    app.use( errorHandlerMiddleware() );
    app.use( logger() )
    app.use( parser() )

    const router = new KoaRouter();

    router.get( '/test', ( ctx, next ) => {
        ctx.body = 'Server is up.'
    });
    router.post( '/scan/rfTag', ( ctx, next ) => {
    });

    router.post( '/book/reserve',  validateInputs, checkForReservedParkings, checkForExistingBooking, saveBooking );
    router.post( '/book/normal', validateInputs, checkForNormalParkings, checkForExistingBooking, saveBooking );

    app.use( router.routes() );
    app.use( router.allowedMethods() );
    app.on( 'error', err => {
        console.log( chalk.bgRedBright( err ) );
    });

    app.listen( PORT );

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