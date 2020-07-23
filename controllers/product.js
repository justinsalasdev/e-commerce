const Product = require('../models/product')
const formidable = require('formidable')
const fs = require('fs')
const _ = require('lodash')
const { errorHandler } = require('../helpers/dbErrorHandler')

exports.productById = (req,res,next,id) => {
    Product.findById(id).exec((err,product) => {
        if(err || !product){
            return res.status(400).json({
                errorMessage: "Product not found"
            })
        }
        req.product = product;
        next()
    })
}

exports.create = (req,res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        
        if(err){
            return res.status(400).json({
                errMessage: 'Image could not be uploaded'
            })
        }
        let product = new Product(fields)

        if(files.photo){
            if(files.photo.size > 1000000){//1Mb = 1000000
                return res.status(400).json({
                    errorMessage: "Image should be less than 1Mb"
                })
            }
            product.photo.data = fs.readFileSync(files.photo.path)
            product.photo.contentType = files.photo.type
        }

        product.save((err, result) => {
            if(err){
                return res.status(400).json({
                    errorMessage: errorHandler(err) || 'Failed to save product'
                })
            }
            res.json(result)
        })
    })
}

exports.read = (req,res) => {
    req.product.photo = undefined;
    return res.json(req.product)
}

exports.remove = (req,res) => {
    let product = req.product
    product.remove((err, deletedProduct) => {
        if(err){
            return res.status(400).json({
                errorMessage:errorHandler(err) || 'Failed to delete product'
            })
        }
        res.json({
            successMessage:"Product deleted successfully!"
        })
    })
}