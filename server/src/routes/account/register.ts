import { Request, Response, Router } from "express";
import { Account } from "../../models/account";
import bcrypt from "bcrypt";



const router = Router();

router.post('/register', async (request: Request, response: Response): Promise<void> => {
  let { email, first_name, last_name, password } = request.body;
  if (!email || !first_name || !last_name || !password) {
    response.status(400).json({ message: 'All fields are required.' });
    return;
  }

  try {
    const existing = await Account.findOne({ $or: [{ email }] });
    if (existing) {
      response.status(409).json({ message: 'Email already exists.' });
      return;
    }

    last_name = last_name.toUpperCase();
    first_name = first_name
        .split(/[-\s]/)
        .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join(first_name.includes('-') ? '-' : ' ');
    const hashedPassword = await bcrypt.hash(password, 10);

    const account = new Account({
      email,
      first_name,
      last_name,
      password: hashedPassword,
    });

    await account.save();
    
    response.status(201).json({
      message: 'Account created successfully.',
      user: {
        id: account._id,
        email: account.email,
        first_name: account.first_name,
        last_name: account.last_name,
      },
    });
  } catch (err) {
    response.status(500).json({ message: 'Server error.' });
  }
});

export default router;
