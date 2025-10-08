import mongoose from "mongoose"


const LawyerSchema = mongoose.Schema({
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
    password: {
        type: String,
        required: true,
    },

},
{timeStamp: true}
)
const Lawyer = mongoose.model('Lawyer', LawyerSchema);

export default Lawyer;
