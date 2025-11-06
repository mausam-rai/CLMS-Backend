import { Institutions } from "../Models/Institutions.Models.js";
import mongoose from "mongoose";



// create Institutions

const createInstitute = async (req, res) => {
    try {
        const { name, contact, proposalStatus, visitedDate, staffId, notes } = req.body;
        if (!name || !contact) {
            return res.status(400).json({ message: "Name and contact field can't be empty!" })
        }

        const institution = await Institutions.create({
            name, contact, proposalStatus, visitedDate, staffId, notes
        })

        return res.status(200).json({ success: true, message: "Institution created Successfully", institution })
    } catch (error) {
        return res.status(500).json({ message: "Error Creating Institution", error: error.message })
    }
}


const getAllInstitute = async (req, res) => {
    try {
        const { proposalStatus, from, to, search } = req.query;
        const filters = {};

        // filter through date;

        if (from && to)
            filters.createdAt = { $gte: new Date(from), $lte: new Date(to) }


        // filter through proposalStatus

        if (proposalStatus) filters.proposalStatus = proposalStatus;

        // filter through Search

        if (search) {
            filters.$or = [
                { name: { $regex: search, $options: "i" } },
                { contact: { $regex: search, $options: "i" } },
                { notes: { $regex: search, $options: "i" } }
            ]
        }

        const institute = await Institutions.find(filters).populate('staffId', 'name email role').sort({ createdAt: -1 })
        return res.status(200).json({ success: true, message: "Successfully Fetched", institute })
    } catch (error) {
        return res.status(500).json({ message: 'Error to Get All Institutions', error: error.message })
    }
}

const getInstitute = async (req, res) => {
    try {
        const instituteId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(instituteId)) {
            return res.status(400).json({ success: false, message: "Invalid institution ID." });
        }
        const institute = await Institutions.findById(instituteId).populate('staffId', 'name email role')

        return res.status(200).json({ success: true, message: "fetch Successfull!", institute })
    } catch (error) {
        return res.status(500).json({ message: 'Error to Get  Institution', error: error.message })

    }
}

// only admin and manager
const updatedInstitute = async (req, res) => {
    try {
        if (!req.user || !['superadmin', 'manager'].includes(req.user.role)) {
            return res.status(403).json({ message: "Access not granted, Only admin and manager can Update Project" })
        }

        const instituteId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(instituteId)) {
            return res.status(400).json({ success: false, message: "Invalid institution ID." });
        }
        const { name, contact, proposalStatus, notes } = req.body;

        const updateInstitute = {};

        if (name) updateInstitute.name = name;
        if (contact) updateInstitute.contact = contact;
        if (notes) updateInstitute.notes = notes;
        if (proposalStatus) updateInstitute.proposalStatus = proposalStatus;
        // for partial update check if one of the field is assigned
        if (Object.keys(updateInstitute).length === 0) {
            return res.status(400).json({ message: "At least one field must be provided to update." });
        }

        const newInst = await Institutions.findByIdAndUpdate(instituteId, updateInstitute, {
            new: true,
            runValidators: true
        })
        if (!newInst) return res.status(400).json({ message: "Not Found!" })

        return res.status(200).json({ success: true, message: "Updated Successfully!", newInst })
    } catch (error) {
        return res.status(500).json({ message: 'Error to update  Institution', error: error.message })

    }
}


// delete institutions only admin and manage

const deleteInstitute = async (req, res) => {
    try {
        if (!req.user || !['superadmin', 'manager'].includes(req.user.role)) {
            return res.status(400).json({ message: "Access not granted, Only admin and manager can delete Project" })
        }

        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid institution ID." });
        }

        await Institutions.findByIdAndDelete(id)
        return res.status(200).json({ success: true, message: "Delete Successfully!" })



    } catch (error) {
        return res.status(500).json({ message: 'Error to delete  Institution', error: error.message })

    }
}

export {
    createInstitute,
    getAllInstitute,
    getInstitute,
    updatedInstitute,
    deleteInstitute
}