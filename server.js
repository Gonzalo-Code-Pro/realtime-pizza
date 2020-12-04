require("dotenv").config();
const express = require("express");
const app = express();
const ejs = require("ejs");
const expressLayout = require("express-ejs-layouts");
const port = process.env.PORT || 3300;
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("express-flash");
const MongoDbStore = require("connect-mongo")(session);
const bodyParser = require("body-parser");
const passport = require('passport')


app.use(express.json());

//database conection
const url = "mongodb://localhost/pizza";
mongoose.connect(url, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: true,
});

const connection = mongoose.connection;

connection
  .once("open", () => {
    console.log("Database connected...");
  })
  .catch((err) => {
    console.log("Conection Falied", err);
  });


//session store
let mongoStore = new MongoDbStore({
  mongooseConnection: mongoose.connection,
  collection: "sessions",
});
//session config

app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: mongoStore,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, //24 hours
    },
  })
);


//passport configure
const passportInit = require('./app/config/passport');
passportInit(passport)
app.use(passport.initialize()) 
app.use(passport.session())




//flash
app.use(flash());
//assets
app.use(express.static("public"));

app.use(express.urlencoded({ extended: false }));

//globla midleware para uasarlo en la vistas
app.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.user = req.user
  next();
});

//set template engines
app.use(expressLayout);
app.set("views", path.join(__dirname, "/resources/views"));
app.set("view engine", "ejs");

//routes
const Routes = require("./routes/web")(app);

//listen on server
app.listen(port, () => {
  console.log(`Server on port : ${port}`);
});

/**/
