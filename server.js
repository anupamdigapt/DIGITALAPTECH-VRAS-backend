const express = require("express");
const app = express();
const path = require("path");
require("dotenv").config();
const bodyparser = require("body-parser");
_ = require("underscore");
const expressSession = require("express-session");
const cookieParser = require("cookie-parser");

app.use(express.static(path.join(__dirname, "public")));
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
app.use(cookieParser());
app.use(
  bodyparser.urlencoded({
    extended: true,
  })
);

const jwt = require("./middleware/auth");
app.use(jwt.authJwt)

const userRouter = require("./routes/apiRoutes");
app.use('/vras',userRouter)

require(path.join(__dirname, '/config/mongoDb'))()

app.listen(process.env.PORT, () => {
  console.log(`Server is running @ http://127.0.0.1:${process.env.PORT}`);
});
