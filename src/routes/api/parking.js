import { Parking } from '../../db/schemas/Parking.model';

export async function checkForNormalParkings ( ctx, next ) {
    const count = await Parking .count({ type: 'normal', vacant: true });
    if ( count === 0 ) {
        ctx.status = 400;
        ctx.message = 'Parking full.'
        return ctx;
    }
    return next();
}