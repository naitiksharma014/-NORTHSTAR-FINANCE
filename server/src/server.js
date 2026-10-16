import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {connectDB} from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import siteContentRoutes from './routes/siteContentRoutes.js';
import servicesRoutes from './routes/servicesRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import testimonialsRoutes from './routes/testimonialsRoutes.js';
import faqsRoutes from './routes/faqsRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import {notFound,errorHandler} from './middleware/errorHandler.js';
const __dirname=path.dirname(fileURLToPath(import.meta.url));
// Resolve the environment file relative to this server file, not the terminal's current directory.
dotenv.config({ path: path.resolve(__dirname, '../.env') });
const app=express();const port=Number(process.env.PORT||5000);
const awaitlessMongooseState = () => mongoose.connection.readyState;
const allowedOrigins=(process.env.CLIENT_URL||'http://localhost:5173').split(',').map((origin)=>origin.trim());
app.disable('x-powered-by');
app.use(helmet({
  contentSecurityPolicy: { directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
    fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
    imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
    connectSrc: ["'self'"],
    objectSrc: ["'none'"],
    frameAncestors: ["'none'"]
  } },
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
app.use(cors({origin:(origin,cb)=>{if(!origin||allowedOrigins.includes(origin))return cb(null,true);return cb(new Error('Origin is not allowed by CORS.'));},credentials:true}));
app.use(express.json({limit:'1mb'}));app.use(express.urlencoded({extended:true,limit:'1mb'}));app.use(cookieParser());if(process.env.NODE_ENV!=='production')app.use(morgan('dev'));
app.use('/uploads',express.static(path.resolve(__dirname,'../uploads'),{maxAge:'7d',immutable:true}));
app.get('/api/health',(_req,res)=>res.json({status:'ok',service:'globalfpo-mern-api',timestamp:new Date().toISOString()}));
app.get('/api/health/ready',(_req,res)=>{
  const databaseReady = (awaitlessMongooseState()) === 1;
  const emailConfigured = ['SMTP_HOST','SMTP_PORT','SMTP_USER','SMTP_PASS'].every((key)=>String(process.env[key]||'').trim());
  const ready = databaseReady;
  res.status(ready?200:503).json({status:ready?'ready':'not_ready',database:databaseReady?'connected':'disconnected',email:emailConfigured?'configured':'not_configured',timestamp:new Date().toISOString()});
});
app.use('/api/auth',authRoutes);app.use('/api/site-content',siteContentRoutes);app.use('/api/services',servicesRoutes);app.use('/api/team',teamRoutes);app.use('/api/testimonials',testimonialsRoutes);app.use('/api/faqs',faqsRoutes);app.use('/api/messages',messageRoutes);app.use('/api/uploads',uploadRoutes);
app.use(notFound);app.use(errorHandler);
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 24) {
  console.error('JWT_SECRET is missing or too short. Set a random secret of at least 24 characters in server/.env.');
  process.exit(1);
}
connectDB().then(()=>app.listen(port,()=>console.log(`API running at http://localhost:${port}`))).catch((error)=>{console.error('Could not connect to MongoDB:',error.message);console.error('Confirm server/.env exists and MONGODB_URI is valid.');process.exit(1);});
