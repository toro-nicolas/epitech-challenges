import express, {Request, Response} from 'express';
import { Challenge } from '../../models/challenge';
import {authenticateToken, authorizeTeacher} from "../../middleware/auth";
import fs from 'fs';



const router = express.Router();

router.delete('/challenges/:id', authenticateToken, authorizeTeacher, async (request: Request, response: Response): Promise<void> => {
    try {
        const challengeId = request.params.id;
        
        const challenge = await Challenge.findById(challengeId);
        if (!challenge) {
            response.status(404).json({ error: 'Challenge not found' });
            return;
        }

        if (challenge.working_files && challenge.working_files.length > 0) {
            challenge.working_files.forEach(file => {
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
            });
        }

        if (challenge.tester && fs.existsSync(challenge.tester)) {
            fs.unlinkSync(challenge.tester);
        }

        await Challenge.findByIdAndDelete(challengeId);        
        response.json({ message: 'Challenge ' + challengeId + ' deleted' });
    } catch (err) {
        response.status(500).json({ error: 'Server error', details: err });
        console.error("Error deleting challenge:", err);
    }
});

export default router;
