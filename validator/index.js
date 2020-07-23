const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
exports.userSignupValidator = (req,res,next) => {
    req.check('name')
        .notEmpty().withMessage('Name is required')

    req.check('email')
        .notEmpty().withMessage('Email is required')
        .matches(emailRegex).withMessage('Invalid email address')

    req.check('password')
        .notEmpty().withMessage('Password is required')
        .isLength({min:6}).withMessage('Must be 6 characters atleast')
        .matches(/d/).withMessage('Password must contain a number')
    
    const errors = req.validationErrors()

    if(errors){
        const firstErrorMessage = errors.map(error => error.msg)[0];
        return res.status(400).json({errorMessage: firstErrorMessage})
    }

    next()
}  