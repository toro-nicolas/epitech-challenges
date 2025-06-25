import express, {Request, Response} from 'express';
import { Challenge } from '../../models/challenge';
import {authenticateToken, authorizeTeacher} from "../../middleware/auth";
import {upload} from "../../middleware/upload";



const router = express.Router();
//TODO: need to be tested
router.post('/challenge', authenticateToken, authorizeTeacher, upload.fields([{ name: 'working_files' }, { name: 'tester', maxCount: 1 }]), async (request: Request, response: Response): Promise<void> => {
    try {
        const files = request.files as {
            working_files?: Express.Multer.File[];
            tester?: Express.Multer.File[];
        };
        if (!files || !files.tester || files.tester.length === 0) {
            response.status(400).json({ message: 'Tester file is required.' });
            return;
        }

        const workingFilesData = (files.working_files || []).map(file => ({
            filename: file.originalname,
            path: file.path,
        }));
        const testerPath = files.tester[0].path;

        const newChallenge = new Challenge({
            title: request.body.title,
            description: request.body.description,
            language: request.body.language,
            working_files: workingFilesData,
            tester: testerPath
        });
        await newChallenge.save();
        response.status(201).json(newChallenge);
    } catch (err) {
        response.status(500).json({ message: 'Server error.', details: err });
        console.error("Error creating challenge:", err);
    }
});

export default router;
