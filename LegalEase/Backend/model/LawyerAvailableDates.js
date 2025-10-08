import mongoose from "mongoose";

const LawyerAvailableSchema = mongoose.Schema({
    lawyer:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lawyer'
    },
    availableDate:{
        type: Date,
        required: true,
    },
    startTime:{
      type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
      },
      message: props => `${props.value} is not a valid time format! Use HH:MM`
    }
    },
    endTime:{
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
      },
      message: props => `${props.value} is not a valid time format! Use HH:MM`
    }
    }

},
{
    timestamps: true
}
)


LawyerAvailableSchema.index(
    { lawyer: 1, availableDate: 1, startTime: 1, endTime: 1 }, 
    { unique: true }
);
const AvailableDates = mongoose.model('AvailableDates', LawyerAvailableSchema);

export default AvailableDates;