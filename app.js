if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}











const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const helmet = require('helmet');

const mongoSanitize = require('express-mongo-sanitize');
// const dbUrl = process.env.DB_URL


const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const reviewRoutes = require('./routes/reviews');
// 'mongodb://localhost:27017/toko-hewan'
// dbUrl
//DB_URL=mongodb+srv://lintang:lintang@toko-hewan.dbwnmei.mongodb.net/?retryWrites=true&w=majority
// CLOUDINARY_CLOUD_NAME=protagonist007
// CLOUDINARY_KEY=841684697529243
// CLOUDINARY_SECRET=rZLYUAsQ0QCuHwg3aKXUsgyiuIw
// MAPBOX_TOKEN=pk.eyJ1IjoicHJvdGFnb25pc3QwMDciLCJhIjoiY2w2aDV0MGgxMGVkbjNkb3pqd3k5bjFyaCJ9.TtrJRfR31b1rYk5Uyw7uGw
// DB_URL=mongodb+srv://lintang:lintang@toko-hewan.injvyus.mongodb.net/?retryWrites=true&w=majority
// SECRET=inirahasia
// const dbUrl = 'mongodb://localhost:27017/toko-hewan';



// const MongoDBStore = new require("connect-mongo")(session);

const dbUrl = process.env.DB_URL
mongoose.connect(dbUrl , {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});





var app = express();

// view engine setup
app.engine('ejs', ejsMate)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize({
  replaceWith: '_'
}))

const secret = process.env.SECRET || 'inirahasia' ;
// // SECRET=inirahasia


// const store = MongoDBStore.create({
//   url: dbUrl,
//   secret,
//   touchAfter: 24*60 * 60
// })


// store.on("error", function(e) {
//   console.log("session store error", e)
// })


const sessionConfig = {
  // store,
  name: 'session',
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
      httpOnly: true,
      // secure: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7
  }
}

app.use(session(sessionConfig));
app.use(flash());
app.use(helmet());

const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://api.tiles.mapbox.com/",
  "https://cdnjs.cloudflare.com/",
  
  "https://kit.fontawesome.com/",
  
  "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://stackpath.bootstrapcdn.com/",
  
 
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
];


const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/douqbebwk/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})




app.use('/', userRoutes);
app.use('/products', productRoutes)
app.use('/products/:id/reviews', reviewRoutes)



app.get('/', (req, res) => {
  res.render('home')
});


app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Oh No, Something Went Wrong!'
  res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
  console.log('Serving on port 3000')
})



