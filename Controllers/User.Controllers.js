import { User } from '../Models/User.Models.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';



// Login Super Admin

const SuperAdmin = async (req, res) => {
    try {
        const email = "superAdmin@gmail.com"
        const password = 'admin123';

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Super Admin already exists" })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name: "SuperAdmin",
            email,
            password: hashedPassword,
            role: 'superadmin',
            department: 'Management'
        })
        return res.status(201).json({
            message: "Super Admin created successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department
            },
            success: true
        })

    } catch (error) {
        console.log("Error Login SuperAdmin", error)
    }


}


// Create User By Admin
const createUser = async (req, res) => {
    try {

        if (!req.user || req.user.role !== "superadmin") {
            return res.status(403).json({ message: "Only Superadmin can update credentials" });
        }

        const { name, email, password, role, department } = req.body;

        if (!name || !email || !password || !role || !department) {
            return res.status(403).json({ message: "Make sure there is no empty input field" })
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashPassword,
            role,
            department
        })
        if (!user) {
            return res.status(400).json({
                message: "Error creating users",
            })
        }
        return res.status(200).json({
            message: "User Created Successfully",
            user: {
                id: user._id,
                name,
                email,
                role,
                department
            },
            success: true
        })

    } catch (error) {
        console.log("Error Creating User", error)
    }
}

// login user
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Make sure all fields are filled" })
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" })
        }
        // check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid Password" })
        }
        // create token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        const httpOptions = {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 1 * 24 * 60 * 60 * 1000 // 1 day
        }


        return res.status(200).cookie("token", token, httpOptions).json({
            message: "Login Successful",
            user,
            success: true

        })

    } catch (error) {
        console.log("Error logging in user", error)
    }
}



// get all users (only superadmin)


const getAllUsers = async (req, res) => {
    try {
        if (!req.user || req.user.role !== "superadmin") {
            return res.status(403).json({ error: "Only Superadmin can access all users" })
        }
        const users = await User.find().select("-password");
        if (!users) {
            return res.status(404).json({ message: "No users found" })
        }

        return res.status(200).json({ message: "Users fetched successfully", users, success: true })
    } catch (error) {
        console.log("Error getting all users", error)
        return res.status(500).json({ message: "Cannot get users" })

    }
}


// Get user

const getUser = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" })
        }

        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "No user found" })
        }
        return res.status(200).json(({ message: "User fetched successfully", user, success: true }))



    } catch (error) {
        console.log("Error getting user", error)
        return res.status(500).json({ message: "Cannot get user" })

    }
}


// update email and password


const updateProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        const { name, email, password } = req.body;
        console.log(userId.name)

        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "No user found" })
        }

        if (name)
            user.name = name;
        if (email)
            user.email = email;
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
        }

        await user.save();
        return res.status(200).json({ message: "Profile updated successfully", user, success: true })

    } catch (error) {
        console.log("Error updating profile", error)
    }
}


// Delete Users(superAdmin)

const deleteUser = async (req, res) => {
    try {
        if (!req.user || req.user.role !== "superadmin") {
            return res.status(403).json({ message: "Only Admin can delete the user Profile" })
        }

        const userId = req.params.id;
        if (!userId) {
            return res.status(403).json({ message: "No User Profile Found!" })
        }
        // console.log("this is the user id to be deleted", userId)
        const deleteUser = await User.findByIdAndDelete(userId);
        return res.status(200).json({ message: "Deleted Profile successfully", success: true })


    } catch (error) {
        console.log("Error deleting User", error)
    }
}

// logout

    const logout=async(req, res)=>{
        try {
            const httpOptions={
                httpOnly:true,
                sameSite:'strict',
                expires: new Date(0)
            }
            return res.status(200).cookie('token', '', httpOptions).json({
                message:"logged Out",
                success:true
            })
            
        } catch (error) {
            console.log("Error Logging Out", error)
        }
    }
export {
    SuperAdmin,
    createUser,
    login,
    getAllUsers,
    getUser,
    updateProfile,
    deleteUser,
    logout
};