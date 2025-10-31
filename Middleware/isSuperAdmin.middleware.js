
const isSuperAdmin = (req, res, next) => {
    try {
        // console.log("this is requested user",req.user)
        if (req.user && req.user.role === 'superadmin')
            next();
        else
            return res.status(403).json({ message: "Access denied. Super Admins only." });
    } catch (error) {
        console.log("Error in superAdmin middleware:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

    export default isSuperAdmin;