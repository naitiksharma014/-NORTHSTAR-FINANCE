import mongoose from 'mongoose';
const schema = new mongoose.Schema({ name:{type:String,required:true,trim:true}, category:{type:String,default:''}, description:{type:String,required:true}, icon:{type:String,default:'briefcase-business'}, imageUrl:{type:String,default:''}, order:{type:Number,default:0}, active:{type:Boolean,default:true} }, {timestamps:true});
export default mongoose.model('Service', schema);
