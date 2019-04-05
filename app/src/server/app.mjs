import express from "express";
import "express-async-errors";
import session from "express-session";
import bodyParser from "body-parser";
import cors from "cors";
import UserService from "./services/UserService";
import PassportService from "./services/PassportService";
import * as errors from "./errors";

const app = express();
const port = 4000;

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  })
);
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const userService = new UserService();
const passportService = new PassportService(userService);
passportService.init(app);

//app.use(express.static("public"));

app.post("/login", passportService.authenticate(), (req, res) => {
  res.sendStatus(204);
});

app.post("/register", async (req, res) => {
  const result = await userService.register(req.body);
  if (result) {
    res.sendStatus(204);
  } else {
    res.status(409).send("Username already exists");
  }
});

app.get("/logout", function(req, res) {
  req.logout();
  res.sendStatus(204);
});

app.get("/user", function(req, res) {
  res.status(200).json(req.user);
});

app.use(function(error, req, res, next) {
  console.error(error);
  if (error instanceof errors.InvalidRequestError) {
    res.sendStatus(400);
  } else {
    res.sendStatus(500);
  }

  res.end();
});

app.listen(port, () => console.log(`Server listening on port ${port}!`));
