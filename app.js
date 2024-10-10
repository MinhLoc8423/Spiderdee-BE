const express = require('express');
const app = express();
const port = 3000;
const connectDB = require('./src/config/databaseConfig');
const authRoutes = require('./src/routes/authRoute')
require('./src/config/passportConfig');

// Middleware to process JSON data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// Routes
app.get('/', (req, res) => { res.send('Welcome') });
app.use('/auth', authRoutes);


connectDB();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
});