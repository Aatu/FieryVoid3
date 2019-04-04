import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import passport from "passport";
import LocalStrategy from "passport-local";
import cors from "cors";
import UserService from "./services/UserService";

const app = express();
const port = 4000;

app.use(cors());
app.use(express.static("public"));
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

const userService = new UserService();

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(
  new LocalStrategy((username, password, done) => {
    try {
      const user = userService.getUserByUsername(username);
      if (!user) {
        return done(null, false, { message: "Incorrect username." });
      }

      if (!userService.checkPassword(password)) {
        return done(null, false, { message: "Incorrect password." });
      }

      console.log("User", user);
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

app.post("/login", passport.authenticate("local"), (req, res) => {
  // If this function gets called, authentication was successful.
  // `req.user` contains the authenticated user.
  console.log("Success?");
});

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(port, () => console.log(`Server listening on port ${port}!`));
