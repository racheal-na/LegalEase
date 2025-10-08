import mongoose from "mongoose";

const LawyerProfileSchema = mongoose.Schema({
    lawyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lawyer', 
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    phoneNumber:{
        type: String,
        required: true
    },
    licenseNumber: {
        type: String,
        required: true,
    },
    YearsOfExperience:{
        type: String,
        required: true,
    },
    currentWorkingLocation:{
        type: String,
        required: true,
    },
    minPriceInETB:{
        type: String,
        required: true,
    },
    profileImage:{
        type: String,
        required: true
    }
},
{timeStamp: true}
);

const LawyerProfile = mongoose.model('LawyerProfile', LawyerProfileSchema);

export default LawyerProfile;