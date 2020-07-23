const Category = require('../models/category')
const { errorHandler } = require('../helpers/dbErrorHandler')
const category = require('../models/category')


exports.categoryById = (req, res, next, id) => {
    Category.findById(id).exec((err, category) => {
        if (err || !category) {
            return res.status(400).json({
                error: errorHandler(err) || 'Failed to find category'
            })
        }
        req.category = category
        next()
    })
}


exports.create = (req, res) => {
    const category = new Category(req.body)
    category.save((err, data) => {
        if (err) {
            return res.status(400).json({
                errorMessage: errorHandler(err) || 'Failed to save category'
            })
        }
        res.json({ data })
    })
}


exports.update = (req, res) => {
    const category = req.category
    category.name = req.body.name

    category.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err) || 'Failed to save category'
            })
        }
        res.json(data)
    })
}

exports.remove = (req, res) => {
    const category = req.category
    category.name = req.body.name

    category.remove((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err) || 'Failed to save category'
            })
        }
        res.json({
            successMessage: 'Category deleted'
        });
    })
}

exports.list = (req, res) => {
    Category.find().exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err) || 'Failed to find categories'
            })
        }
        res.json(data)
    })
}

exports.read = (req, res) => {
    return res.json(req.category)
}


