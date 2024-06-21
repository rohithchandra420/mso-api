const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');

const User = require('../models/user');

router.post('/test2', (req, res) =>{
    res.send("Hello User")
})

router.post('/createUser', async (req, res) => {
    const user = new User(req.body)
    try{
        await user.save()
        const token = await user.generateAuthToken();

        res.status(201).send({user, token});
    } catch(e) {
        console.log(e);
        res.status(400).send(e)
    }
    // await user.save().then(() => {
    //     res.status(201).send(user)
    // }).catch((error) => {
    //     res.status(400).send(error)
    // })
})

router.get('/GetAllUsers', auth , async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    }catch(e) {
        res.status(500).send();
    }
})

router.get('/users/me', auth , async (req, res) => {
    res.send(req.user);
})

router.get('/user/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const user = await User.findById(_id);
        if(!user) {
            return res.status(404).send();
        }
        res.status(200).send(user);
    }catch(e) {
        res.status(500).send();
    }
})


router.patch('/UpdateUser/me', auth, async (req, res) => {
    const _id = req.user.id;
    const newPassword = req.body;
    try {
        req.user.password = newPassword.password;
        await req.user.save();
        // if(!user) {
        //     return res.status(404).send("No User FOund to Update")
        // }
        res.send(req.user);
    } catch(e) {
        res.status(400).send(e);   
    }
})

router.post('/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken();
        res.send({user, token});
    }catch(e) {
        res.status(400).send();
    }
})

router.post('/user/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        });

        await req.user.save();
        res.send();

    } catch(e) {
        res.status(500).send();
    }
})

router.post('/user/logoutAll', auth, async (req,res) => {
    try {
        req.user.tokens = []
        await req.user.save();
        res.send();
    } catch(e) {
        res.status(500).send();
    }
})

module.exports = router;