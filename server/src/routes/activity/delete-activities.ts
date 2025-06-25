import express, {Request, Response} from 'express';
import { Activity } from '../../models/activity';
import {authenticateToken, authorizeTeacher} from "../../middleware/auth";



const router = express.Router();

router.delete('/activities/:id', authenticateToken, authorizeTeacher, async (request: Request, response: Response): Promise<void> => {
    try {
        const deleted = await Activity.findByIdAndDelete(request.params.id);
        if (!deleted) {
            response.status(404).json({ error: 'Activity not found' });
            return;
        }
        // TODO: delete user activities associated with this activity
        response.json({ message: 'Activity ' + request.params.id + ' deleted' });
    } catch (err) {
        response.status(500).json({ error: 'Server error', details: err });
    }
});

export default router;
