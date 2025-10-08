import express from 'express';
import { authenticateToken, getAvailableDates, getAvailableDatesForUser, setAvailableDate } from '../controllers/availableDates.js';


const router = express.Router();

router.post('/setAvailableDate',authenticateToken, setAvailableDate);
router.get('/getAvailableDate',authenticateToken,  getAvailableDates);
router.get('/getAvailableDateForUser', getAvailableDatesForUser )
export default router;
