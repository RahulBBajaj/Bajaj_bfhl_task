const express = require('express');
const cors = require('cors');
const atob = require('atob'); // For decoding base64
const mime = require('mime-types'); // To validate MIME types
const app = express();

app.use(express.json());
app.use(cors({
    origin: 'https://bajaj-fe584.web.app'
}));
// POST endpoint
app.post('/bfhl', (req, res) => {
    const { data, file_b64 } = req.body;

    if (!data) {
        return res.status(400).json({ "is_success": false, "error": "Invalid input" });
    }

    const numbers = data.filter(item => !isNaN(item));
    const alphabets = data.filter(item => isNaN(item));

    // Corrected logic for highest lowercase alphabet
    const lowercaseAlphabets = alphabets.filter(item => item === item.toLowerCase() && item.match(/[a-z]/));
    const highestLowercaseAlphabet = lowercaseAlphabets.length ? [lowercaseAlphabets.sort()[lowercaseAlphabets.length - 1]] : [];

    // File handling logic
    let file_valid = false;
    let file_mime_type = null;
    let file_size_kb = null;

    if (file_b64) {
        try {
            // Split the base64 string to extract the MIME type and the data
            const parts = file_b64.split(',');
            const mimeType = parts[0].match(/:(.*?);/)[1];
            const base64Data = parts[1];
            
            const buffer = Buffer.from(base64Data, 'base64'); // Decode Base64 to buffer
            file_mime_type = mimeType; // Assign the extracted MIME type
            file_size_kb = (buffer.length / 1024).toFixed(2); // Calculate size in KB

            if (file_mime_type && file_size_kb > 0) {
                file_valid = true;
            }
        } catch (error) {
            console.error('Error in file handling:', error);
            return res.status(400).json({ "is_success": false, "error": "Invalid file" });
        }
    }

    res.json({
        "is_success": true,
        "user_id": "rahul_bajaj_30092001", // You can customize this format
        "email": "rahul_bajaj@srmap.edu.in",  // Replace with your email
        "roll_number": "AP21110011022",  // Replace with your roll number
        "numbers": numbers,
        "alphabets": alphabets,
        "highest_lowercase_alphabet": highestLowercaseAlphabet,
        "file_valid": file_valid,
        "file_mime_type": file_mime_type,
        "file_size_kb": file_size_kb
    });
});

// GET endpoint
app.get('/bfhl', (req, res) => {
    res.status(200).json({ "operation_code": 1 });
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});