import {Router} from 'express';
import path from 'node:path';
import crypto from 'node:crypto';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import multer from 'multer';
import requireAdmin from '../middleware/requireAdmin.js';
const router=Router();
const __dirname=path.dirname(fileURLToPath(import.meta.url));
// Resolve uploads relative to the server package so uploads work both when started
// from the monorepo root and when started inside /server.
const uploadDir=path.resolve(__dirname,'../../uploads');
fs.mkdirSync(uploadDir,{recursive:true});
// SVG is intentionally excluded because untrusted SVG can contain active content.
const allowedTypes=new Map([['image/jpeg','.jpg'],['image/png','.png'],['image/webp','.webp'],['image/gif','.gif']]);
const storage=multer.diskStorage({destination:(_req,_file,cb)=>cb(null,uploadDir),filename:(_req,file,cb)=>cb(null,`${crypto.randomUUID()}${allowedTypes.get(file.mimetype)||''}`)});
const upload=multer({storage,limits:{fileSize:5*1024*1024,files:1},fileFilter:(_req,file,cb)=>allowedTypes.has(file.mimetype)?cb(null,true):cb(Object.assign(new Error('Only JPG, PNG, WEBP and GIF images are accepted.'),{status:400}))});
router.post('/',requireAdmin,upload.single('image'),(req,res)=>{if(!req.file)return res.status(400).json({message:'Please choose an image.'});res.status(201).json({url:`/uploads/${req.file.filename}`,filename:req.file.filename})});
export default router;
