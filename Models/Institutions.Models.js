import mongoose from "mongoose"

const instituteSchema = new mongoose.Schema({
    name: {
        type: String,
        required:true
    },
    contact: {
        type: String,
        required:true
    },
    proposalStatus: {
        type: String,
        enum: ['Accepted', 'Rejected', 'Pending'],
        default: 'Pending'
    },
    visitedDate: {
        type: Date
    },
    staffId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    notes: {
        type: String
    }
},{timestamps:true})


export const Institutions = mongoose.model('Institutions', instituteSchema)