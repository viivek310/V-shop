
import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
  name:String,
  username: { type: String, unique: true },
  password: String,
  oldEmail:{ type: String, unique: true },
  email: { type: String, unique: true },
  isAdmin: { type: Boolean, default: false },
  profileImg: { type: String, default: "" },
  cart: [String]
},{timestamps: true});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;