import { Request, Response, Router } from "express";
import { Account } from "../../models/account";
import { authenticateToken, authorizeAdmin } from '../../middleware/auth';



const router = Router();

router.get('/accounts', authenticateToken, authorizeAdmin, async (request: Request, response: Response): Promise<void> => {
    try {
        const accounts = await Account.find({}, '-password');
        response.json(accounts);
    } catch (err) {
        response.status(500).json({ message: 'Server error.', details: err });
        console.error("Error fetching accounts:", err);
    }
});

export default router;
