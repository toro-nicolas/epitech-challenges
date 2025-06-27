import express, {Request, Response} from 'express';
import { Challenge } from '../../models/challenge';
import {authenticateToken, authorizeTeacher} from "../../middleware/auth";
import {upload} from "../../middleware/upload";
import fs from 'fs';
import path from 'path';



const router = express.Router();

router.put('/challenges/:id', authenticateToken, authorizeTeacher, upload.fields([{ name: 'working_files' }, { name: 'tester', maxCount: 1 }]), async (request: Request, response: Response): Promise<void> => {
    try {
        const challengeId = request.params.id;
        
        const existingChallenge = await Challenge.findById(challengeId);
        if (!existingChallenge) {
            response.status(404).json({ error: 'Challenge not found.' });
            return;
        }

        const files = request.files as {
            working_files?: Express.Multer.File[];
            tester?: Express.Multer.File[];
        };

        const updateData: any = {};

        if (request.body.title !== undefined) {
            updateData.title = request.body.title;
        }
        if (request.body.description !== undefined) {
            updateData.description = request.body.description;
        }
        if (request.body.language !== undefined) {
            updateData.language = request.body.language;
        }

        if (files && files.working_files && files.working_files.length > 0) {
            if (existingChallenge.working_files && existingChallenge.working_files.length > 0) {
                existingChallenge.working_files.forEach(file => {
                    if (fs.existsSync(file.path)) {
                        fs.unlinkSync(file.path);
                    }
                });
            }

            const workingFilesData = files.working_files.map(file => ({
                filename: file.originalname,
                path: file.path,
            }));
            updateData.working_files = workingFilesData;
        }

        if (files && files.tester && files.tester.length > 0) {
            if (existingChallenge.tester && fs.existsSync(existingChallenge.tester)) {
                fs.unlinkSync(existingChallenge.tester);
            }

            updateData.tester = files.tester[0].path;
        }

        const updatedChallenge = await Challenge.findByIdAndUpdate(
            challengeId,
            updateData,
            { new: true, runValidators: true }
        );
        response.json(updatedChallenge);
    } catch (err) {
        response.status(500).json({ message: 'Server error.', details: err });
        console.log(err);
    }
});

export default router;
