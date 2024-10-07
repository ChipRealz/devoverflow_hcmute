import mongoose from 'mongoose';

let isConnected: boolean = false;

export const connectToDatabase = async () => {
    mongoose.set('strictQuery',true);
    
    if(!process.env.MONGODB_URL) {
        return console.log('MISSING MONGODB_URL');
    }

    if(isConnected) {
        return console.log('Already connected to the database');
    }

    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            dbName: 'devflow'
        })
        isConnected = true;

        console.log('Connected to the database');
    } catch (error) {
        console.log('Error connecting to the database', error);
    }
}