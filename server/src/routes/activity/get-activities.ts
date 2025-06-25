import express, {Request, Response} from 'express';
import { Activity } from '../../models/activity';
import {authenticateToken} from "../../middleware/auth";



const router = express.Router();

router.get('/activities', authenticateToken, async (request: Request, response: Response): Promise<void> => {
    try {
        const activities = await Activity.find()
            .populate('challenge')
            .populate('teachers')
            .populate('students');
        response.json(activities);
    } catch (err) {
        response.status(500).json({ message: 'Server error.', details: err });
        console.log(err);
    }
});

router.get('/activities/:id', authenticateToken, async (request: Request, response: Response): Promise<void> => {
    try {
        const activity = await Activity.findById(request.params.id)
            .populate('challenge')
            .populate('teachers')
            .populate('students');
        if (activity)
            response.json(activity);
        else
            response.status(404).json({ error: 'Activity not found.' });
    } catch (err) {
        response.status(500).json({ message: 'Server error.', details: err });
        console.log(err);
    }
});

export default router;
