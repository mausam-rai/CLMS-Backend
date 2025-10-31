import mongoose from "mongoose";

const instituteSchema= new mongoose.Schema({
    name:{
        type:String
    },
    contact:{
        type:String
    },
    proposalStatus:{
        type:String,
        enum:['Accepted', 'Rejected', 'Pending'],
        default:'Pending'
    },
    visitedDate:{
        type:Date
    },
    staffId:{
        type:mongoose.Schema.Types.ObjectId,
            ref:"User"
    },
    notes:{
        type:String
    }
})


export const Institutions= mongoose.model('Institutions', instituteSchema)