const express = require("express");
const app = express();

//config Env File 
require("dotenv").config();
_ = require("underscore");

// Body-Parser Middleware
const bodyparser = require("body-parser");
app.use(
  bodyparser.urlencoded({
    extended: true,
  })
);
app.use(bodyparser.json());

// Cookie-Parser
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// Express-Session
const session = require("express-session");
app.use(
  session({
    secret: "MYS3CR3TK3Y",
    cookie: {
      maxAge: 60000,
    },
    resave: false,
    saveUninitialized: true,
  })
);

// Serve Static Resources
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

// View Engine Setup
app.set("view engine", "ejs");
app.set("views", "views");

// User Auth Middleware Integration
const jwt = require("./middleware/auth");
app.use(jwt.authJwt);

// Routes
const router = require("./routes/apiRoutes");
app.use("/api", router); // Api Route

const adminRouter = require("./routes/adminApiRoutes");
// app.use('/api/admin', adminRouter) // Admin Route 

// MongoDB Connection
require(path.join(__dirname, "/config/mongoDb"))();

// Server Listen
app.listen(process.env.PORT, () => {
  console.log(`Server is running @ http://127.0.0.1:${process.env.PORT}`);
});
