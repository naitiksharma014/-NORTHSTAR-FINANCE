import SiteContent from '../models/SiteContent.js';
import { defaultSiteContent } from '../config/defaultData.js';
export async function getSiteContent(req,res){const record=await SiteContent.findOne({key:'main'}).lean();res.json(record?.content||defaultSiteContent)}
export async function updateSiteContent(req,res){if(!req.body||typeof req.body!=='object'||Array.isArray(req.body))return res.status(400).json({message:'A content object is required.'});const record=await SiteContent.findOneAndUpdate({key:'main'},{$set:{content:req.body}},{new:true,upsert:true,runValidators:true,setDefaultsOnInsert:true});res.json({message:'Website content saved.',content:record.content})}
