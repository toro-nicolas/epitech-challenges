import { Request, Response, Router } from "express";
import { Account } from "../../models/account";
import { authenticateToken, authorizeAdmin } from '../../middleware/auth';



const router = Router();

router.delete('/accounts/:id', authenticateToken, authorizeAdmin, async (request: Request, response: Response): Promise<void> => {
    try {
        const deletedAccount = await Account.findByIdAndDelete(request.params.id);
        if (!deletedAccount) {
            response.status(404).json({ error: 'Account not found' });
            return;
        }
        response.json({ message: `Account ${request.params.id} deleted` });
    } catch (err) {
        response.status(500).json({ error: 'Server error', details: err });
        console.error("Error deleting account:", err);
    }
});

export default router;
