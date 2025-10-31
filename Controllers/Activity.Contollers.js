import { Activity } from "../Models/Activity.Models.js";

// create activity

const createActivity = async (req, res) => {
    try {
        const {activityType, details, date} = req.body;
        if(!activityType) return res.status(400).json({message: "activity type is required"});

        const activity= await Activity.create({
            staffId: req.user._id,
            activityType,
            details,
            date
        })

        return res.status(201).json({message: "activity created", activity, success: true});
        
    } catch (error) {
        console.log("Error creating Activity:", error);
        res.status(500).json({ message: "create activity error" });
    }
}


// get all activities (filter through staffId, date range, activity type,by Keywords Search)

const getAllActivities= async(req, res)=>{
    try {
        const{staffId, from, to, activityType, search} = req.query;
        const filter={};
        // Role-based Visibility
        if(["staff", "social", "outreach"].includes(req.user.role)){
            filter.staffId= req.user._id; // staff can only see their own activities
        }else if(staffId){
            filter.staffId= staffId; // managers and superadmins can filter by staffId
        }

        // By activity Type
        if(activityType) filter.activityType= activityType;

        // By Date Range

        if(from||to){
            filter.date={};
            if(from) filter.date.$gte= new Date(from);
            if(to) filter.date.$lte= new Date(to);
        }

        // By Keywords Search in details

        if(search){
            filter.details={$regex: search, $options: "i"} // case insensitive
        }
        const activities= await Activity.find(filter).populate("staffId", "name email role")
        .sort({createdAt: -1});
        return res.status(200).json({message: "all activities", activities, success: true, count:activities.length});
    } catch (error) {
        console.log("Can't get activities", error);
        res.status(500).json({ message: "get activities error" });
    }
}

// Get single activity by Id

const getActivity= async(req, res)=>{
    try {
        const activity= await Activity.findById(req.params.id).populate({path:"staffId", select:"name email role"});
        if(!activity){
            return res.status(404).json({message:"Not Found!"})
        }
        // Check for ownerShip

        const owner= activity.staffId._id.toString()===req.user._id.toString();
        const isAdmin=["superadmin", "manager"].includes(req.user.role)
        if(!owner && !isAdmin){
            return res.status(403).json({message:"You Dont have Access!"})
        }

        return res.status(200).json({message:"Successfully fetch", success:true, activity})
        
    } catch (error) {
        console.log("Error to get Activity", error);
        return res.status(502).json({message:'Error to fetch activity'})
    }
}

// update an Activity

const updateActivity=async(req, res)=>{
    try {
        const activity=await Activity.findById(req.params.id);
        if(!activity) return res.status(404).json({message:"Not Found!"});

        // Check for ownerShip

        const owner= activity.staffId.toString()===req.user._id.toString();
        const isAdmin=["superadmin", "manager"].includes(req.user.role)
        if(!owner && !isAdmin){
            return res.status(403).json({message:"YOu Dont have Access!"})
        }

        const {activityType, details, date}=req.body;
        if(!activityType && !details && !date) return res.status(400).json({message:"All the Field can't be empty"})

        if(activityType) activity.activityType=activityType;
        if(details) activity.details=details;
        if(date) activity.date=date;
        
        await activity.save()

        return res.status(200).json({success:true, message:"activity Updated!", activity})
    } catch (error) {
        console.log("Error to update Activity", error);
        return res.status(502).json({message:'Error to update activity'})
    }
}

// delete Activity

const deleteActivity= async(req, res)=>{
    try {
        const activity= await Activity.findById(req.params.id)
        if(!activity){
            return res.status(404).json({message:"Not Found!"})
        }
        // Check for ownerShip

        const owner= activity.staffId._id.toString()===req.user._id.toString();
        const isAdmin=["superadmin", "manager"].includes(req.user.role)
        if(!owner && !isAdmin){
            return res.status(403).json({message:"YOu Dont have Access!"})
        }

        await activity.deleteOne();

        return res.status(200).json({success:true, message:"Successfully Deleted!"})
        
    } catch (error) {
        console.log("Error to delete Activity", error);
        return res.status(502).json({message:'Error to delete activity'})
    }
}

// stats for pieChart, leaderboard, linechart


export {
    createActivity,
    getAllActivities,
    getActivity,
    updateActivity,
    deleteActivity
}