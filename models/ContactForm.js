import mongoose from "mongoose";

const contactFormSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First name is required"],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email address is required"],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
  },
  phone: {
    type: String,
    trim: true,
  },
  company: {
    type: String,
    trim: true,
  },
  service: {
    type: String,
    trim: true,
  },
  budget: {
    type: String,
    trim: true,
  },
  message: {
    type: String,
    required: [true, "Message is required"],
    trim: true,
  },
  newsletter: {
    type: Boolean,
    default: false,
  },
},
 { timestamps: true }
);

export default mongoose.model("ContactForm", contactFormSchema);
