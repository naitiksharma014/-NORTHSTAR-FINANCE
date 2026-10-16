import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
export default async function optionalAdmin(req,res,next){
  try { const token=req.cookies?.adminToken; if(token){ const payload=jwt.verify(token,process.env.JWT_SECRET); const admin=await Admin.findById(payload.sub).select('_id name email role'); if(admin?.role==='admin') req.admin=admin; } } catch {}
  next();
}
