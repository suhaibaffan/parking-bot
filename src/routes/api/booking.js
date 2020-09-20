import Booking from '../../db/schemas/Booking.model';

export async function findByRfTag ( ctx ) {
    const { rfTag } = ctx.request.body || ctx.request.query;
}