

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
 
    scene: [Shipwrecked, Shipwrecked2, Shipwrecked3, Shipwrecked4,]
};

console.log("in game.js");
let playerStartX = 350;
let playerStartY = 400;
// scene sleep checks
let sleep1 = false;
let sleep2 = false;
let sleep3 = false;
let sleep4 = false;

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


// tools  Not sure we need these since we have the inventory.
let Machete = "Machete";
let Axe = "Axe";

// create the game, and pass it the configuration
let game = new Phaser.Game(config);


