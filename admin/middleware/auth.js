

const jwt = require('jsonwebtoken');
const Employee = require('../database/models/Employee');

const authMiddleware = async (req, res, next) => {
    try{
        //get token from request header
        const token = req.header('Authorization').replace('Bearer ', '');

        //verify auth token
        const decoded = jwt.verify(token, procecss.env.JWT_SECRET);

        //verify employee in db and still exists
        const employee = await Employee.findOne({
            _id: decoded._id,
            //add token to employees token array for cross device auth
            'tokens.token':token
        });
//error handle false employee
        if (!employee) {
            throw new Error();
        }


        //add employee to request object
        req.employee = employee;
        req.token = token;
        next();
    } catch (error) {
        res.status(401).send({ error: 'Please authenticate.' });
    }
};

module.exports = authMiddleware;