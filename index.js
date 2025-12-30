const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

const authRoutes = require('./routes/authRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); 
app.use(bodyParser.json()); // read JSON data 

// Routes 
app.use('/api/auth', authRoutes);     // http://localhost:3000/api/auth


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
