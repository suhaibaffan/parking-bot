export const {
    NODE_ENV = 'development',
    PORT = 8000,
    MONGO_URI = 'mongodb+srv://dbUser:dbPassword@cluster0.gw8ra.mongodb.net/parkings?retryWrites=true&w=majority',
    MONGO_DB = '',
    // config for parking space
    TOTAL_SLOTS = 120,
    RESERVED_SLOTS = 24,
    RESET = true
} = process.env;