import mongoose from "mongoose";


const UserSchema= new mongoose.Schema({
        name:{
            type:String
        },
        email:{
            type:String,
            unique:true,
            required:true
        },
        password:{
            type:String,
            required:true
        },
        role:{
            type:String,
            enum:["superadmin", 'manager', 'social', 'outreach', 'staff'],
            default:'staff'
        },
        department:{
            type:String
        }
},{timestamps:true})


export const User= mongoose.model("User",UserSchema);