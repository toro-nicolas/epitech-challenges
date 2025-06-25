import express, {Request, Response} from 'express';
import { Challenge } from '../../models/challenge';
import {authenticateToken, authorizeTeacher} from "../../middleware/auth";



const router = express.Router();

router.post('/challenge', authenticateToken, authorizeTeacher, async (request: Request, response: Response): Promise<void> => {
    try {
        const newChallenge = new Challenge({
            ...request.body,
        });
        await newChallenge.save();
        response.status(201).json(newChallenge);
    } catch (err) {
        response.status(500).json({ message: 'Server error.', details: err });
        console.error("Error creating challenge:", err);
    }
});

export default router;
