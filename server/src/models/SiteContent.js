import mongoose from 'mongoose';
const schema = new mongoose.Schema({ key:{type:String,unique:true,default:'main'}, content:{type:mongoose.Schema.Types.Mixed,required:true} }, {timestamps:true,minimize:false});
export default mongoose.model('SiteContent', schema);
