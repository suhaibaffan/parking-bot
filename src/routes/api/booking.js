import { Booking } from '../../db/schemas/Booking.model';
import { Parking } from '../../db/schemas/Parking.model';
import { RESERVED_SLOTS, TOTAL_SLOTS } from '../../env';


export async function findByRfTag ( ctx ) {
    const { rfTag } = ctx.request.body || ctx.request.query;
}

export async function checkForReservedParkings ( ctx, next ) {
    // const count = await Parking.count({ type: 'reserved', vacant: true });
    // Can also add white list of reserved rftags.
        // allow normal bookings.
    return next();
}

export async function checkForNormalParkings ( ctx, next ) {
    const count = await Parking.count({ type: 'normal', vacant: true });
    if ( count === 0 ) {
        ctx.status = 400;
        ctx.message = 'Parking full.'
        return ctx;
    }
    return next();
}

export async function saveBooking ( ctx, next ) {
    const { type, rfid } = ctx.request?.body;
    let vacantParking = await Parking.findOne({ type , vacant: true }).lean();

    if ( !vacantParking ) {
        vacantParking = await Parking.findOne({ type: 'normal' , vacant: true }).lean();
    }

    const booking = new Booking({
        rfid, type, parking_slot: vacantParking._id
    });

    const createdBooking = await booking.save();
    await Parking.findByIdAndUpdate( vacantParking._id, { vacant: false });

    const bookingWithRef = await createdBooking.populate( 'parking_slot' ).execPopulate();
    ctx.status = 200;
    ctx.body = {
        status: 'Booking confirmed',
        parking_slot: bookingWithRef.parking_slot.slot,
        type,
        booking_id: bookingWithRef.booking
    }
    return next();
}

export async function checkForExistingBooking ( ctx, next ) {
    const { rfid } = ctx.request.body;
    const booking = await Booking.findOne({
            rfid,
            booking_at: { $gte: new Date().getTime() - ( 15 * 60 * 1000 ) }
        }).populate( 'parking_slot' ).lean();

    if ( booking ) {
        ctx.status = 200;
        ctx.body = {
            status: 'Booking already exists',
            parking_slot: booking.parking_slot.slot,
            booking_id: booking.booking
        };
        return ctx;
    }
    return next();
}
