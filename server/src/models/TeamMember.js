import mongoose from 'mongoose';
const schema = new mongoose.Schema({ name:{type:String,required:true,trim:true}, role:{type:String,default:''}, bio:{type:String,default:''}, imageUrl:{type:String,default:''}, linkedinUrl:{type:String,default:''}, order:{type:Number,default:0}, active:{type:Boolean,default:true} }, {timestamps:true});
export default mongoose.model('TeamMember', schema);
