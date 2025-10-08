import Lawyer from "../model/Lawyer.js";
import LawyerProfile from "../model/LawyerProfile.js";
import jwt from 'jsonwebtoken'

export const authenticateToken = async (req, res, next) => {
  try {
  
    const token = req.cookies.token;
    
    if (!token) {
      console.log("No Valid Token Provided!");
      return res.status(401).json({ message: "Access denied. No token provided." });
    }
    
 
    const decoded = jwt.verify(token, process.env.KEY);
    
    
    const lawyer = await Lawyer.findOne({ 
      email: decoded.email,
    }).select('-password'); 
    
    if (!lawyer) {
      console.log("Can not find a user with this ID")
      return res.status(401).json({ message: "Invalid token. User not found." });
    }
    
    
    req.user = lawyer;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};

export async function handleCreateProfile(req, res){
    try {
        const { fullName, phoneNumber, licenseNumber, YearsOfExperience, 
                currentWorkingLocation, minPriceInETB, profileImage } = req.body;

        const newLawyerProfile = new LawyerProfile({
            lawyer: req.user._id,
            fullName,
            phoneNumber,
            licenseNumber,
            YearsOfExperience,
            currentWorkingLocation,
            minPriceInETB,
            profileImage,
        });

        await newLawyerProfile.save();
        console.log("Profile Created");
        
       
        res.status(201).json({ 
            message: "Profile created successfully",
            profile: newLawyerProfile 
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            message: "Error creating profile",
            error: error.message 
        });
    }
}

export async function getProfileById(req, res) {
    try {
        console.log("Getpid")
        const lawyerProfile = await  LawyerProfile.findOne({lawyer: req.user._id});
        if(!lawyerProfile){
           console.log("Profile Not Found!")
            return res.status(200).json({
              status: true,
              message: "No Profile Found",
              lawyerProfile: []
            });
        }
          console.log("profile fetched")
        
        
          return res.status(200).json(lawyerProfile); 
    } catch (error) {
       
        console.log(error);
    }
}



export async function getProfile(req, res) {
     
      try {
        const lawyerProfile = await LawyerProfile.find().sort({createdAt: -1})
        res.status(200).json(lawyerProfile);
      } catch (error) {
            console.error("Error in fetching profile", error)
            res.status(500).json({message: "Internal Server Error"}) 
      }

}




export async function updateProfile  (req, res) {
  try {
    const {
      fullName,
      phoneNumber,
      licenseNumber,
      YearsOfExperience,
      currentWorkingLocation,
      minPriceInETB,
      profileImage
    } = req.body;


    let lawyerProfile = await LawyerProfile.findOne({ lawyer: req.user.id });

    if (!lawyerProfile) {
      return res.status(404).json({ message: 'Lawyer profile not found' });
    }


    if (lawyerProfile.lawyer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied. You can only update your own profile' });
    }

    lawyerProfile.fullName = fullName || lawyerProfile.fullName;
    lawyerProfile.phoneNumber = phoneNumber || lawyerProfile.phoneNumber;
    lawyerProfile.licenseNumber = licenseNumber || lawyerProfile.licenseNumber;
    lawyerProfile.YearsOfExperience = YearsOfExperience || lawyerProfile.YearsOfExperience;
    lawyerProfile.currentWorkingLocation = currentWorkingLocation || lawyerProfile.currentWorkingLocation;
    lawyerProfile.minPriceInETB = minPriceInETB || lawyerProfile.minPriceInETB;
    lawyerProfile.profileImage = profileImage || lawyerProfile.profileImage;

    const updatedProfile = await lawyerProfile.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      profile: updatedProfile
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};