import {Router} from 'express';
import crypto from 'node:crypto';
import multer from 'multer';
import requireAdmin from '../middleware/requireAdmin.js';
import Upload from '../models/Upload.js';
import {asyncHandler} from '../utils/asyncHandler.js';
import {detectImageType} from '../utils/imageType.js';
const router=Router();
// SVG is intentionally excluded because untrusted SVG can contain active content.
const allowedTypes=new Set(['image/jpeg','image/png','image/webp','image/gif']);
const upload=multer({storage:multer.memoryStorage(),limits:{fileSize:5*1024*1024,files:1},fileFilter:(_req,file,cb)=>allowedTypes.has(file.mimetype)?cb(null,true):cb(Object.assign(new Error('Only JPG, PNG, WEBP and GIF images are accepted.'),{status:400}))});
router.post('/',requireAdmin,upload.single('image'),asyncHandler(async(req,res)=>{
  if(!req.file)return res.status(400).json({message:'Please choose an image.'});
  const type=detectImageType(req.file.buffer);
  if(!type)return res.status(400).json({message:'That file is not a valid JPG, PNG, WEBP or GIF image.'});
  const name=`${crypto.randomUUID()}${type.ext}`;
  await Upload.create({name,mimeType:type.mime,size:req.file.size,data:req.file.buffer});
  res.status(201).json({url:`/uploads/${name}`,filename:name});
}));
export default router;