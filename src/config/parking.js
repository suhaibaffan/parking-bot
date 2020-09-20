import { Parking } from '../db/schemas/Parking.model';
import { Booking } from '../db/schemas/Booking.model';
import { RESERVED_SLOTS, TOTAL_SLOTS, RESET } from '../env';

export default async function init () {
    const existingParkingSlotsCount = await Parking.estimatedDocumentCount();

    if ( RESET ) {
        await Parking.deleteMany();
        await Booking.deleteMany();
    } else {
        return;
    }

    const slots = createEmptySlots();
    for ( const slot of slots ) {
        const parking = new Parking({
            type: slot <= RESERVED_SLOTS ? 'reserved' : 'normal',
            slot: slot
        });
        await parking.save();
    }
}

function createEmptySlots () {
    const slots = [];
    for ( let i = 0; i < TOTAL_SLOTS; i++ ) {
        slots.push( i + 1 );
    }
    return slots;
}
