//const { cheakanswer } = require("./room.js");

function evalute(board, hu, ai) {
  var score = 0;

  if (cheakanswer(board, ai) !== "") {
    score = +1;
  } else if (cheakanswer(board, hu) !== "") {
    score = -1;
  } else {
    score = 0;
  }

  return score;
}
function emptyCells(board) {
  return board.filter((ind) => ind !== "X" && ind !== "O");
}
function gameOverAll(state) {
  return cheakanswer(state, "O") || cheakanswer(state, "X");
}
function Altttt(mark) {
  if (mark === "O") return "X";
  else return "O";
}
function minimax(board, depth, player, hu, ai) {
  var best;

  if (player === ai) {
    best = [-1, -1000];
  } else {
    best = [-1, +1000];
  }

  if (depth === 0 || gameOverAll(board)) {
    var score = evalute(board, hu, ai);
    return [-1, score];
  }

  emptyCells(board).forEach(function (cell) {
    var j = cell;
    var i = parseInt(j);
    board[i - 1] = player;
    var score = minimax(board, depth - 1, Altttt(player), hu, ai);
    score[0] = i - 1;
    board[i - 1] = j;

    if (player === ai) {
      if (score[1] > best[1]) best = score;
    } else {
      if (score[1] < best[1]) best = score;
    }
  });

  return best;
}
function aiTurn(board, hu, ai, level) {
  var x;
  var move;
  var ec = emptyCells(board).length;
  var rnd = parseInt(Math.random() * 10);
  //console.log(ec, rnd);
  if (ec === 9) {
    x = parseInt(Math.random() * ec);
  } else {
    move = minimax(board, 1, ai, hu, ai);
    if (move[1] === 1) x = move[0];
    else if (level === 1) {
      x = parseInt(emptyCells(board)[parseInt(Math.random() * ec)]) - 1;
    } else if (level === 2) {
      if (rnd < 6) {
        move = minimax(board, ec, ai, hu, ai);
        x = move[0];
      } else x = parseInt(emptyCells(board)[parseInt(Math.random() * ec)]) - 1;
    } else if (level === 3) {
      if (rnd <= 8) {
        move = minimax(board, ec, ai, hu, ai);
        x = move[0];
      } else x = parseInt(emptyCells(board)[parseInt(Math.random() * ec)]) - 1;
    }
    // var maxi = emptyCells(board).length;
    // if (maxi > 4) maxi = 4;
    // move = minimax(board, maxi, ai, hu, ai);
    // x = move[0];
    //console.log("move", move, x);
  }
  return x.toString();
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
  aiTurn,
  emptyCells,
};
