const userService = require('../services/userService')

exports.getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers()
        res.status(200).json({ success: true,  message: "Get all user successfully", users })
    } catch (error) {
        console.error("Error fetching users:", error)
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}

