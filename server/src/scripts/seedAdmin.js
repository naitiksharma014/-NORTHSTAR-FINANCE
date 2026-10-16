import dotenv from 'dotenv';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import {connectDB} from '../config/db.js';
import Admin from '../models/Admin.js';
import SiteContent from '../models/SiteContent.js';
import Service from '../models/Service.js';
import TeamMember from '../models/TeamMember.js';
import Testimonial from '../models/Testimonial.js';
import FAQ from '../models/FAQ.js';
import {defaultSiteContent,defaultServices,defaultTeam,defaultTestimonials,defaultFaqs} from '../config/defaultData.js';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
try {
  const {ADMIN_NAME,ADMIN_EMAIL,ADMIN_PASSWORD}=process.env;
  if(!ADMIN_NAME||!ADMIN_EMAIL||!ADMIN_PASSWORD||ADMIN_PASSWORD==='replace-with-a-strong-password')throw new Error('Missing admin credentials. Set ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD in server/.env.');
  if(!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 24)throw new Error('Set JWT_SECRET to a random string of at least 24 characters in server/.env.');
  if(ADMIN_PASSWORD.length<12)throw new Error('ADMIN_PASSWORD must be at least 12 characters long.');
  await connectDB(); const passwordHash=await bcrypt.hash(ADMIN_PASSWORD,12);
  await Admin.findOneAndUpdate({email:ADMIN_EMAIL.trim().toLowerCase()},{$set:{name:ADMIN_NAME,email:ADMIN_EMAIL.trim().toLowerCase(),passwordHash,role:'admin'}},{upsert:true,new:true,setDefaultsOnInsert:true});
  if(!(await SiteContent.exists({key:'main'})))await SiteContent.create({key:'main',content:defaultSiteContent});
  if(await Service.countDocuments()===0)await Service.insertMany(defaultServices);
  if(await TeamMember.countDocuments()===0)await TeamMember.insertMany(defaultTeam);
  if(await Testimonial.countDocuments()===0)await Testimonial.insertMany(defaultTestimonials);
  if(await FAQ.countDocuments()===0)await FAQ.insertMany(defaultFaqs);
  console.log(`Admin account created/updated: ${ADMIN_EMAIL.trim().toLowerCase()}`);console.log('Use the exact ADMIN_EMAIL and ADMIN_PASSWORD values from server/.env to sign in.');console.log('Starter content is ready. Replace sample copy and testimonials before publishing.')
} catch(error){console.error('Seed failed:',error.message);process.exitCode=1;} finally {await mongoose.disconnect().catch(()=>{});}
