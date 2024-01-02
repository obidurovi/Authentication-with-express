import mongoose from 'mongoose';

// mongodb Connection
export const mongoDBConnection = async () => {
    try {
        

        const connect = await mongoose.connect(process.env.MONGO_URl);
        console.log(`mongoDB connected successfully`.green);
    } catch (error) {
        console.log(`${error.messsage}`.red);
    }
}

