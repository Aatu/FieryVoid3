import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import passport from "passport";
import {Strategy as LocalStrategy} from 'passport-local';
import UserService from "./services/UserService";

const app = express();
const port = 4000;

app.use(express.static("public"));
app.use(session({ secret: "cats" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

const userService = new UserService();

passport.use(new LocalStrategy(
    (username, password, done) => {
        try {
            const user = userService.getUserByUsername(username);
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }

            if (!user.checkPassword(password)) {
                return done(null, false, { message: 'Incorrect password.' });
              }

              return done(null, user);
        } catch (error) {
            return done(error)
        }
        
      })
  );

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
