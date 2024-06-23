const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');


const Product = require('../models/product');

router.post('/addProduct', auth, async(req, res) => {
    //const product = new Product(req.body);
    console.log("Add Product Start");
    const product = new Product({
        ...req.body,
        createdBy: req.user._id
    })
    try {
        await product.save();
        console.log("Add Product Success");
        res.send(product);
    } catch(e) {
        console.log("Add Product Fail");
        res.status(400).send()
    }
})

router.get('/getProductById/:id', auth, async(req, res) => {
    console.log(_id);
    try {
        const product = await Product.findById(_id);
        if(!product) {
            res.status(401).send("No Item Found");
        }
        res.send(product);
    } catch(e) {
        res.status(500).send();
    }
})

router.get('/getAllProducts', async (req, res) => {    
    try {
        console.log("Get All Product Start");
        const products = await Product.find({});
        if(!products) {
            console.log("Get All Product Failed: Not Found");
            res.status(401).send("No Item Found");
        }
        console.log("Get All Product Success");
        res.send(products);
    } catch(e) {
        console.log("Get All Product Failed");
        res.status(500).send();
    }
})

router.get('/getMyActiveProducts', auth, async (req, res) => {
    console.log(req.user);
    try {
        await req.user.populate({
            path: 'myproducts',
            match: {
                active:true
            }
        }).execPopulate();
        res.send(req.user.myproducts);
    } catch(e) {
        //console.log(e);
        res.status(500).send();
    }
})

router.delete('/deleteProductById/:id', auth, async (req, res) => {
    try{
        //const product = await Product.findByIdAndDelete(req.params.id);
        const product = await Product.findOneAndDelete({_id: req.params.id})
        
        if(!product) {
            res.status(404).send("Item Not Avaialable");
        }
        res.send(product);
    } catch(e) {
        res.status(500).send("Deletion Failed")
    }
})



module.exports = router;