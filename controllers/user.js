const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const { json } = require('express');

const controller = {

    getUsers:  async (req, res) => {

        try {

            const { limit = 5, start = 0 } = req.query;
            const query = { state: true };

            const [ total, users ] = await Promise.all([
                User.countDocuments(query),
                User.find(query)
                    .skip(Number(start))
                    .limit(Number(limit))
            ]);

            if(users.length == 0) {
                return res.status(404).json({
                    message: "Not users found"
                });
            }

            res.json({
                total,
                users
            });

        } catch(err) {
            res.status(500).json({
                message: "Could not get users",
                error: err
            });
        }

    },

    getUser: async (req, res) => {

        try {
            
            const { id } = req.params;
            const user = await User.findById(id);
            res.json(user);

        } catch(err) {
            res.status(500).json({
                message: "Could not get user",
                error: err
            });
        }

    },

    createUser: async (req, res) => {

        try {

            const { name, email, password, role } = req.body;
            const user = new User({ name, email, password, role });
    
            // Encrypt the password
            const salt = bcryptjs.genSaltSync();
            user.password = bcryptjs.hashSync(password, salt);
    
            // Save user in database
            await user.save();
            
            res.json({
                message: 'User saved',
                user
            });

        } catch(err) {
            res.status(500).json({
                message: "User could not be created",
                error: err
            });
        }

    },

    updateUser: async (req, res) => {

        try {

            const { id } = req.params;

            // Extract the data that will not be updated
            const { _id, password, google, ...other } = req.body;
    
            if(password) {
                // Encrypt the password
                const salt = bcryptjs.genSaltSync();
                other.password = bcryptjs.hashSync(password, salt);
            }
    
            const user = await User.findByIdAndUpdate(id, other, { new: true });
    
            res.json({
                message: 'User updated',
                user
            });

        } catch(err) {
            res.status(500).json({
                message: "User could not be updated",
                error: err
            });
        }

    },

    deleteUser: async (req, res) => {

        try {

            const { id } = req.params;
            const user = await User.findByIdAndUpdate(id, { state: false }, { new: true });
    
            res.json({
                message: 'User deleted',
                user
            });

        } catch(err) {
            res.status(500).json({
                message: "User could not be deleted",
                error: err
            });
        }

    }

};

module.exports = controller;