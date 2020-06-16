import passport from "passport";
import LocalStrategy from "passport-local";
import User from "../../model/User.mjs";

class PassportService {
  constructor(userService) {
    this.userService = userService;
  }

  init(app) {
    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser((user, done) => {
      done(null, user.serialize());
    });

    passport.deserializeUser((user, done) => {
      done(null, user ? new User().deserialize(user) : null);
    });

    passport.use(
      new LocalStrategy(async (username, password, done) => {
        try {
          const user = await this.userService.getUserByUsername(username);
          if (!user) {
            return done(null, false, { message: "Incorrect username." });
          }

          if (!(await this.userService.checkPassword(username, password))) {
            return done(null, false, { message: "Incorrect password." });
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      })
    );
  }

  authenticate() {
    return passport.authenticate("local");
  }
}

export default PassportService;
