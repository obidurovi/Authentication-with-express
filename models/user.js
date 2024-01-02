import mongoose from 'mongoose';


const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        trim: true
    },
    phone: {
        type: String,
        trim : true
    },
    age: {
        type: Number,
    },
    skill : {
        type : String,
        trim : true,
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "male", "female", "MALE", "FEMALE"],

    },
    location: {
        type: String,
        trim: true,
    },
    photo: {
        type: String,
        trim : true
    },
    gallery : {
        type : [String],
        trim : true
    },
    follower : {
        type : [mongoose.Schema.Types.ObjectId],
        ref : "User",
    },
    following : {
        type : [mongoose.Schema.Types.ObjectId],
        ref : "User",
    },
    accessToken: {
        type: String,
        trim : true
    },
    isActivate : {
        type: Boolean,
        default: false
    },
    isAdmin : {
        type : Boolean,
        default: true
    }
}, {
    timestamps: true
});


// Export Schema
export default mongoose.model('user', userSchema);