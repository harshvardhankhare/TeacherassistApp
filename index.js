require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');
const app = express();

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

app.set('views', path.join(__dirname, 'views'));  // <-- Make sure this is here
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(methodOverride('_method'));

app.use(session({
    secret: 'secretKey',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: MONGO_URI })
}));

app.get('/', (req, res) => {
  res.render('home', { session: req.session });
});

app.use('/', authRoutes);
app.use('/students', studentRoutes);

app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`));
