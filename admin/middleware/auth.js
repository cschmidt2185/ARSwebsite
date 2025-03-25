const jwt = require('jsonwebtoken');
const Employee = require('../database/models/Employee');

const authMiddleware = async (req, res, next) => {
    try {
        // Get token from request header
        const token = req.header('Authorization').replace('Bearer ', '');

        // Verify auth token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Verify employee in db and still exists
        const employee = await Employee.findOne({
            _id: decoded._id,
            // Add token to employees token array for cross device auth
            'tokens.token': token
        });
        
        // Error handle false employee
        if (!employee) {
            throw new Error();
        }

        // Add employee to request object
        req.employee = employee;
        req.token = token;
        next();
    } catch (error) {
        res.status(401).send({ error: 'Please authenticate.' });
    }
};

module.exports = authMiddleware;