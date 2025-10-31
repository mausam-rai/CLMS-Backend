import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    projectName: {
        type: String,
        required: true,
    },
    clientName: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ["International", "Local"], // keep consistent
        required: true,
    },
    meetingSchedule: {
        type: Date,
    },
    status: {
        type: String,
        enum: ["Scheduled", "In Progress", "Completed", "On Hold"],
        default: "Scheduled",
    },
    assignedManager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // one project manager
    },
    assignedTo: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // multiple staff members
        }
    ],
    startingDate: {
        type: Date,
    },
    endingDate: {
        type: Date,
    },
    totalDays: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

// Auto-calculate totalDays before saving
projectSchema.pre("save", function (next) {
    if (this.startingDate && this.endingDate) {
        const diff = Math.ceil(
            (this.endingDate - this.startingDate) / (1000 * 60 * 60 * 24)
        );
        this.totalDays = diff > 0 ? diff : 0;
    }
    next();
});

export const Project = mongoose.model("Project", projectSchema);
