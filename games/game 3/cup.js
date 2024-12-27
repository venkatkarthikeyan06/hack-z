var Blocks = function (blockAssign, setAssign) {
    this.allOn = false;
    this.blocks = blockAssign.map((d) => ({
      name: d.name,
      el: $(d.selector),
      audio: this.getAudioObject(d.pitch),
    }));
    this.soundSets = setAssign.map((d) => ({
      name: d.name,
      sets: d.sets.map((pitch) => this.getAudioObject(pitch)),
    }));
  };
  
  Blocks.prototype.flash = function (note) {
    let block = this.blocks.find((d) => d.name == note);
    if (block) {
      block.audio.currentTime = 0;
      block.audio.play();
      block.el.addClass("active");
      setTimeout(() => {
        if (!this.allOn) {
          block.el.removeClass("active");
        }
      }, 100);
    }
  };
  
  Blocks.prototype.turnOnAll = function () {
    this.allOn = true;
    this.blocks.forEach((d) => d.el.addClass("active"));
  };
  
  Blocks.prototype.turnOffAll = function () {
    this.allOn = false;
    this.blocks.forEach((d) => d.el.removeClass("active"));
  };
  
  Blocks.prototype.getAudioObject = function (pitch) {
    var audio = new Audio(
      `https://awiclass.monoame.com/pianosound/set/${pitch}.wav`
    );
    audio.setAttribute("preload", "auto");
    return audio;
  };
  
  Blocks.prototype.playSet = function (type) {
    this.soundSets
      .find((set) => set.name == type)
      .sets.forEach((audio) => {
        audio.currentTime = 0;
        audio.play();
      });
  };
  
  var Game = function () {
    this.blocks = new Blocks(
      [
        { selector: ".block1", name: "1", pitch: "1" },
        { selector: ".block2", name: "2", pitch: "2" },
        { selector: ".block3", name: "3", pitch: "3" },
        { selector: ".block4", name: "4", pitch: "4" },
      ],
      [
        { name: "correct", sets: [1, 3, 5, 8] },
        { name: "wrong", sets: [2, 4, 5.5, 7] },
      ]
    );
    this.levels = ["1234", "12324", "231234", "41233412"];
    this.currentLevel = 0;
    this.playInterval = 400;
    this.mode = "waiting";
  };
  
  Game.prototype.startLevel = function () {
    this.showMessage(`Level ${this.currentLevel}`);
    this.startGame(this.levels[this.currentLevel]);
  };
  
  Game.prototype.showMessage = function (message) {
    $(".status").text(message);
  };
  
  Game.prototype.startGame = function (answer) {
    this.mode = "gamePlay";
    this.answer = answer;
    let notes = answer.split("");
    this.showStatus("");
    let _this = this;
  
    this.timer = setInterval(function () {
      let char = notes.shift();
      if (!notes.length) {
        clearInterval(_this.timer);
        _this.startUserInput();
      }
      _this.blocks.flash(char);
    }, this.playInterval);
  };
  
  Game.prototype.startUserInput = function () {
    this.userInput = "";
    this.mode = "userInput";
  };
  
  Game.prototype.userSendInput = function (inputChar) {
    if (this.mode !== "userInput") return;
  
    let tempString = this.userInput + inputChar;
    this.blocks.flash(inputChar);
    this.showStatus(tempString);
  
    if (this.answer.indexOf(tempString) === 0) {
      if (this.answer === tempString) {
        this.currentLevel++;
        this.mode = "waiting";
        setTimeout(() => this.startLevel(), 1000);
      }
      this.userInput = tempString;
    } else {
      this.currentLevel = 0;
      this.mode = "reset";
      setTimeout(() => this.startLevel(), 1000);
    }
  };
  
  Game.prototype.showStatus = function (tempString) {
    $(".inputStatus").html("");
    this.answer.split("").forEach((_, i) => {
      let circle = $("<div class='circle'></div>");
      if (i < tempString.length) circle.addClass("correct");
      $(".inputStatus").append(circle);
    });
  
    if (tempString === this.answer) {
      $(".inputStatus").addClass("correct");
      this.showMessage("Correct!");
      setTimeout(() => {
        this.blocks.turnOnAll();
        this.blocks.playSet("correct");
      }, 500);
    } else {
      $(".inputStatus").removeClass("correct");
    }
  
    if (!tempString) {
      this.blocks.turnOffAll();
    } else if (!this.answer.startsWith(tempString)) {
      this.showMessage("Wrong...");
      $(".inputStatus").addClass("wrong");
      this.blocks.turnOnAll();
      this.blocks.playSet("wrong");
    } else {
      $(".inputStatus").removeClass("wrong");
    }
  };

  Blocks.prototype.getAudioObject = function (pitch) {
    var audio = new Audio(
      `https://awiclass.monoame.com/pianosound/set/${pitch}.wav`
    );
    audio.setAttribute("preload", "auto");
    audio.muted = true; // Play muted to ensure loading
    audio.play().catch(() => {}); // Catch errors if autoplay restrictions apply
    return audio;
  };

  
  $(document).ready(function () {
    var game = new Game();
  
    // Show a start button for user interaction
    $(".start-button").click(function () {
      game.startLevel();
      $(".start-button").hide(); // Hide the button after the game starts
    });
  
    $(".block1").click(() => game.userSendInput("1"));
    $(".block2").click(() => game.userSendInput("2"));
    $(".block3").click(() => game.userSendInput("3"));
    $(".block4").click(() => game.userSendInput("4"));
  });
  
  
  $(document).ready(function () {
    var game = new Game();
    $(".block1").click(() => game.userSendInput("1"));
    $(".block2").click(() => game.userSendInput("2"));
    $(".block3").click(() => game.userSendInput("3"));
    $(".block4").click(() => game.userSendInput("4"));
  
    setTimeout(() => game.startLevel(), 1000);
  });
  