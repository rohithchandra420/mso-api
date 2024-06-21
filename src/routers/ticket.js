const express = require('express');
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp');

const auth = require('../middleware/auth')

const Ticket = require('../models/ticket');

router.post('/createTicket', auth, async (req, res) => {
    const ticket = new Ticket(req.body);
    try {
        await ticket.save();
        res.status(201).send(ticket);
    }catch(e) {
        res.status(400).send(e);
    }
})

const upload = multer ({
    limits: {
        fileSize: 1000000,
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(png|jpg|jpeg)$/)){
            return cb(new Error('File must be an image'))
        }
        
        cb(undefined, true)
    }
})

router.post('/createTicket/uploadQrCode/:id', upload.single('qrcode'), async (req, res) => {
    const ticketId = req.params.id;
    const ticket = await Ticket.findById(ticketId);
    if(!ticket) {
        res.status(404).send("Cant find the ticket");
    }
    
    //ticket.qrcode = req.file.buffer
    const buffer = await sharp(req.file.buffer).resize({width: 250, height:250}).png().toBuffer();
    ticket.qrcode = buffer;
    await ticket.save();
    res.send();
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})

router.get('/GetAllTickets', auth, async (req, res) => {
    try {
        const tickets = await Ticket.find({});
        res.send(tickets);
    } catch(e) {
        res.status(500).send();
    }
})

router.get('/GetTicketById/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const ticket = await Ticket.findById(_id);
        if(!ticket) {
            res.status(404).send('No Ticket Found')
        }
        res.send(ticket);
    } catch(e) {
        res.status(500).send();
    }
})

router.get('/GetTicket/:id/qrcode', auth, async (req, res) => {
    try{
        const ticket = await Ticket.findById(req.params.id);
        if(!ticket || !ticket.qrcode) {
            throw new Error();
        }

        res.set('Content-Type', 'image/png')
        res.send(ticket.qrcode);
    } catch(e) {
        res.status(404).send();
    }
})

router.post('/AdmitTicket', auth, async (req, res) => {
    const data = req.body;
    try {
        console.log(data);
        const ticket = await Ticket.findById(data._id);
        if(!ticket) {
            throw new Error("No Ticket Found to Admit")
        }
        ticket.status = "Admitted";
        await ticket.save();
        console.log("Ticket", ticket);
        res.send(ticket);
    } catch(e) {
        res.status(404).send();
    }
})

module.exports = router