import express from "express"
import dotenv from 'dotenv'
import cookieParser from "cookie-parser";
import { connectDB } from "./config/connectDB.js";
import cors from 'cors'
import LawyerAuthRouter from '../Backend/routes/lawyerAuth.js'
import LawyerProfileRouter from '../Backend/routes/lawyerProfile.js'
import ClientAuthRouter from '../Backend/routes/clientAuth.js'
import AvailableDate from '../Backend/routes/lawyerAvailableDates.js'
import CasesRouter from '../Backend/routes/Case.js'
dotenv.config();
const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(cors({
  origin: [
    "https://symphonious-arithmetic-afcd3b.netlify.app",
    "http://localhost:5173"],
  credentials: true
}));
app.use('/auth', LawyerAuthRouter)
app.use('/lawyerProfile', LawyerProfileRouter)
app.use('/clientAuth', ClientAuthRouter)
app.use('/availableDate', AvailableDate)
app.use('/cases', CasesRouter)
const port = process.env.PORT || 5001;
connectDB().then(() => {
    app.listen(port, ()=>{
    console.log("Server started on port: ", port);
})}  )
