import { Request, Response, Router } from "express";
import { Account } from "../../models/account";
import { authenticateToken } from '../../middleware/auth';
import bcrypt from "bcrypt";



const router = Router();

interface AuthenticatedRequest extends Request {
    user?: { id: string };
}

router.put('/me', authenticateToken, async (request: AuthenticatedRequest, response: Response): Promise<void> => {
    try {
        if (!request.user || !request.user.id) {
            response.status(401).json({ error: 'Unauthorized access.' });
            return;
        }

        if (request.body.email) {
            response.status(400).json({ error: 'Email cannot be updated via this endpoint.' });
            return;
        }

        if (request.body.password) {
            request.body.password = await bcrypt.hash(request.body.password, 10);
        }
        if (request.body.first_name) {
            request.body.first_name = request.body.first_name
                .split(/[-\s]/)
                .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
                .join(request.body.first_name.includes('-') ? '-' : ' ');
        }
        if (request.body.last_name) {
            request.body.last_name = request.body.last_name.toUpperCase();
        }

        const updatedAccount = await Account.findByIdAndUpdate(
            request.user.id,
            request.body,
            { new: true, runValidators: true }
        );
        if (!updatedAccount) {
            response.status(404).json({ error: 'Account not found.' });
            return;
        }
        response.json(updatedAccount);
    } catch (err) {
        response.status(500).json({ message: 'Server error.', details: err });
        console.error("Error updating account:", err);
    }
});

export default router;
