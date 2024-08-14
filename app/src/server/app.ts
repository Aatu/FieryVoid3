import express, { Request, Response } from "express";
import "express-async-errors";
import session from "express-session";
import cors from "cors";
import expressWs from "express-ws";
import UserService from "./services/UserService";
import UserRepository from "./repository/UserRepository";
import { initPassport } from "./services/PassportMiddleware";
import GameController from "./controller/GameController";
import DbConnection from "./repository/DbConnection";

import * as errors from "./errors/index";
import passport from "passport";
import { User } from "../model/src/User/User";

const { app } = expressWs(express());
const port = 4000;

//expressWs(app);

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://95.217.10.191",
      "http://coldvoidgame.com",
      "https://coldvoidgame.com",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(
  session({
    secret: "molecular pulsar cat",
    resave: false,
    saveUninitialized: true,
  })
);

//app.use(express.urlencoded({ extended: false }));
app.use(express.urlencoded());
app.use(express.json());

const dbConnection = new DbConnection({
  host: "127.0.0.1",
  user: "root",
  password: "root",
  database: `fieryvoid`,
  connectionLimit: 5,
});

const userService = new UserService(new UserRepository(dbConnection));

initPassport(app, userService);

const gameController = new GameController(dbConnection);

//app.use(express.static("public"));

app.post("/login", passport.authenticate("local"), (req, res) => {
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

app.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    res.sendStatus(204);
  });
});

app.get("/user", (req, res) => {
  res.status(200).json(req.user);
});

app.post("/game", async (req, res) => {
  const gameId = await gameController.createGame(req.body, req.user as User);
  res.status(200).json({ gameId });
});

app.post("/testGame", async (req, res) => {
  const gameId = await gameController.createTestGame(
    req.body,
    req.user as User
  );
  res.status(200).json({ gameId });
});

app.ws("/game/:gameId", (ws, req) => {
  ws.on("message", (message) => {
    try {
      gameController.onMessage(
        JSON.parse(message.toString()),
        req.user as User,
        parseInt(req.params.gameId, 10)
      );
    } catch (error) {
      console.log("Error on websocket message");
      console.log(error);
      ws.send(
        JSON.stringify({
          type: "error",
          payload: error,
        })
      );
    }
  });

  ws.on("close", (msg) => {
    gameController.closeConnection(
      ws as unknown as WebSocket,
      parseInt(req.params.gameId, 10)
    );
  });

  gameController.openConnection(
    ws as unknown as WebSocket,
    req.user as User,
    parseInt(req.params.gameId, 10)
  );
});

app.use((error: Error, req: Request, res: Response, next: unknown) => {
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
