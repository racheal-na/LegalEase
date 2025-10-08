import express from "express"
import { handleSignup, handleLogin, handleLogout, verifyLawyer , authenticateToken} from "../controllers/lawyerAuth.js";

const router = express.Router();


router.post('/signup', handleSignup);
router.post('/login', handleLogin);
router.get('/logout', handleLogout);
router.get('/verifyLawyer',authenticateToken, verifyLawyer);

export default router;