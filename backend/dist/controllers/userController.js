"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = exports.createUser = void 0;
const userModel_1 = require("../models/userModel");
const createUser = async (req, res) => {
    try {
        const newUser = await userModel_1.User.create(req.body);
        res.json(newUser);
        console.log(newUser);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: 'An unknown error occurred' });
        }
    }
};
exports.createUser = createUser;
const getUserById = async (req, res) => {
    try {
        const id = req.params.id; // Assuming the ID is passed as a URL parameter
        const user = await userModel_1.User.findByPk(id);
        if (user) {
            res.json(user);
        }
        else {
            res.status(404).json({ error: 'User not found' });
        }
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: 'An unknown error occurred' });
        }
    }
};
exports.getUserById = getUserById;
