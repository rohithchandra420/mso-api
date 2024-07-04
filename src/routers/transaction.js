const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');

const Txn = require('../models/transaction');
const Ticket = require('../models/ticket');

router.post('/order', async (req, res) => {
    var id = process.env.RAZORPAY_ID;
    var secret = process.env.RAZORPAY_SECRET;
    var rzpayInstance = new Razorpay({
        key_id: id,
        key_secret: secret
    })
    // setting up options for razorpay order.
    const options = {
        amount: req.body.amount * 100,
        currency: 'INR',
        receipt: "order_recipt_id",
        payment_capture: 1
    };
    try {
        const response = await rzpayInstance.orders.create(options)
        const transaction = new Txn({
            ...req.body,
            orderId: response.id,
            status: "Authorized"
        })
        await transaction.save();
        res.json({
            order_id: response.id,
            currency: response.currency,
            amount: response.amount,
        })
    } catch (e) {
        console.log(e);
        res.status(400).send(e);
    }
})

// router.post('/orderSuccess', async (req, res) => {
//     try {
//         const { orderId, paymentId } = req.query;
//         res.json({ orderId, paymentId })
//     } catch (e) {
//         res.status(500).send();
//     }
// })

router.post('/paymentCapture', async (req, res) => {
    // do a validation
    const razorData = req.body;
    const secret_key = process.env.RAZORPAY_SECRET;
    
    const hmac = crypto.createHmac('sha256', secret_key)
    hmac.update(razorData.successData.razorpay_order_id + "|" + razorData.successData.razorpay_payment_id);

    const gen_hmac = hmac.digest('hex')
    
    if (gen_hmac === razorData.successData.razorpay_signature) {
        console.log('request is legit')
        try {
            const ticket = new Ticket({
                name: razorData.name,
                phone: razorData.phone,
                email: razorData.email,
                amount: razorData.amount,
                orderId: razorData.successData.razorpay_order_id,
                paymentId: razorData.successData.razorpay_payment_id,
                shopCart: razorData.shopCart,
            });
            console.log("ticket: ", ticket);
            await ticket.save();
            const transaction = await Txn.findOne({orderId: razorData.successData.razorpay_order_id, status:"Authorized"})
            
            if(!transaction) {
                res.status(404).send("No Transaction Found");
            }
            transaction.ticket_id = ticket._id;
            transaction.paymentId = razorData.successData.razorpay_payment_id;
            transaction.status = "Captured";
            console.log("transaction: ", transaction);
            await transaction.save(); 
            res.json({
                status: 'ok',
                payload: ticket
            })
        } catch(e) {
            console.log(e);
            res.status(500).send("No Trasnaction Found");
        }
    } else {
        try {
            const transaction = await Txn.findOne({orderId: razorData.successData.razorpay_order_id, status:"Authorized"})
            if(!transaction) {
                res.status(500).send("Transaction Order Not Created");
            }
            transaction.status = "Invalid Sign";
            await transaction.save();
        } catch(e) {
            res.status(400).send("Transaction Declined - Incorrect Signature");
        }
        res.status(400).send('Invalid signature');
    }
});

module.exports = router;