

// our game's configuration
// note the width and height are just the viewport sizes. 
// they don't have to be the "world" sizes.  See setBounds..
let config = {
  type: Phaser.AUTO,
  width: 1000,
  height: 1000,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
 
    scene: [ShipwreckedIntro, Shipwrecked, Shipwrecked2, Shipwrecked3, Shipwrecked4, ShipConstruction, DeathScene]
};

console.log("in game.js");
let playerStartX = 200;
let playerStartY = 280;

// scene sleep checks
let sleep1 = false;
let sleep2 = false;
let sleep3 = false;
let sleep4 = false;
let sleepShip = false;
let sleepDeath = false;

// player life related
let playerLife = 10;
let hearts = [];

// player inventory, gathered items and tools
let playerInventory = [];

// items
let Gold = 0;
let Wood = 0;
let Iron = 0;
let Wool = 0;
let Food = 0;

// game timer related
let startTime = 0;
let explodeTime = 1000 * 60 * 6;  // 6 min
let timeLeft = explodeTime;

startTime = Date.now();
let theMin = 0;
let theSec = 0;

G_bShake = false;  // flag for camera shake.
G_bGameStarted = false; // flag for if we are out of intro.

// create the game, and pass it the configuration
let game = new Phaser.Game(config);


