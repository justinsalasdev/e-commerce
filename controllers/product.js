const Product = require('../models/product')
const formidable = require('formidable')
const fs = require('fs')
const _ = require('lodash')
const { errorHandler } = require('../helpers/dbErrorHandler')

exports.productById = (req, res, next, id) => {
    Product.findById(id).exec((err, product) => {
        if (err || !product) {
            return res.status(400).json({
                errorMessage: "Product not found"
            })
        }
        req.product = product;
        next()
    })
}

exports.create = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {

        if (err) {
            return res.status(400).json({
                errMessage: 'Image could not be uploaded'
            })
        }
        let product = new Product(fields)

        if (files.photo) {
            if (files.photo.size > 1000000) {//1Mb = 1000000
                return res.status(400).json({
                    errorMessage: "Image should be less than 1Mb"
                })
            }
            product.photo.data = fs.readFileSync(files.photo.path)
            product.photo.contentType = files.photo.type
        }

        product.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    errorMessage: errorHandler(err) || 'Failed to save product'
                })
            }
            res.json(result)
        })
    })
}

exports.read = (req, res) => {
    req.product.photo = undefined;
    return res.json(req.product)
}

exports.remove = (req, res) => {
    let product = req.product
    product.remove((err, deletedProduct) => {
        if (err) {
            return res.status(400).json({
                errorMessage: errorHandler(err) || 'Failed to delete product'
            })
        }
        res.json({
            successMessage: "Product deleted successfully!"
        })
    })
}

exports.update = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {

        if (err) {
            return res.status(400).json({
                errMessage: 'Image could not be uploaded'
            })
        }

        let product = req.product
        product = _.extend(product, fields)

        if (files.photo) {
            if (files.photo.size > 1000000) {//1Mb = 1000000
                return res.status(400).json({
                    errorMessage: "Image should be less than 1Mb"
                })
            }
            product.photo.data = fs.readFileSync(files.photo.path)
            product.photo.contentType = files.photo.type
        }

        product.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    errorMessage: errorHandler(err) || 'Failed to save product'
                })
            }
            res.json(result)
        })
    })
}



/**
 * soldQuantity / datePosted
 * by soldQuantity = /products?sortBy=soldQuantity&order=desc&limit=4
 * by datePosted = /products?sortBy=createdAt&order=desc&limit=4
 * if no params set /then all products are returned
 */
exports.list = (req, res) => {
    let order = req.query.order ? req.query.order : 'asc'; //asc if not specified
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id' //sort by _id if not specified
    let limit = req.query.limit ? parseInt(req.query.limit) : 6 //6 products if not specified

    Product.find()
        .select("-photo")
        .populate('category')
        .sort([[sortBy, order]])
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                res.status(400).json({
                    errorMessage: 'No products found'
                })
            }
            res.send(data)
        })
}

//find product & its category
//find product with same category
exports.listRelated = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 6 //6 products if not specified
    Product.find({
        _id: { $ne: req.product },
        category: req.product.category
    })
        .select('-photo')
        .limit(limit)
        .populate('category', '_id name')
        .exec((err, products) => {
            if (err) {
                res.status(400).json({
                    errorMessage: 'No products found'
                })
            }
            res.json(products)
        })
}


exports.listCategories = (req, res) => {
    Product.distinct('category', {}, (err, categories) => {
        if (err) {
            res.status(400).json({
                errorMessage: 'No products found'
            })
        }
        res.json(categories)
    })
}


/**
 * list products by search
 * we will implement product search in react frontend
 * we will show categories in checkbox and price range in radio buttons
 * as the user clicks on those checkbox and radio buttons
 * we will make api request and show the products to users based on what he wants
 */

// route - make sure its post

exports.listBySearch = (req, res) => {
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};

    // console.log(order, sortBy, limit, skip, req.body.filters);
    // console.log("findArgs", findArgs);

    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === "price") {
                // gte -  greater than price [0-10]
                // lte - less than
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }

    Product.find(findArgs)
        .select("-photo")
        .populate("category")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: "Products not found"
                });
            }
            res.json({
                size: data.length,
                data
            });
        });
};

