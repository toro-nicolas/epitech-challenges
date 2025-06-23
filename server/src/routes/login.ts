import { Request, Response, Router } from "express";
import { Account } from "../models/account";
import bcrypt from "bcrypt";



const router = Router();

router.post('/login', async (request: Request, response: Response): Promise<void> => {
  const { email, password } = request.body;
  if (!email || !password) {
    response.status(400).json({ message: 'Email and password are required.' });
    return;
  }

  try {
    const user = await Account.findOne({ email });
    if (!user) {
      response.status(401).json({ message: 'Invalid email or password.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      response.status(401).json({ message: 'Invalid email or password.' });
      return;
    }

    response.json({
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        level: user.level,
      },
    });
  } catch (err) {
    response.status(500).json({ message: 'Server error' });
  }
});

export default router;
