import mongoose from "mongoose";

const caseSchema = mongoose.Schema(
  {
    caseTitle: {
      type: String,
      required: true,
    },
    caseDiscription: {
      type: String,
      required: true,
    },
    caseType: {
      type: String,
      required: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lawyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LawyerProfile",
      required: true,
    },
    appointmentTime: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "AvailableDates", 
      required: true,
    },
    caseFile:{
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

const Case = mongoose.model("Case", caseSchema);

export default Case;