import { Booking } from '../../db/schemas/Booking.model';
import { RESERVED_SLOTS, TOTAL_SLOTS } from '../../env';


export async function findByRfTag ( ctx ) {
    const { rfTag } = ctx.request.body || ctx.request.query;
}

export async function checkForReservedParkings ( ctx, next ) {
    const count = await Booking.count({ type: 'reserved', parking: true });
    if ( count > RESERVED_SLOTS - 1 ) {
        ctx.status = 400;
        ctx.message = 'Reserve parking full.'
        return ctx;
    }
    ctx.state.count = count;
    return next();
}

export async function checkForNormalParkings ( ctx, next ) {
    const count = await Booking.count({ type: 'normal', parking: true });
    if ( count > ( TOTAL_SLOTS - RESERVED_SLOTS - 1 ) ) {
        ctx.status = 400;
        ctx.message = 'Normal parking full.'
        return ctx;
    }

    ctx.state.count = count;
    return next();
}

export async function saveBooking ( ctx, next ) {
    const { type, rfid } = ctx.request?.body;
    let { count } = ctx?.state;

    const parkingSlot = type === 'reserved' ? count + 1 : RESERVED_SLOTS + 1;

    const booking = new Booking({
        rfid, type, parking_slot: parkingSlot
    });

    const response = await booking.save();
    ctx.status = 200;
    ctx.body = {
        status: 'Booking confirmed',
        parking_slot: response.parking_slot,
        booking_id: response.booking
    }
    return next();
}

export async function checkForExistingBooking ( ctx, next ) {
    const { rfid } = ctx.request.body;
    const booking = await Booking.findOne({ rfid, booking_at: { $gte: new Date().getTime() - ( 15 * 60 * 1000 ) } }).lean();
    if ( booking ) {
        ctx.status = 200;
        ctx.body = {
            status: 'Booking already exists',
            parking_slot: booking.parking_slot,
            booking_id: booking.booking
        };
        return ctx;
    }
    return next();
}
