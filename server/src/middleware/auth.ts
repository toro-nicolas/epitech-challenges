import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';



const JWT_SECRET = process.env.JWT_SECRET as string;

export interface AuthenticatedRequest extends Request {
    user?: any;
}

export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if (!token) {
        res.status(401).json({message: 'Access denied. No token provided.'});
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(403).json({ message: 'Invalid or expired token.' });
    }
}

export function authorizeTeacher(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    if (req.user?.role !== 'teacher' && req.user?.role !== 'admin') {
        res.status(403).json({ message: 'Access denied. Teachers only.' });
        return;
    }
    next();
}

export function authorizeAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    if (req.user?.role !== 'admin') {
        res.status(403).json({ message: 'Access denied. Admins only.' });
        return;
    }
    next();
}
