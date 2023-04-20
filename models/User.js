import { Schema, model } from "mongoose";

const userSchema = new Schema({
  firstname: {
    type: String,
    require: true,
    trim: true,
  },
  lastname: {
    type: String,
    require: true,
    trim: true,
  },
  email: {
    type: String,
    require: true,
    trim: true,
  },
  password: {
    type: String,
    require: true,
    trim: true,
  },
});

const User = model("User", userSchema);
console.log(User)
export default User;
