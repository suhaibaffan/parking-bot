export async function  validateInputs ( ctx, next ) {
    const { type, rfid } = ctx.request.body;
    if ( !type || !rfid ) {
        ctx.status = 400;
        ctx.message = 'Invalid input';
        return ctx;
    }
    
    if ( ![ 'reserved', 'normal' ].includes( type ) ) {
        ctx.status = 400;
        ctx.message = 'Invalid type';
        return ctx;
    }

    if ( ctx.request.path === '/user/register' ) {
        const { email } = ctx.request.body;
        if ( !email ) {
            ctx.status = 400;
            ctx.message = 'Invalid email';
            return ctx;
        }
    }

    return next();
}
