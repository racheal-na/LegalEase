import Lawyer from "../model/Lawyer.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
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

export async function handleSignup (req, res){
    try {
         const  {firstName, middleName, lastName, email, password} = req.body;

   const existingLawyer = await Lawyer.findOne({ email });
    if (existingLawyer) {
      return res.status(409).json({ message: "User already exists" });
    }

  const hashPassword = await bcrypt.hash(password, 10);

  const newLawyer = new Lawyer({
    firstName,
    middleName,
    lastName,
    email,
    password: hashPassword
  })

  await newLawyer.save()
   console.log("Signedup")
  return res.json({status: true, message: "record registered"})
    } catch (error) {
        console.log(error)
    }
 
 

} 

export async function handleLogin(req, res) {
    
const  {email, password} = req.body;

const lawyer = await Lawyer.findOne({email});

if(!lawyer){
     
    return res.status(404).json({message: "User not found!"});
   
}


const verifyPassword = await bcrypt.compare(password, lawyer.password)
if(!verifyPassword){
     return res.status(404).json({message: "Incorrect Password"})
}

const token = jwt.sign({firstName: lawyer.firstName, email: lawyer.email, id: lawyer._id , password: lawyer.password}, process.env.KEY, {expiresIn: '24h'})
res.cookie('token', token, {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  path: '/',
  maxAge: 3600000})
 return res.status(200).json({message:"login successful"})
}

export async function handleLogout(req , res){
  res.clearCookie('token');
  return res.json({status: true})
}


export async function verifyLawyer(req, res) {
  console.log('Authentications');
  return res.json({status: true});
  
}