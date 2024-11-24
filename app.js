const express = require('express');
const app = express();
const port = 8423;
const cors = require('cors');
const connectDB = require('./src/config/databaseConfig');
require('./src/config/passportConfig');

// Routes 
const authRoute = require('./src/routes/authRoute')
const productRoute = require('./src/routes/productRoute');
const userRoute = require('./src/routes/userRoute');
const roleRoute = require('./src/routes/roleRoute');
const categoryRoute = require('./src/routes/categoryRoute');
const orderRoute = require('./src/routes/orderRoute');
const orderDetailsRoute = require('./src/routes/orderDetailRoute');
const reviewRoute = require('./src/routes/reviewRoute');
const shippingRoute = require('./src/routes/shippingRoute');
const wishListRoute = require('./src/routes/wishListRoute.js');
const paymentRoute = require('./src/routes/paymentRoute');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => { res.send('Welcome to Spideree') });
app.use('/auth', authRoute);
app.use('/api', roleRoute);
app.use('/api', userRoute);
app.use('/api', productRoute);
app.use('/api', categoryRoute);
app.use('/api', orderRoute);
app.use('/api', orderDetailsRoute);
app.use('/api', reviewRoute);
app.use('/api', shippingRoute);
app.use('/api', wishListRoute);
app.use('/api', paymentRoute);


connectDB();

// app.listen(port, "192.168.1.2",() => {
//   console.log(`Server is running on port 192.168.1.2:${port}`)
// });

app.listen(port,() => {
  console.log(`Server is running on port 192.168.1.2:${port}`)
});