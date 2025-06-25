import express, {Request, Response} from 'express';
import { Activity } from '../../models/activity';
import {authenticateToken, authorizeTeacher} from "../../middleware/auth";



const router = express.Router();

// TODO: supprimer les anciens user activities et ajouter les nouveaux
router.put('/activities/:id', authenticateToken, authorizeTeacher, async (request: Request, response: Response): Promise<void> => {
    try {
        const updatedActivity = await Activity.findByIdAndUpdate(
            request.params.id,
            request.body,
            { new: true, runValidators: true }
        )
        .populate('challenge')
        .populate('teachers')
        .populate('students');

        if (!updatedActivity) {
            response.status(404).json({ error: 'Activity not found.' });
            return;
        }
        response.json(updatedActivity);
    } catch (err) {
        response.status(500).json({ message: 'Server error.', details: err });
        console.log(err);
    }
});

export default router;
