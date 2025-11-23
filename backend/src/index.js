const express = require('express')
const cors = require('cors');
const dotenv = require('dotenv')
const { sequelize } = require('../models'); // ⬅ import Sequelize instance
const authRoutes = require('./routes/auth');
const employeesRoutes = require('./routes/employees');
const teamsRoutes  = require('./routes/teams');
const logRoutes = require('./routes/logs');

dotenv.config()
const app = express()

// Enable CORS 
app.use(cors());

// Middleware to parse JSON
app.use(express.json())

app.use('/api/auth', authRoutes);
app.use('/api/employees', employeesRoutes);
app.use('/api/teams', teamsRoutes);
app.use('/api/logs', logRoutes);

app.get('/', (req,res) => {
    res.json({message: 'HRMS API is running'});
});

sequelize.authenticate().then(() => {
    console.log('Database connected')
}).catch(err => {
    console.error('DB connection error:', err)
})

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})