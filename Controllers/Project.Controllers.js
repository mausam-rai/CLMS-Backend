import object from "mongoo/lib/plugins/object.js";
import { Project } from "../Models/Project.Models.js";



// only superadmin and manager can Create Project(Post)
const createProject = async (req, res) => {
  try {
    if (!req.user || !['superadmin', 'manager'].includes(req.user.role)) {
      return res.status(400).json({ message: "Access not granted, Only admin and manager can create Project" })
    }

    const { projectName, clientName, type, meetingSchedule, status, assignedTo, assignedManager: fromBody, startingDate, endingDate, totalDays } = req.body;
    if (!projectName || !clientName || !type) {
      return res.status(401).json({ message: "ProjectName, clientName and type can't be empty" })
    }

    // check if the project of same client exist
    const normalizedProjectName = projectName.trim().toLowerCase();
    const normalizedClientName = clientName.trim().toLowerCase();

    const existProject = await Project.findOne({
      projectName: normalizedProjectName,
      clientName: normalizedClientName
    });
    if (existProject) {
      return res.status(403).json({ message: "Same client can't have multiple projects with the same name" });
    }

    const assignedManager = req.user.role === "manager" ? req.user._id : fromBody;
    if (req.user.role === 'superadmin' && !assignedManager) {
      return res.status(401).json({ message: "Super admin should assign manager manually" })
    }

    const project = new Project({
      projectName: normalizedProjectName,
      clientName: normalizedClientName,
      type,
      meetingSchedule,
      status,
      assignedTo,
      assignedManager,
      startingDate,
      endingDate,
      totalDays

    })

    const newProject = await project.save()
    return res.status(201).json({ message: "Project has been created successfully", success: true, newProject })

  } catch (error) {
    console.log("Can't create Project", error)
  }
}


// get all project superadmin and manager can get all project
const getAllProjects = async (req, res) => {
  try {
    if (!req.user || !['superadmin', 'manager'].includes(req.user.role)) {
      return res.status(400).json({ message: "Access not granted, Only admin and manager can view all Projects" })
    }

    const project = await Project.find()
      .populate("assignedManager", "name role department")
      .populate("assignedTo", "name role department")
      .sort({ createdAt: -1 })

    if (project.length < 1) {
      return res.status(403).json({
        message: "There is no project available"
      })
    }
    return res.status(200).json({
      message: "Projects fetch Successfully",
      success: true,
      project
    })

  } catch (error) {
    return res.status(500).json({ message: "Error to get all projects", error })
  }
}


// get single project

const getProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await Project.findById(projectId)
      .populate("assignedManager", "name role department")
      .populate("assignedTo", "name role department");
    if (!project) {
      return res.status(400).json({ message: "Project no Found !" })
    }

    return res.status(200).json({ message: "Project Fetch Successfully", success: true, project })
  } catch (error) {
    return res.status(500).json({
      message: "Error to get a project"
    })
  }
}

// getmy project

const getMyProjects = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({ message: "Access Denied, Please login to get your project" })
    }
    console.log("hghfdhfjf")
    const userId = req.user._id;

    const project = await Project.find({
      $or: [
        { assignedManager: userId },
        { assignedTo: userId }
      ]
    }).populate([{ path: "assignedManager", select: "name role department" }, { path: "assignedTo", select: "name role department" }]).sort({ createdAt: -1 });



    if (project.length < 1) {
      return res.status(400).json({ message: "There is no project Available" })
    }

    return res.status(200).json({
      message: "Available Project",
      success: true,
      project
    })

  } catch (error) {
    return res.status(500).json({ message: "Can't get my project" })
  }
}


// delete project only superadmin can delete the project
const deleteProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    if (!projectId) {
      return res.status(400).json({ message: "Project no Found !" })
    }
    await Project.findByIdAndDelete(projectId);

    return res.status(200).json({ message: "Project deleted Successfully", success: true })
  } catch (error) {
    return res.status(500).json({
      message: "Error to delete a project"
    })
  }
}

// update project
const updateProject = async (req, res) => {
  try {
    if (!req.user || !['superadmin', 'manager'].includes(req.user.role)) {
      return res.status(400).json({ message: "Access not granted, Only admin and manager can Update Project" })
    }

    const projectId = req.params.id;

    if (!projectId) {
      return res.status(400).json({ message: "Project Not Found" })
    }

    const {
      meetingSchedule,
      status,
      assignedTo,
      assignedManager } = req.body;

      const updatedProject={};
      if(meetingSchedule)
        updatedProject.meetingSchedule=meetingSchedule;
      if(status)
        updatedProject.status=status;
      if(assignedTo)
        updatedProject.assignedTo=assignedTo;
      if(assignedManager)
        updatedProject.assignedManager=assignedManager;

      if(Object.keys(updatedProject).length==0){
        return res.status(400).json({
        message: "No valid fields provided for update"
        })
      }

      const project= await Project.findByIdAndUpdate(projectId, updatedProject, {
        new:true,
        runValidators:true
      }).populate([{ path: "assignedManager", select: "name role department" }, { path: "assignedTo", select: "name role department" }]);

        return res.status(200).json({
          message:"updated Project Successfully",
          success:true,
          project
        })
  } catch (error) {
    return res.status(500).json({ message: "Internal server error Updating project" })
  }
}



export {
  createProject,
  getAllProjects,
  getMyProjects,
  getProject,
  deleteProject,
  updateProject
}