import { User } from '../../db/schemas/User.model';

export async function registerUser ( ctx ) {
    const { email, rfid, type } = ctx.request.body;

    await User.findOneAndUpdate({ email }, { email, rfid, type }, { upsert: true });

    ctx.status = 201;
    return ctx;
}

export async function getAllRegisteredUsers ( ctx ) {
    const users = await User.find({}, 'email rfid type' ).lean();

    ctx.status = 200;
    ctx.body = {
        message: 'Registered Users',
        users
    }
}

export async function whiteListBasedOnRfids ( ctx, next ) {
    const { rfid } = ctx.request.body;

    const user = await User.findOne({ rfid });

    if ( user ) {
        return next();
    }

    ctx.status = 400;
    ctx.message = 'Unregistered rfid tag.'
    return ctx;
}
