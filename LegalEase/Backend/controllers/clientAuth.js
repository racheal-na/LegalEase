import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from "../model/User.js";
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



export async function handleSignup (req, res){
    try {
         const  {firstName, middleName, lastName, email, password, phoneNumber} = req.body;

   const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    firstName,
    middleName,
    lastName,
    email,
    phoneNumber,
    password: hashPassword
  })

  await newUser.save()
   console.log("Signedup")
  return res.json({status: true, message: "record registered"})
    } catch (error) {
        console.log(error)
    }
 
 

} 


export async function handleLogin(req, res) {
    
const  {email, password} = req.body;

const user = await User.findOne({email});

if(!user){
     
    return res.status(404).json({message: "User not found!"});
   
}


const verifyPassword = await bcrypt.compare(password, user.password)
if(!verifyPassword){
     return res.status(404).json({message: "Incorrect Password"})
}

const token = jwt.sign({firstName: user.firstName, email: user.email , password: user.password}, process.env.KEY, {expiresIn: '24h'})
res.cookie('token', token, {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  path: '/',
  maxAge: 3600000})
 return res.status(200).json({message:"login successful"})
}


export async function verifyClient(req, res) {
  console.log('Authentication');
  return res.json({status: true});
  
}

export async function handleLogout(req , res){
  res.clearCookie('token');
  return res.json({status: true})
}