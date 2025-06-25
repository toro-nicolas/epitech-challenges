import express, {Request, Response} from 'express';
import { Activity } from '../../models/activity';
import {authenticateToken, authorizeTeacher} from "../../middleware/auth";
import {createUserActivity, UserActivity} from "../../models/user-activity";



const router = express.Router();

router.post('/activities', authenticateToken, authorizeTeacher, async (request: Request, response: Response): Promise<void> => {
    try {
        if (!request.body.title || !request.body.visible || !request.body.challenge) {
            response.status(400).json({ error: 'Fields are missing. Please provide title, visibility, and challenge.' });
            return;
        }

        const newActivity = new Activity({
            ...request.body,
        });
        await newActivity.save();

        if (request.body.students) {
            if (!Array.isArray(request.body.students)) {
                response.status(400).json({ error: 'Students must be an array of student IDs.' });
                return;
            }
            for (const id in request.body.students) {
                const newUserActivity = await createUserActivity(id, newActivity._id.toString());
                if (newUserActivity) {
                    await newUserActivity.save();
                }
            }
        }

        response.status(201).json(newActivity);
    } catch (err) {
        response.status(500).json({ message: 'Server error.', details: err });
        console.error("Error creating activity:", err);
    }
});
export default router;