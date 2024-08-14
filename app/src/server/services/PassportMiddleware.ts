/*
import passport from "passport";
import LocalStrategy from "passport-local";

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
*/
import * as passportStrategy from "passport-local";
import passport from "passport";
import { Request, Response, NextFunction } from "express";
import { IUser, User } from "../../model/src/User/User";
import UserService from "./UserService";
import expressWs from "express-ws";

export function initPassport(
  app: expressWs.Application,
  userService: UserService
) {
  app.use(passport.initialize());
  app.use(passport.authenticate("session"));

  passport.use(
    new passportStrategy.Strategy(async (username, password, done) => {
      try {
        if (!username) {
          done(null, false);
        }
        const user = await userService.checkPassword(username, password);
        if (user) {
          done(null, user);
        } else {
          done(null, false, { message: "User or password incorrect" });
        }
      } catch (e) {
        done(e);
      }
    })
  );

  passport.serializeUser(
    (
      req: Request,
      expressUser: Express.User,
      done: (error: unknown, user: IUser) => void
    ) => {
      const user = expressUser as User;

      done(null, user.serialize());
    }
  );

  passport.deserializeUser((data: IUser, done) => {
    done(null, data ? new User(data) : null);
  });
}

export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
): Response | void {
  if (req.user) return next();
  else res.redirect("/");
}
