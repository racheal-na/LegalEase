import mongoose from "mongoose"


const UserSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    middleName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phoneNumber:{
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },

},
{timeStamp: true}
)
const User = mongoose.model('User', UserSchema);

export default User;
