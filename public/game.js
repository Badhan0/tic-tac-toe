var win = false;

var socket = io();
var Player1 = "Player-1";
var room2 = "Player-2(X)";
$("select").on("change", function () {
  //alert(this.value);
  socket.emit("level", this.value);
  this.setAttribute("disabled", "");
  win = false;
});
function Clear(arr, line) {
  for (let i = 0; i < 9; i++) {
    if (arr[i] === "O") $("#m" + i).removeClass("roundm");
    else if (arr[i] === "X") {
      $("#n" + i).removeClass("crosn");
      $("#m" + i).removeClass("crosm");
    }
  }
  $(".line5").removeClass(line);
  win = false;
}
$(".btn").click(function () {
  var userChosenColour = $(this).attr("id");
  if (!win) {
    socket.emit("btn", userChosenColour);
  }
});

socket.on("btnanimate", ({ line, state, no, rom }) => {
  animate(line, state, no, rom);
});
socket.on("broadcast", ({ user1, user2 }) => {
  var op = "X";
  if (user1 === "X") op = "O";
  document.querySelector(
    ".p1"
  ).innerHTML = `You (${user1}) &nbsp &nbsp ${user2} (${op})`;
  if (user2 === "Disconected...") {
    document.querySelector(".start").removeAttribute("hidden");
  }
  if (user2 === "AI"){ win = true;
  document.querySelector(".target").removeAttribute("hidden");
   }
});

function animate(line, state, no, rom) {
  if (state === "O") {
    $("#m" + no).addClass("roundm");
  } else {
    $("#n" + no).addClass("crosn");
    $("#m" + no).addClass("crosm");
  }
  //console.log(rom);
  if (line === "" || line !== "O") {
    if (line) {
      $(".line5").addClass(line);
    }
    win = true;
    var mine = {};
    var op = {};
    var para = "";
    var opara = "";
    const [a, b] = Object.keys(rom.player);
    mine = rom.player[socket.id];
    if (a === socket.id) {
      op = rom.player[b];
    } else op = rom.player[a];
    if (line === "") {
      para = "DRAW!";
      opara = para;
    } else {
      if (mine.mark === state) {
        para = "You Won!";
        opara = "Player-1 Won!";
      } else {
        para = "You Lost!";
        opara = "Player-2 Won!";
      }
    }
    if (rom.type === "offline") para = opara;
    document.querySelector(".p1").innerHTML = para;
    ////console.log(room);
    setTimeout(() => {
      if (rom.type !== "offline") Player1 = "You";
      document.querySelector(
        ".p1"
      ).innerHTML = `${Player1}(${op.mark})-${mine.point} &nbsp &nbsp ${op.username}(${mine.mark})-${op.point}`;
      if (
        rom.round > 3 &&
        mine.point + op.point !== 0 &&
        mine.point != op.point
      ) {
        para = "";
        if (mine.point > op.point) {
          para = "YOU WON!";
          opara = "Player-1 WON!";
        } else {
          para = "YOU LOST!";
          opara = "Player-2 WON!";
        }
        if (rom.type === "offline") para = opara;
        document.querySelector(".container").style.display = "none";
        document.querySelector(".start").removeAttribute("hidden");
        document.querySelector(".para").innerHTML = para;
      }
      Clear(rom.board, line);
      socket.emit("clear");
    }, 2000);
  }
}
