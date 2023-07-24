const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const {
  roomJoin,
  roomLeave,
  Clear,
  turn,
  getOpponent,
  cheakAiTurn,
  setLevel,
} = require("./util/room.js");
var room = "";
var username = "";
var type = "";
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  room = "";
  res.sendFile(__dirname + "/home.html");
});
app.get("/Game", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  //console.log("a user connected", socket.id);
  if (room) {
    const rom = roomJoin(socket.id, "online", room, username);

    socket.join(rom.room);
    socket.broadcast
      .to(rom.room)
      .emit("broadcast", { user1: "O", user2: `${username}` });

    if (!rom.vacant) {
      const opp = getOpponent(socket.id);
      socket.emit("broadcast", { user1: "X", user2: `${opp.username}` });
    } else
      socket.emit("broadcast", {
        user1: "O",
        user2: `wating for Player-2....`,
      });

    room = "";
  } else {
    const rom = roomJoin(socket.id, type, socket.id, "Player-1");
    if (type === "vsai") socket.emit("broadcast", { user1: "O", user2: "AI" });
  }
  //console.log(io.of("/").adapter.rooms);
  socket.on("btn", (no) => {
    const id = socket.id;
    const { line, state, rom } = turn(id, no);
    ////console.log("Button: " + no, line, state);
    if (state && rom) {
      io.to(rom.room).emit("btnanimate", { line, state, no, rom });

      const n = cheakAiTurn(id);
      if (n !== "") {
        const t = turn(id + "AI", n);
        if (t.state && t.rom) {
          ////console.log("Buttonai: " + n, t.line, t.state);
          io.to(t.rom.room).emit("btnanimate", {
            line: t.line,
            state: t.state,
            no: n,
            rom: t.rom,
          });
        }
      }
    }
  });
  socket.on("level", (no) => {
    setLevel(socket.id, no);
  });
  socket.on("clear", () => {
    const id = socket.id;
    Clear(id);
    const n = cheakAiTurn(id);
    // const { line1, state1, rom1 } =
    if (parseInt(n) >= 0) {
      const t = turn(id + "AI", n);
      if (t.state && t.rom) {
        //console.log("Buttonai: " + n, t.line, t.state);
        io.to(t.rom.room).emit("btnanimate", {
          line: t.line,
          state: t.state,
          no: n,
          rom: t.rom,
        });
      }
    }
  });
  socket.on("disconnect", () => {
    const rom = roomLeave(socket.id);
    if (rom)
      socket.broadcast
        .to(rom.room)
        .emit("broadcast", { user1: "", user2: "Disconected..." });
    //console.log(socket.id, "disconnected");
  });
});
app.post("/", (req, res) => {
  username = req.body.username;
  room = req.body.room;
  type = req.body.type;
  res.redirect("/Game");
});
server.listen(process.env.PORT||3000, () => {
  //console.log("listening on *:3000");
});
