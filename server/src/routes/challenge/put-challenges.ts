import express, {Request, Response} from 'express';
import { Challenge } from '../../models/challenge';
import {authenticateToken, authorizeTeacher} from "../../middleware/auth";



const router = express.Router();

router.put('/challenges/:id', authenticateToken, authorizeTeacher, async (request: Request, response: Response): Promise<void> => {
    try {
        const updatedChallenge = await Challenge.findByIdAndUpdate(
            request.params.id,
            request.body,
            { new: true, runValidators: true }
        );

        if (!updatedChallenge) {
            response.status(404).json({ error: 'Challenge not found.' });
            return;
        }
        response.json(updatedChallenge);
    } catch (err) {
        response.status(500).json({ message: 'Server error.', details: err });
        console.log(err);
    }
});

export default router;
