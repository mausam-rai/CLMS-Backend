import mongoose from "mongoose";
const leadSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: true
  },
  contact: String,
  email: {
    type: String,
    required: true
  },
  source: String, // e.g., 'Outreach Visit', 'Social Media', 'Referral'
  status: {
    type: String,
    enum: ['Pending', 'Active', 'Enrolled', 'Dropped'],
    default: 'Pending'
  },
  lastContactDate: Date,
  nextFollowUpDate: Date,
  notes: String,
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export const Lead = mongoose.model('Lead', leadSchema);