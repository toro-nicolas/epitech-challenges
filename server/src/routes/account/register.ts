import { Request, Response, Router } from "express";
import { Account } from "../../models/account";
import bcrypt from "bcrypt";



const router = Router();

router.post('/register', async (request: Request, response: Response): Promise<void> => {
  try {
    let { email, first_name, last_name, password } = request.body;
    if (!email || !first_name || !last_name || !password) {
      response.status(400).json({ message: 'Fields are missing. Please provide email, first name, last name, and password.' });
      return;
    }

    const existing = await Account.findOne({ $or: [{ email }] });
    if (existing) {
      response.status(409).json({ message: 'Email already exists.' });
      return;
    }

    first_name = first_name
        .split(/[-\s]/)
        .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join(first_name.includes('-') ? '-' : ' ');
    last_name = last_name.toUpperCase();
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
    response.status(500).json({ message: 'Server error.', details: err });
    console.log(err);
  }
});

export default router;
