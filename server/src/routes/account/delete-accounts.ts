import { Request, Response, Router } from "express";
import { Account } from "../../models/account";
import { authenticateToken, authorizeAdmin } from '../../middleware/auth';



const router = Router();

router.delete('/accounts/:id', authenticateToken, authorizeAdmin, async (request: Request, response: Response): Promise<void> => {
    try {
        if (!request.params.id) {
            response.status(400).json({ error: 'Account ID is required.' });
            return;
        }
        //console.log("Attempting to delete account with ID:", request.params.id);

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
