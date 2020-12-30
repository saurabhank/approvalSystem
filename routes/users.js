const express = require('express');
const router = express.Router();
const user = require('../models/users');

router.post('/add', async (req, res, next) => {
    try {
        let userId = req.body.userId;
        let name = req.body.name;
        let newUser = new user(userId, name)
        await newUser.addUser();
        res.json({
            success: true,
            msg: "USER CREATED"
        })
    }
    catch (e) {
        __error("ERROR WHILE CREATING USER", e);
        res.json({
            success: false,
            msg: "UNABLE TO CREATE USER"
        });
    }
});

router.get('/get', async (req, res, next) => {
    try {
        let newUser = new user()
        allUsers = await newUser.getUsers();
        res.json({
            success: true,
            msg: allUsers
        })
    }
    catch (e) {
        __error("ERROR WHILE GETTING USERS", e);
        res.json({
            success: false,
            msg: "UNABLE TO GET USERS"
        });
    }
});
module.exports = router;