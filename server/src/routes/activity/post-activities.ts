import express, {Request, Response} from 'express';
import { Activity } from '../../models/activity';
import {authenticateToken} from "../../middleware/auth";



const router = express.Router();

router.post('/activities/:id', authenticateToken, async (request: Request, response: Response): Promise<void> => {
    const { title, visible, description, challenge, teachers, students, room, start_date, end_data, duration } = request.body;
    if (!title || !visible || !description || !challenge || !teachers || !students || !room || !start_date || !end_data || !duration) {
        response.status(400).json({ error: 'All fields are required.' });
        return;
    }

    try {
        const updatedActivity = await Activity.findByIdAndUpdate(
            request.params.id,
            {
                title,
                visible,
                description,
                challenge,
                teachers,
                students,
                room,
                start_date,
                end_data,
                duration
            },
            { new: true, runValidators: true }
        )

        if (!updatedActivity) {
            response.status(404).json({ error: 'Activity not found.' });
            return;
        }
    } catch (err) {
        response.status(500).json({ message: 'Server error.', details: err });
        console.error("Error creating activity:", err);
    }
});
export default router;