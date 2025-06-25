import express, {Request, Response} from 'express';
import { Activity } from '../../models/activity';
import {authenticateToken} from "../../middleware/auth";



const router = express.Router();

router.post('/activities', authenticateToken, async (request: Request, response: Response): Promise<void> => {
    try {
        if (!request.body.title || !request.body.visible || !request.body.challenge) {
            response.status(400).json({ error: 'Fields are missing. Please provide title, visibility, and challenge.' });
            return;
        }

        const newActivity = new Activity({
            ...request.body,
        });
        await newActivity.save();
        response.status(201).json(newActivity);
    } catch (err) {
        response.status(500).json({ message: 'Server error.', details: err });
        console.error("Error creating activity:", err);
    }
});
export default router;