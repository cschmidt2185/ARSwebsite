
//handle API routes for submissions

const express = require('express');
const router = express.Router();
const ContactSubmission = require('../database/models/ContactSubmission');
const authMiddleware = require('../middleware/auth');

// new submission handling
router.post('/contact', async (req, res) => {
    try {
        const submission = new ContactSubmission(req.body);
        await submission.save();
        
        // ADD EMAIL NOTIFICATIONS HERE
        res.status(201).json({ success: true });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// get all subs via protected route
router.get('/admin/submissions', authMiddleware, async (req, res) => {
    try {
        const submissions = await ContactSubmission.find({})
            .sort({ createdAt: -1 })
            .populate('assignedTo', 'name email');
        res.json(submissions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;