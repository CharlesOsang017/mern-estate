import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fpixabay.com%2Fvectors%2Fblank-profile-picture-mystery-man-973460%2F&psig=AOvVaw0aY0t8gyqSa5UTzPH4vDz4&ust=1705405003593000&source=images&cd=vfe&ved=0CBMQjRxqFwoTCMDU7_Cm34MDFQAAAAAdAAAAABAE"
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
