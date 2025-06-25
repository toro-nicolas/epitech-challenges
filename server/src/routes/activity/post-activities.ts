import express, {Request, Response} from 'express';
import { Activity } from '../../models/activity';
import {authenticateToken} from "../../middleware/auth";



const router = express.Router();

router.post('/activities', authenticateToken, async (request: Request, response: Response): Promise<void> => {
    try {
        const newActivity = new Activity(request.body);
        await newActivity.save();
        response.status(201).json(newActivity);
    } catch (err) {
        response.status(500).json({ message: 'Server error.', details: err });
        console.log(err);
    }
});

export default router;