const express = require("express");
const app = express();
const path = require("path");
const bodyparser = require("body-parser");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
require("dotenv").config();
_ = require("underscore");
const jwt = require("./middleware/auth");


app.use(express.static(path.join(__dirname, "public")));
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(cookieParser());
app.use(
  expressSession({
    secret: "MYS3CR3TK3Y",
    cookie: {
      maxAge: 60000,
    },
    resave: false,
    saveUninitialized: true,
  })
);
app.use(
  bodyparser.urlencoded({
    extended: true,
  })
);
app.use(jwt.authJwt)

// api routes
const router = require("./routes/apiRoutes");
app.use('/api', router)

// admin api routes
const adminRouter = require("./routes/adminApiRoutes")
// app.use('/api/admin', adminRouter)

// MongoDB Connection
require(path.join(__dirname, '/config/mongoDb'))()

app.listen(process.env.PORT, () => {
  console.log(`Server is running @ http://127.0.0.1:${process.env.PORT}`);
});
