import express from 'express'
import { authenticateLawyerToken, authenticateToken, createCase, getLawyerCase, getUserCase, verifyClient, getLawyerStats } from '../controllers/Case.js';


const router = express.Router();


router.post('/createCase',authenticateToken, createCase);
router.get('/verifyUser', authenticateToken, verifyClient);
router.get('/getUserCase', authenticateToken, getUserCase);
router.get('/getLawyerCase', authenticateLawyerToken, getLawyerCase);
router.get('/getLawyerStats', authenticateLawyerToken, getLawyerStats);

export default router;