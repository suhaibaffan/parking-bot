import mongoose, { db } from '../init';

const UserSchema = new mongoose.Schema({
    email: { type: String, index: true, unique: true },
    rfid: { type: String, index: true, unique: true },
    type: { type: String, enum: [ 'reserved', 'normal' ]}
});

export const User = db.model( 'user', UserSchema );
