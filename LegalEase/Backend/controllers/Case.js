import User from "../model/User.js";
import Case from "../model/Case.js";
import Lawyer from "../model/Lawyer.js";
import LawyerProfile from "../model/LawyerProfile.js";
import jwt from 'jsonwebtoken'
import AvailableDates from "../model/LawyerAvailableDates.js";
export const authenticateLawyerToken = async (req, res, next) => {
  try {
     
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({status: false, message: "Access denied. No token provided." });
    }
    
 
    const decoded = jwt.verify(token, process.env.KEY);
    console.log("Current Lawyer Id:", decoded.id);
    
    const lawyer = await LawyerProfile.findOne({ 
      lawyer: decoded.id,
    }).select('-password'); 
     
       if (!lawyer) {
      req.user = null; 
      console.log("No lawyer profile found for user:", decoded.id);
      return next();
    }
    
    
    req.user = lawyer;
    next();
  } catch (error) {
   
    console.error("Token verification error:", error);
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};

export const authenticateToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({status: false, message: "Access denied. No token provided." });
    }
    
 
    const decoded = jwt.verify(token, process.env.KEY);
    const user = await User.findOne({ 
      email: decoded.email,
    }).select('-password'); 
    
    if (!user) {
      return res.status(401).json({status: false, message: "Invalid token. User not found." });
    }
    
    
    req.user = user;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};



export async function createCase(req, res) {
  try {
    const { caseTitle, caseDiscription, caseType, lawyerId, appointmentTime,caseFile } = req.body;

    if (!caseTitle || !caseDiscription || !caseType || !lawyerId || !appointmentTime) {
      return res.status(400).json({ status: false, message: "All fields are required" });
    }


    const availableTime = await AvailableDates.findById(appointmentTime);
    if (!availableTime) {
      return res.status(400).json({ status: false, message: "Invalid appointment time" });
    }

    const clientId = req.user._id;

    const newCase = new Case({
      caseTitle,
      caseDiscription,
      caseType,
      client: clientId,
      lawyer: lawyerId,
      appointmentTime: appointmentTime,
      caseFile 
    });

    await newCase.save();



    return res.status(201).json({
      status: true,
      message: "Case created successfully",
      case: newCase,
    });
  } catch (error) {
    console.error("Error creating case:", error);
    return res.status(500).json({ status: false, message: "Server error while creating case" });
  }
}



export async function getUserCase(req, res) {
  try {
    const clientId = req.user._id;

    const cases = await Case.find({ client: clientId })
      .populate("lawyer", "fullName") 
      .populate("client", "fullName email") 
      .populate('appointmentTime')           
      .sort({ createdAt: -1 });                         

    if (!cases) {
      return res.status(404).json({
        status: false,
        message: "No cases found for this user",
      });
    }

    return res.status(200).json({
      status: true,
      cases,
    });
  } catch (error) {
    console.error("Error fetching cases:", error);
    return res.status(500).json({
      status: false,
      message: "Server error while fetching cases",
    });
  }
}


export async function getLawyerCase(req, res) {
  try {
    console.log("Getting Lawyer Cases")
      if (!req.user) {
      return res.status(200).json({
        status: true,
        message: "No lawyer profile found. Please complete your profile setup.",
        cases: [] 
      });
    }



    const lawyerId = req.user._id; 
    const cases = await Case.find({ lawyer: lawyerId })
      .populate("client", "firstName middleName phoneNumber email phoneNumber") 
      .populate("lawyer", "fullName email") 
      .populate('appointmentTime')            
      .sort({ createdAt: -1 });

    if (!cases) {
      return res.status(200).json({
        status: true,
        message: "No cases found for this lawyer",
      });
      
    }
   console.log("Cases Found!!!")
    return res.status(200).json({
      status: true,
      cases,
    });

  } catch (error) {
    console.error("Error fetching lawyer cases:", error);
    return res.status(500).json({
      status: false,
      message: "Server error while fetching lawyer cases",
    });
  }
}


export async function getLawyerStats(req, res) {
  try {
    console.log("Getting Lawyer Stats");
      if (!req.user) {
      return res.status(200).json({
        status: true,
        message: "No lawyer profile found. Please complete your profile setup.",
        stats: {
        cases: 0,
        clients: 0,
      } 
      });
    }



    const lawyerId = req.user.id; 
    const casesCount = await Case.countDocuments({ lawyer: lawyerId });
    

    const clientsCount = casesCount;

    return res.status(200).json({
      status: true,
      stats: {
        cases: casesCount,
        clients: clientsCount
      }
    });

  } catch (error) {
    console.error("Error fetching lawyer stats:", error);
    return res.status(500).json({
      status: false,
      message: "Server error while fetching lawyer stats",
    });
  }
}



export async function verifyClient(req, res) {
  console.log('Authentications');
  return res.json({status: true});
  
}