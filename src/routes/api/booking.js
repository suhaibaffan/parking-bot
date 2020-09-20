import chalk from 'chalk';
import { Booking } from '../../db/schemas/Booking.model';
import { Parking } from '../../db/schemas/Parking.model';
import { User } from '../../db/schemas/User.model';

export async function findByRfTag ( ctx ) {
    const { rfTag } = ctx.request.body || ctx.request.query;
}

export async function checkForReservedParkings ( ctx, next ) {
    // const count = await Parking.count({ type: 'reserved', vacant: true });
    // Can also add white list of reserved rftags.
        // allow normal bookings.
    return next();
}

export async function saveBooking ( ctx, next ) {
    const { type, rfid } = ctx.request?.body;
    let vacantParking = await Parking.findOne({ type , vacant: true }).lean();

    if ( !vacantParking ) {
        vacantParking = await Parking.findOne({ type: 'normal' , vacant: true }).lean();
    }

    const userType = await User.findOne({ rfid }, type ).lean();

    if ( userType !== 'reserved' && type === 'reserved' ) {
        // throw error if normal user tries to book reserved slots.
        ctx.status = 400;
        ctx.body = {
            message: 'Normal user cannot book reserved slot.'
        };
        return ctx;
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
    const expiredBooking = await Booking.findOne({
        rfid,
        expired: true,
        booking_at: { $gte: new Date().getTime() - ( 30 * 60 * 1000 ) }
    }).populate( 'parking_slot' ).lean();

    if ( expiredBooking ) {
        ctx.status = 400;
        ctx.body = {
            status: 'Booking expired, try after sometime.',
            parking_slot: expiredBooking.parking_slot.slot,
            booking_id: expiredBooking.booking
        };
        return ctx;
    }

    const booking = await Booking.findOne({
        rfid,
        expired: false,
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

export async function cancelExpiredBookings () {
    const bookings = await Booking.find({
        expired: false,
        booking_at: { $gte: new Date().getTime() - ( 30 * 60 * 1000 ), $lte: new Date().getTime() - ( 15 * 60 * 1000 ) }
    }).populate( 'parking_slot' );
    
    for ( const booking of bookings ) {
        booking.expired = true;
        await Parking.findByIdAndUpdate( booking.parking_slot._id, { vacant: true });
        await booking.save();
    }
    console.log( chalk.blueBright( `${bookings.length} Expired bookings updated` ) );
}
