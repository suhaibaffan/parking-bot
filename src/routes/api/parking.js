import { Parking } from '../../db/schemas/Parking.model';

export async function checkForNormalParkings ( ctx, next ) {
    const count = await Parking.count({ type: 'normal', vacant: true });
    if ( count === 0 ) {
        ctx.status = 400;
        ctx.message = 'Parking full.'
        return ctx;
    }
    return next();
}

export async function getAvailableParking ( ctx ) {
    const parkings = await Parking.find({ vacant: true }, 'slot type' );

    ctx.status = 200;
    ctx.body = {
        message: `Available parking slots are ${parkings.length}`,
        slots: parkings
    }
}

export async function getOccupiedParking ( ctx ) {
    const parkings = await Parking.find({ vacant: false }, 'slot type' );

    ctx.status = 200;
    ctx.body = {
        message: `Occupied parking slots are ${parkings.length}`,
        slots: parkings
    }
}
