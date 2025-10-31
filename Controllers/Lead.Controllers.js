import { Lead } from "../Models/Lead.Models.js";


const createLead = async (req, res) => {
    try {
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

        const leads= (await Lead.find(filter).populate('assignedTo', 'name email role')).sort({createdAt:-1}).skip(skip).limit(Number(limit));

        const total= await Lead.countDocuments(filter);

        return res.status(200).json({success:true, message:"Fetch Successfully", total, leads, page:Number(page), pages:Math.ceil(total/limit)})
        
    } catch (error) {
         res.status(500).json({ success: false, message: "Failed to fetch leads.", error: error.message });
    }
}