import mongoose, { db } from '../init';

const ParkingSchema = new mongoose.Schema({
    slot: { type: Number, index: true, unique: true },
    vacant: { type: Boolean, default: true },
    type: { type: String, enum: [ 'reserved', 'normal' ]}
});

export const Parking = db.model( 'slot', ParkingSchema );
