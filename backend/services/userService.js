const UserModel = require("../models/UserModel");

exports.getAllUsers = async () => {
    return await UserModel.find()
}