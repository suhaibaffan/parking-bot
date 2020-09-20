import rndm from 'rndm';
import mongoose, { db } from '../init';


const BookingSchema = new mongoose.Schema({
    booking_at: { type: Date, default: Date.now },
    rfid: { type: String, minlength: 5, maxlength: 10 },
    booking: { type: String, default: rndm( 16 ) },
    parking_slot: Number,
    parked_at: Date,
    left_at: Date,
    parking: { type: Boolean, default: false },
    type: { type: String, enum: [ 'reserved', 'normal' ]}
});

export const Booking = db.model( 'booking', BookingSchema );
