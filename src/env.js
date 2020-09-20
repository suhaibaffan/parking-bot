export const {
    NODE_ENV = 'development',
    PORT = 8000,
    MONGO_URI = '',
    MONGO_DB = '',
    // config for parking space
    TOTAL_SLOTS = 120,
    RESERVED_SLOTS = 24,
    RESET = true
} = process.env;