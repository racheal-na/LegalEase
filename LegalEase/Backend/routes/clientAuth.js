import express from 'express'
import { authenticateToken, handleLogin, handleLogout, handleSignup, verifyClient } from '../controllers/clientAuth.js';
const router = express.Router();


router.post('/signup', handleSignup);
router.post('/login', handleLogin);
router.get('/verifyUser', authenticateToken, verifyClient);
router.get('/logout', handleLogout);
export default router;