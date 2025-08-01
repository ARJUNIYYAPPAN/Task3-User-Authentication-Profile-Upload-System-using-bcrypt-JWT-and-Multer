require('dotenv').config();
const express = require('express');
const connectDB = require('./common/connection');
const app = express();
const PORT = process.env.PORT || 3002;
connectDB();
app.use(express.json());

app.use('/', require('./routes/authRoutes'));
  
app.listen(PORT, () => { console.log('Server is running on port 3002') }) 
   