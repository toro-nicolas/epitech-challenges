import { Request, Response, Router } from "express";
import { Account } from "../../models/account";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";



const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'epitech-challenges';

router.post('/login', async (request: Request, response: Response): Promise<void> => {
  const { email, password } = request.body;
  //console.log(request.body);
  if (!email || !password) {
    response.status(400).json({ message: 'Email and password are required.' });
    return;
  }

  try {
    const user = await Account.findOne({ email });
    if (!user) {
      response.status(401).json({ message: 'Invalid email or password.' });
      console.log('Login attempt with non-existent email:', email);
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      response.status(401).json({ message: 'Invalid email or password.' });
      console.log('Login attempt with incorrect password for email:', email);
      return;
    }

    const token = jwt.sign(
        { id: user._id, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
    );

    response.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
      },
    });
  } catch (err) {
    response.status(500).json({ message: 'Server error' });
  }
});

export default router;
