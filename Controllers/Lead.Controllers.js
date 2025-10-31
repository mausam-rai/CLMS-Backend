import { Lead } from "../Models/Lead.Models.js";

// admin and manager can only create
const createLead = async (req, res) => {
    try {
        if (!req.user || !['superadmin', 'manager'].includes(req.user.role)) {
      return res.status(400).json({ message: "Access not granted, Only admin and manager can Update Project" })
    }
        const {
            studentName,
            contact,
            email,
            source,
            status,
            lastContactDate,
            nextFollowUpDate,
            notes,
            assignedTo
        } = req.body;

        if (!studentName || !contact) {
            return res.status(400).json({ success: false, message: "Student name and contact are required." });
        }

        const lead = await Lead.create({
            studentName,
            contact,
            email,
            source,
            status,
            lastContactDate,
            nextFollowUpDate,
            notes,
            assignedTo,
        });

       return res.status(201).json({
            success: true,
            message: "Lead created successfully.",
            lead
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error to create Lead", error: error.message })
    }
}


const getAllLead= async(req, res)=>{
    try {
        const {status, assignedTo, from, to, search, page=1, limit=20}=req.query;
        const filter={}

        if(status) filter.status=status;
        if(assignedTo) filter.assignedTo=assignedTo;

        // Date Filter

        if(from&&to){
            filter.createdAt={$gte:new Date(from), $lte: new Date(to)}
        }

        // filter by Search

        if(search){
            filter.$or=[
                {studentName:{$regex:search, $options:"i"}},
                {contact:{$regex:search, $options:"i"}},
                {email:{$regex:search, $options:"i"}}
            ]
        }

        const skip=(page - 1) * limit;

        const leads= await Lead.find(filter).populate('assignedTo', 'name email role').sort({createdAt:-1}).skip(skip).limit(Number(limit));

        const total= await Lead.countDocuments(filter);

        return res.status(200).json({success:true, message:"Fetch Successfully", total, leads, page:Number(page), pages:Math.ceil(total/limit)})
        
    } catch (error) {
         res.status(500).json({ success: false, message: "Failed to fetch leads.", error: error.message });
    }
}


const getLead= async(req, res)=>{
    try {
        const {id}=req.params;

        const lead= await Lead.findById(id).populate("assignedTo", 'name email role');
        return res.status(200).json({
            success:true,
            lead,
            message:"fetch successfull!"
        })
    } catch (error) {
        return res.status(500).json({
            message:"Failed to fetch lead",
            error:error.message
        })
    }
}

// admin and manager can only update
const updateLead=async(req, res)=>{
    try {

         if (!req.user || !['superadmin', 'manager'].includes(req.user.role)) {
      return res.status(400).json({ message: "Access not granted, Only admin and manager can Update Project" })
    }
    const leadId=req.params.id;
    if(!leadId){
        return res.status(402).json({message:"Lead Not Found!"})
    }
        const {
            studentName,
            contact,
            email,
            source,
            status,
            lastContactDate,
            nextFollowUpDate,
            notes,
            assignedTo,
        }=req.body;

        const updateLead={};

        if(studentName)updateLead.studentName=studentName;
        if(contact)updateLead.contact=contact;
        if(email)updateLead.email=email;
        if(source)updateLead.source=source;
        if(lastContactDate)updateLead.lastContactDate=lastContactDate;
        if(nextFollowUpDate)updateLead.nextFollowUpDate=nextFollowUpDate;
        if(notes)updateLead.notes=notes;
        if(assignedTo)updateLead.assignedTo=assignedTo;

        const newLead= await Lead.findByIdAndUpdate(leadId, updateLead,{new:true, runValidators:true}).populate("assignedTo", 'name email role')

        return res.status(200).json({success:true, message:"Update Successful!", newLead})


        
    } catch (error) {
        return res.status(500).json({
            message:"Failed to update lead",
            error:error.message
        })
    }
}


// admin can only delete lead

const deleteLead= async(req, res)=>{
    try {
        const {id}=req.params;
        await Lead.findByIdAndDelete(id);
        return res.status(200).json({success:true, message:"Lead Delete Successfully!"})
        
    } catch (error) {
        return res.status(500).json({
            message:"Can't delete lead"
        })
    }
}


export {
    createLead,
    getAllLead,
    getLead,
    updateLead,
    deleteLead
}