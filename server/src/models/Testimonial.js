import mongoose from 'mongoose';
const schema = new mongoose.Schema({ name:{type:String,required:true,trim:true}, role:{type:String,default:''}, company:{type:String,default:''}, quote:{type:String,required:true}, imageUrl:{type:String,default:''}, order:{type:Number,default:0}, active:{type:Boolean,default:true} }, {timestamps:true});
export default mongoose.model('Testimonial', schema);
