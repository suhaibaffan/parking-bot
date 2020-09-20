import mongoose from 'mongoose';
import chalk from 'chalk';
import { MONGO_URI } from '../env';

mongoose.connect( MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

export const db = mongoose.connection;

db.on( 'error', () => {
    console.log( chalk.bgRedBright( 'connection error:' ) )
});

db.once( 'open', function() {
    chalk.green( 'Db connected' );
});

export default mongoose;
