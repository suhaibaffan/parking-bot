import Koa from 'koa';
import parser from 'koa-bodyparser';
import KoaRouter from 'koa-router';
import logger from 'koa-logger';
import chalk from 'chalk';
import cron from 'node-cron';
import { PORT, RESET } from './env';
import './db/init';
import setUpParkingArena from './config/parking';
import { checkForExistingBooking, checkForReservedParkings, saveBooking, cancelExpiredBookings } from './routes/api/booking';
import { checkForNormalParkings } from './routes/api/parking';
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

    console.log( chalk.yellow( 'Configuring parking slots...' ) );
    await setUpParkingArena();
    console.log( chalk.green( RESET ? 'Parking slots are reset and ready for booking.' : 'Parking slots unchanged' ) );

    const router = new KoaRouter();

    router.get( '/test', ( ctx, next ) => {
        ctx.body = 'Server is up.'
    });
    router.post( '/scan/rfTag', ( ctx, next ) => {
    });

    router.post( '/book/reserve',  validateInputs, checkForReservedParkings, checkForNormalParkings, checkForExistingBooking, saveBooking );
    router.post( '/book/normal', validateInputs, checkForNormalParkings, checkForExistingBooking, saveBooking );

    app.use( router.routes() );
    app.use( router.allowedMethods() );
    app.on( 'error', err => {
        console.log( chalk.bgRedBright( err ) );
    });

    app.listen( PORT );

    console.log( `HTTP server listening on port ${chalk.bold( PORT )}` );
    cron.schedule( '* * * * *', () => {
        console.log( chalk.redBright( 'Checking for expired bookings...' ) );
        cancelExpiredBookings();
    });
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