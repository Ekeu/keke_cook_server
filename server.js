const cloudinary = require('cloudinary').v2;
const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');

const connectDB = require('./config/db');

//Routes
const categoryRoutes = require('./routes/category.routes');
const subCategoryRoutes = require('./routes/subcategory.routes');
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const imageRoutes = require('./routes/image.routes');
const cartRoutes = require('./routes/cart.routes');
const userRoutes = require('./routes/user.routes');
const couponRoutes = require('./routes/coupon.routes');
const stripeRoutes = require('./routes/stripe.routes');
const orderRoutes = require('./routes/order.routes');
const adminRoutes = require('./routes/admin.routes');

dotenv.config();

connectDB();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

app.use(express.json({ limit: '50mb' }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/subcategories', subCategoryRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/images', imageRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/coupon', couponRoutes);
app.use('/api/v1/stripe', stripeRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/admin', adminRoutes);

app.get('/api/v1/config/paypal', (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);
