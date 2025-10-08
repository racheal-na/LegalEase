import express from 'express'
import { authenticateToken, handleCreateProfile, getProfileById , getProfile, updateProfile} from '../controllers/lawyerProfile.js';
const router = express.Router();

router.post('/createProfile',authenticateToken, handleCreateProfile);
router.get('/getProfileById',authenticateToken, getProfileById);
router.get('/getProfile', getProfile);
router.put('/updateProfile', authenticateToken, updateProfile)

export default router;