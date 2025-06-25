import express, {Request, Response} from 'express';
import { Challenge } from '../../models/challenge';
import {authenticateToken, authorizeTeacher} from "../../middleware/auth";



const router = express.Router();

router.get('/challenges', authenticateToken, authorizeTeacher, async (request: Request, response: Response): Promise<void> => {
    try {
        const challenges = await Challenge.find();
        response.json(challenges);
    } catch (err) {
        response.status(500).json({ message: 'Server error.', details: err });
        console.log(err);
    }
});

router.get('/challenges/:id', authenticateToken, authorizeTeacher, async (request: Request, response: Response): Promise<void> => {
    try {
        const challenge = await Challenge.findById(request.params.id);
        if (challenge)
            response.json(challenge);
        else
            response.status(404).json({ error: 'Challenge not found.' });
    } catch (err) {
        response.status(500).json({ message: 'Server error.', details: err });
        console.log(err);
    }
});

export default router;
