import mongoose from 'mongoose';
const schema = new mongoose.Schema({ name:{type:String,required:true,trim:true}, email:{type:String,required:true,unique:true,lowercase:true,trim:true}, passwordHash:{type:String,required:true}, role:{type:String,enum:['admin'],default:'admin'}, lastLoginAt:{type:Date,default:null} }, {timestamps:true});
export default mongoose.model('Admin', schema);
