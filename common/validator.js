const { check, validationResult } = require('express-validator/check');
var validationLog = createLog('validation');

module.exports = [
    check('firstname')
        .optional()
        .trim()
        .escape()
        .not()
        .isEmpty()
        .withMessage('First name can not be empty!'),
    check('lastname')
        .optional()
        .trim()
        .escape()
        .not()
        .isEmpty()
        .withMessage('Last name can not be empty!'),
    check('email')
        .optional()
        .trim()
        .not()
        .isEmpty()
        .withMessage('Please enter an  email address!')
        .isLength({ max: 64 })
        .withMessage('Please enter email that contains only 64 charactor email.')
        .isEmail()
        .withMessage('Invalid email address!'),
    check('phone')
        .optional()
        .trim()
        .escape()
        .not()
        .isEmpty()
        .withMessage('Phone number is required.')
        //.matches(/(^[+])([1-9]{3})([0-9]{8})/g)
        .isLength({ min: 12, max: 12 })
        .withMessage('Please enter a numeric value in phone number with country code.'),
    check('zip')
        .optional()
        .trim()
        .escape()
        .not()
        .isEmpty()
        .withMessage("Please enter an Zip Code.")
        .isLength({ min: 5, max: 5 })
        .withMessage("Please enter a valid Zip Code.")
        .isNumeric(),
    //If error ouccure then send response to the client.
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            validationLog.info("============== Error Validation Log")
            validationLog.info(errors.array())
            return res.send({ type: "error", data: errors.array() })
        } else {
            next();
        }

    },
]

