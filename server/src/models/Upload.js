import mongoose from 'mongoose';
// Images are stored in MongoDB so they survive restarts/redeploys on hosts with an ephemeral disk (e.g. Render free tier).
const schema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, index: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
  data: { type: Buffer, required: true }
}, { timestamps: true });
export default mongoose.model('Upload', schema);