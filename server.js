const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Route to handle API requests
app.post('/students/above-threshold', (req, res) => {
    const { threshold } = req.body;

    // Check if the threshold is a number
    if (typeof threshold !== 'number') {
        return res.status(400).json({ error: 'Threshold must be a number' });
    }

    // Load students data from the file
    fs.readFile('./data.json', 'utf-8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Error reading student data' });

        const students = JSON.parse(data);
        const filteredStudents = students.filter(student => student.total > threshold);

        return res.json({
            count: filteredStudents.length,
            students: filteredStudents.map(student => ({
                name: student.name,
                total: student.total
            }))
        });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
