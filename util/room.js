const { aiTurn, emptyCells } = require("./AI.js");
const rooms = [];

const moment = require("moment");
// Join room to chat
//roomJoin("234", "vsai", "234", "ananta");
// roomJoin("244", "online", "aaa", "paul");
// +console.log(getCurrentroom("aaa"));
// Clear("aaa");
// setTimeout(() => {
//   console.log(getCurrentroom("aaa"));
// }, 2000);
function roomJoin(id, type, room, username) {
  if (type === "") type = "offline";
  const i = rooms.findIndex((rom) => rom.room === room);
  if (i === -1) {
    const rom = {
      room,
      player: {
        [id]: {
          username,
          point: 0,
          mark: "O",
        },
      },
      board: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
      vacant: type === "online",

      type,
      round: 0,
      turn: "O",
      clr: false,
    };

    if (type === "offline") {
      rom.player.Player2 = {
        username: "Player-2",
        point: 0,
        mark: "X",
      };
    } else if (type === "vsai") {
      //const ai=id+AI
      rom.player[id + "AI"] = {
        username: "AI",
        point: 0,
        mark: "X",
      };
    }
    // console.log(rom.player);
    rooms.push(rom);
    return rom;
  } else {
    if (rooms[i].vacant)
      rooms[i].player[id] = {
        username,
        point: 0,
        mark: "X",
      };

    rooms[i].vacant = false;
    return rooms[i];
  }
  //console.log(rom);
}
//console.log(getCurrentroombyid("234"));
// Get current room
function getCurrentroombyid(id) {
  return rooms.find((room) => id in room.player);
}
function getCurrentroom(rom) {
  const room = rooms.find((room) => room.room === rom);
  //console.log(room);
  return room;
}
function turn(id, no) {
  //console.log("tr", id, no);
  const i = rooms.findIndex((rom) => id in rom.player);
  const j = parseInt(no);
  var n = "";
  var room = {};
  if (
    i !== -1 &&
    !rooms[i].vacant &&
    (rooms[i].player[id].mark === rooms[i].turn ||
      rooms[i].type === "offline") &&
    rooms[i].board[j] !== "O" &&
    rooms[i].board[j] !== "X"
  ) {
    const m = rooms[i].turn;
    n = m;
    rooms[i].board[j] = rooms[i].turn;
    // if (rooms[i].type !== "vsai") {
    if (rooms[i].turn === "O") rooms[i].turn = "X";
    else rooms[i].turn = "O";
    //}
    const ca = cheakanswer(rooms[i].board, m);
    if (ca) {
      const [a, b] = Object.keys(rooms[i].player);
      if (rooms[i].player[a].mark === m) rooms[i].player[a].point++;
      else rooms[i].player[b].point++;
    }
    room = rooms[i];
    // console.log(room.board);
    if (
      ca ||
      !rooms[i].board.filter((ind) => ind !== "X" && ind !== "O").length
    )
      return { line: ca, state: n, rom: room };
  }
  return { line: "O", state: n, rom: room };
}

function getOpponent(id) {
  const room = rooms.find((rom) => id in rom.player);
  const [a, b] = Object.keys(room.player);
  if (id !== a) return room.player[a];
  else return room.player[b];
}

function roomLeave(id) {
  const index = rooms.findIndex((rom) => id in rom.player);
  if (index !== -1) return rooms.splice(index, 1)[0];
}
function setLevel(id, no) {
  const i = rooms.findIndex((rom) => id in rom.player);
  if (i !== -1) {
    rooms[i].player[id + "AI"].level = parseInt(no);
  }
}
function Clear(id) {
  const i = rooms.findIndex((rom) => id in rom.player);
  if (i !== -1) {
    if (!rooms[i].clr) {
      rooms[i].board = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
      rooms[i].turn = "O";
      const [a, b] = Object.keys(rooms[i].player);
      [rooms[i].player[a].mark, rooms[i].player[b].mark] = [
        rooms[i].player[b].mark,
        rooms[i].player[a].mark,
      ];
      rooms[i].round++;
      if (rooms[i].type === "online") rooms[i].clr = true;
    } else rooms[i].clr = false;
  }
}
function cheakAiTurn(id) {
  const i = rooms.findIndex((rom) => id in rom.player);
  if (
    i !== -1 &&
    rooms[i].type === "vsai" &&
    rooms[i].turn === rooms[i].player[id + "AI"].mark &&
    emptyCells(rooms[i].board).length &&
    cheakanswer(rooms[i].board, rooms[i].player[id].mark) === ""
  ) {
    return aiTurn(
      rooms[i].board,
      rooms[i].player[id].mark,
      rooms[i].player[id + "AI"].mark,
      rooms[i].player[id + "AI"].level
    );
  }
  return "";
}
function cheakanswer(ar, win) {
  if (ar[0] === win && ar[4] === win && ar[8] === win) {
    return "linerc";
  } else if (ar[0] === win && ar[1] === win && ar[2] === win) {
    return "liner1";
  } else if (ar[0] === win && ar[3] === win && ar[6] === win) {
    return "linec1";
  } else if (ar[3] === win && ar[4] === win && ar[5] === win) {
    return "liner2";
  } else if (ar[6] === win && ar[7] === win && ar[8] === win) {
    return "liner3";
  } else if (ar[2] === win && ar[4] === win && ar[6] === win) {
    return "linerr";
  } else if (ar[1] === win && ar[4] === win && ar[7] === win) {
    return "linec2";
  } else if (ar[2] === win && ar[5] === win && ar[8] === win) {
    return "linec3";
  } else return "";
}

module.exports = {
  roomJoin,
  getCurrentroom,
  roomLeave,
  Clear,
  turn,
  getOpponent,
  getCurrentroombyid,
  cheakanswer,
  cheakAiTurn,
  setLevel,
};
