import { Request, Response, Router } from "express";
import { Account } from "../../models/account";
import { authenticateToken, authorizeAdmin } from '../../middleware/auth';
import bcrypt from "bcrypt";



const router = Router();

router.post('/accounts', authenticateToken, authorizeAdmin, async (request: Request, response: Response): Promise<void> => {
    try {
        let { email, first_name, last_name, password } = request.body;
        if (!email || !first_name || !last_name || !password) {
            response.status(400).json({ error: 'Fields are missing. Please provide email, first name, last name, and password.' });
            return;
        }

        const existingAccount = await Account.findOne({ email });
        if (existingAccount) {
            response.status(409).json({ error: 'Email already in use.' });
            return;
        }

        first_name = first_name
            .split(/[-\s]/)
            .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
            .join(first_name.includes('-') ? '-' : ' ');
        last_name = last_name.toUpperCase();
        const hashedPassword = await bcrypt.hash(password, 10);

        const newAccount = new Account({
            email,
            first_name,
            last_name,
            password: hashedPassword,
        });
        await newAccount.save();
        response.status(201).json({ message: 'Account created successfully.', account: newAccount });
    } catch (err) {
        response.status(500).json({ error: 'Server error', details: err });
        console.error("Error creating account:", err);
    }
});

export default router;
