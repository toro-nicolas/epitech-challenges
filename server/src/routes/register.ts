import { Request, Response, Router } from "express";
import { Account } from "../models/account";
import bcrypt from "bcrypt";



const router = Router();

router.post('/register', async (request: Request, response: Response): Promise<void> => {
  const { email, username, password } = request.body;
  if (!email || !username || !password) {
    response.status(400).json({ message: 'All fields are required.' });
    return;
  }

  try {
    const existing = await Account.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      response.status(409).json({ message: 'Email or username already exists.' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const account = new Account({
      email,
      username,
      password: hashedPassword,
    });

    await account.save();
    
    response.status(201).json({
      message: 'Account created successfully.',
      user: {
        id: account._id,
        email: account.email,
        username: account.username,
        level: account.level,
      },
    });
  } catch (err) {
    response.status(500).json({ message: 'Server error.' });
  }
});

export default router;
