import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
const cookieOptions = () => {
  const production = process.env.NODE_ENV === 'production';
  const sameSite = process.env.COOKIE_SAME_SITE || (production ? 'none' : 'lax');
  const secure = process.env.COOKIE_SECURE ? process.env.COOKIE_SECURE.toLowerCase() === 'true' : production;
  return { httpOnly: true, secure, sameSite, maxAge: 24*60*60*1000, path: '/' };
};
export async function login(req,res) {
  const email=String(req.body.email||'').trim().toLowerCase(), password=String(req.body.password||'');
  if(!email||!password) return res.status(400).json({message:'Email and password are required.'});
  const admin=await Admin.findOne({email});
  if(!admin || !(await bcrypt.compare(password,admin.passwordHash))) return res.status(401).json({message:'Invalid admin email or password.'});
  const token=jwt.sign({sub:admin._id.toString(),role:'admin'},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN||'1d'});
  admin.lastLoginAt=new Date(); await admin.save(); res.cookie('adminToken',token,cookieOptions());
  res.json({admin:{id:admin._id,name:admin.name,email:admin.email}});
}
export function me(req,res){res.json({admin:{id:req.admin._id,name:req.admin.name,email:req.admin.email}})}
export function logout(req,res){const options=cookieOptions();res.clearCookie('adminToken',{httpOnly:true,secure:options.secure,sameSite:options.sameSite,path:'/'});res.json({message:'Signed out successfully.'})}
