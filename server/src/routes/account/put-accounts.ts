import { Request, Response, Router } from "express";
import { Account } from "../../models/account";
import { authenticateToken, authorizeAdmin } from '../../middleware/auth';



const router = Router();

router.put('/accounts', authenticateToken, authorizeAdmin, async (request: Request, response: Response): Promise<void> => {
    try {
        const { id, ...updateData } = request.body;
        if (!id) {
            response.status(400).json({ error: 'Account ID is required.' });
            return;
        }

        const updatedAccount = await Account.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true });
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
