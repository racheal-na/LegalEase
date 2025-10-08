import Lawyer from "../model/Lawyer.js";
import AvailableDates from "../model/LawyerAvailableDates.js";
import jwt from 'jsonwebtoken';
import LawyerProfile from '../model/LawyerProfile.js'

export const authenticateToken = async (req, res, next) => {
  try {
  
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({status: false, message: "Access denied. No token provided." });
    }
    
 
    const decoded = jwt.verify(token, process.env.KEY);
    
    
    const lawyer = await Lawyer.findOne({ 
      email: decoded.email,
    }).select('-password'); 
    
    if (!lawyer) {
      return res.status(401).json({status: false, message: "Invalid token. User not found." });
    }
    
    
    req.user = lawyer;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};

export async function setAvailableDate(req, res) {
    try {
       
        const lawyer = await Lawyer.findOne(req.user._id);
        console.log(req.user._id);
        if (!lawyer) {
            console.log("Lawyer Not Found!");
            return res.status(404).json({ message: "No Profile Found" });
        }

        const { availableDate, startTime, endTime } = req.body;

        
        if (!availableDate || !startTime || !endTime) {
            return res.status(400).json({ 
                message: "Available date, start time, and end time are required" 
            });
        }

    
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
            return res.status(400).json({ 
                message: "Invalid time format. Use HH:MM" 
            });
        }

 
        const [startHours, startMinutes] = startTime.split(':').map(Number);
        const [endHours, endMinutes] = endTime.split(':').map(Number);
        
        const startTotalMinutes = startHours * 60 + startMinutes;
        const endTotalMinutes = endHours * 60 + endMinutes;
        
        if (endTotalMinutes <= startTotalMinutes) {
            return res.status(400).json({ 
                message: "End time must be after start time" 
            });
        }

        const existingSlots = await AvailableDates.find({
            lawyer: req.user._id,
            availableDate: new Date(availableDate)
        });

        for (const slot of existingSlots) {
            const [existingStartHours, existingStartMinutes] = slot.startTime.split(':').map(Number);
            const [existingEndHours, existingEndMinutes] = slot.endTime.split(':').map(Number);
            
            const existingStartTotal = existingStartHours * 60 + existingStartMinutes;
            const existingEndTotal = existingEndHours * 60 + existingEndMinutes;
            
            if ((startTotalMinutes >= existingStartTotal && startTotalMinutes < existingEndTotal) ||
                (endTotalMinutes > existingStartTotal && endTotalMinutes <= existingEndTotal) ||
                (startTotalMinutes <= existingStartTotal && endTotalMinutes >= existingEndTotal)) {
                return res.status(400).json({ 
                    message: "Time slot overlaps with existing availability" 
                });
            }
        }

   
        const newAvailability = new AvailableDates({
            lawyer: req.user._id,
            availableDate: new Date(availableDate),
            startTime,
            endTime
        });

        await newAvailability.save();

        res.status(201).json({
            message: "Availability added successfully",
            availability: newAvailability
        });

    } catch (error) {
        console.log("Setting Available Date Error:", error);
        
        if (error.code === 11000) {
            return res.status(400).json({ 
                message: "This time slot already exists" 
            });
        }
        
        res.status(500).json({ 
            message: "Server error while setting availability" 
        });
    }
}




export async function getAvailableDates(req, res) {
    try {
        const lawyerId = req.user._id;
        
        const availableDates = await AvailableDates.find({ 
            lawyer: lawyerId 
        }).sort({ 
            availableDate: 1, 
            startTime: 1 
        });

        res.json(availableDates);
    } catch (error) {
        console.log("Getting Available Dates Error:", error);
        res.status(500).json({ 
            message: "Server error while fetching availability" 
        });
    }
}

export async function getAvailableDatesForUser(req, res) {
    try {
        const { lawyerId } = req.query;
        console.log("Lawyer Profile Id:", lawyerId);
        
       
        const lawyerProfile = await LawyerProfile.findById(lawyerId);
        
        if (!lawyerProfile) {
            return res.status(404).json({ 
                message: "Lawyer profile not found" 
            });
        }
   
        const availableDates = await AvailableDates.find({ 
            lawyer: lawyerProfile.lawyer
        }).sort({ 
            availableDate: 1, 
            startTime: 1 
        });

        res.json(availableDates);
    } catch (error) {
        console.log("Getting Available Dates Error:", error);
        res.status(500).json({ 
            message: "Server error while fetching availability" 
        });
    }
}
export async function deleteAvailableDate(req, res) {
    try {
        const { id } = req.params;
        const lawyerId = req.user._id;

        const availability = await AvailableDates.findOne({
            _id: id,
            lawyer: lawyerId
        });

        if (!availability) {
            return res.status(404).json({ 
                message: "Availability slot not found" 
            });
        }

        await AvailableDates.findByIdAndDelete(id);

        res.json({ 
            message: "Availability slot deleted successfully" 
        });
    } catch (error) {
        console.log("Deleting Available Date Error:", error);
        res.status(500).json({ 
            message: "Server error while deleting availability" 
        });
    }
}