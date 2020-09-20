import rndm from 'rndm';
import mongoose, { db } from '../init';


const BookingSchema = new mongoose.Schema({
    booking_at: { type: Date, default: Date.now },
    parking_available: { type: Date, default: new Date().getTime() + ( 15 * 60 * 1000 ) },
    rfid: { type: String, minlength: 5, maxlength: 10 },
    booking: { type: String, default: rndm( 16 ) },
    parking_slot: { type: mongoose.Schema.Types.ObjectId, ref: 'slot' },
    parked_at: Date,
    left_at: Date,
    parking: { type: Boolean, default: false },
    type: { type: String, enum: [ 'reserved', 'normal' ]},
    expired: { type: Boolean, default: false }
});

export const Booking = db.model( 'booking', BookingSchema );
