import express from "express";
import "express-async-errors";
import session from "express-session";
import bodyParser from "body-parser";
import cors from "cors";
import expressWs from "express-ws";
import UserService from "./services/UserService";
import UserRepository from "./repository/UserRepository";
import PassportService from "./services/PassportService";
import GameDataService from "./services/GameDataService";
import GameController from "./controller/GameController";
import DbConnection from "./repository/DbConnection";

import * as errors from "./errors";

const app = express();
const port = 4000;

expressWs(app);

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

const dbConnection = new DbConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: `fieryvoid`,
  connectionLimit: 5
});
const userService = new UserService(new UserRepository(dbConnection));
const passportService = new PassportService(userService);
passportService.init(app);

const gameController = new GameController(dbConnection);

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

app.get("/logout", (req, res) => {
  req.logout();
  res.sendStatus(204);
});

app.get("/user", (req, res) => {
  res.status(200).json(req.user);
});

app.post("/game", async (req, res) => {
  const gameId = await gameController.createGame(req.body, req.user);
  res.status(200).json({ gameId });
});

app.ws("/game/:gameId", (ws, req) => {
  ws.on("message", msg => {
    gameController.onMessage(message, req.user, req.params.gameId);
  });

  ws.on("close", msg => {
    gameController.closeConnection(ws, req.user, req.params.gameId);
  });

  gameController.openConnection(ws, req.user, req.params.gameId);
});

app.use((error, req, res, next) => {
  console.error(error);
  if (error instanceof errors.InvalidRequestError) {
    res.sendStatus(400);
  } else if (error instanceof errors.UnauthorizedError) {
    res.sendStatus(401);
  } else {
    res.sendStatus(500);
  }

  res.end();
});

app.listen(port, () => console.log(`Server listening on port ${port}!`));
