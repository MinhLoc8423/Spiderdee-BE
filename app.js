const express = require('express');
const app = express();
const port = 3000;
const connectDB = require('./src/config/databaseConfig');
const authRoutes = require('./src/routes/authRoute')
const productRoutes = require('./src/routes/productRoute');
require('./src/config/passportConfig');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => { res.send('Welcome to Spideree') });
app.use('/auth', authRoutes);
app.use('/api', productRoutes);


connectDB();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
});