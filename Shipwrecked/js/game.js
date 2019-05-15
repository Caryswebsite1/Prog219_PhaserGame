

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
let playerStartX = 500;
let playerStartY = 500;
let sleep1 = false;
let sleep2 = false;
let sleep3 = false;
let sleep4 = false;
let playerLife = 10;


// create the game, and pass it the configuration
let game = new Phaser.Game(config);


