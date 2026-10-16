import mongoose from 'mongoose';
const schema = new mongoose.Schema({ name:{type:String,required:true,trim:true,maxlength:120}, email:{type:String,required:true,trim:true,lowercase:true,maxlength:254}, phone:{type:String,default:'',trim:true,maxlength:40}, subject:{type:String,default:'',trim:true,maxlength:200}, message:{type:String,required:true,trim:true,maxlength:5000}, status:{type:String,enum:['unread','read','replied'],default:'unread'} }, {timestamps:true});
export default mongoose.model('ContactMessage', schema);
