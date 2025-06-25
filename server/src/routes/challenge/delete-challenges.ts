import express, {Request, Response} from 'express';
import { Challenge } from '../../models/challenge';
import {authenticateToken, authorizeTeacher} from "../../middleware/auth";



const router = express.Router();

router.delete('/challenges/:id', authenticateToken, authorizeTeacher, async (request: Request, response: Response): Promise<void> => {
    try {
        const deleted = await Challenge.findByIdAndDelete(request.params.id);
        if (!deleted) {
            response.status(404).json({ error: 'Challenge not found' });
            return;
        }
        response.json({ message: 'Challenge ' + request.params.id + ' deleted' });
    } catch (err) {
        response.status(500).json({ error: 'Server error', details: err });
    }
});

export default router;
