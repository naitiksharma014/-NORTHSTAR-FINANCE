import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
export default async function requireAdmin(req, res, next) {
  try {
    const token = req.cookies?.adminToken || (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : null);
    if (!token) return res.status(401).json({ message: 'Admin authentication required.' });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(payload.sub).select('_id name email role');
    if (!admin || admin.role !== 'admin') return res.status(401).json({ message: 'Admin session is invalid.' });
    req.admin = admin; return next();
  } catch { return res.status(401).json({ message: 'Your session has expired. Please sign in again.' }); }
}
