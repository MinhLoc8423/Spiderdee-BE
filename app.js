const express = require('express');
const app = express();
const port = 3000;
const connectDB = require('./src/config/databaseConfig');
const authRoutes = require('./src/routes/authRoute')
const productRoutes = require('./src/routes/productRoute');
const userRoute = require('./src/routes/userRoute');
const categoryRoute = require('./src/routes/categoryRouter');
const cors = require('cors');
require('./src/config/passportConfig');


app.use(cors({
  origin: 'exp://127.0.0.1:8081/--/sign-in' 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => { res.send('Welcome to Spideree') });
app.use('/auth', authRoutes);
app.use('/api', userRoute);
app.use('/api', productRoutes);
app.use('/api', categoryRoute);

connectDB();

  console.log(`Server is running on port ${port}`)
app.listen(port, () => {
  console.log(`Server is running on port 192.168.1.2:${port}`)
});