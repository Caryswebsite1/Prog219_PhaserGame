

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
 
    scene: [Tortuga] //, ShipwreckedIntro, Shipwrecked, Shipwrecked2, Shipwrecked3, Shipwrecked4, ShipConstruction, DeathScene, Tortuga, PirateSailing]
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
let sleepPirate = false;
let sleepTortuga = false;

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
let Food = 1;


//boats related.
let BoatConstructor = function (pCrew, pCargo, pSpeed, pWood, pWool, pIron, pFood) {
    this.crew = pCrew;
    this.cargo = pCargo;
    this.speed = pSpeed;
    this.iron = pIron;
    this.wool = pWool;
    this.wood = pWood;
    this.food = pFood;
    this.gold = 0;
    this.hitPoints = 0;
    this.cannon = 0;  // each cannon does 10 pts damage, takes 3 cargo spaces
    this.bIronPlate = false;  // Iron plate => *50% hitpoints, -10% speed.
    this.shipType = "";


    switch (pCrew) {
        case 1:
            this.hitPoints = 10;
            this.shipType = "Canoe";
            break;

        case 15:
            this.hitPoints = 150;
            this.shipType = "Schooner";
            break;

        case 30:
            this.hitPoints = 300;
            this.shipType = "Brig";
            break;

        case 50:
            this.hitPoints = 500;
            this.shipType = "Frigate";
            break;

        default:
            this.hitPoints = 10;
            this.shipType = "Canoe";
            break;

    }// end switch


} // end boat constructor

// boats you can build
let canoe = new BoatConstructor(1, 5, 25, 0, 0, 0, 1);              // Base hit points: 10;
let schooner = new BoatConstructor(15, 10, 40, 20, 15, 0, 15);      // Base hit points: 150;
let twoMaster = new BoatConstructor(30, 25, 50, 40, 25, 15, 30);    // Base hit points: 300;
let fourMaster = new BoatConstructor(50, 60, 75, 80, 45, 35, 50);   // Base hit points: 500;

let playerShip = "";  // to be filled in when player gets a ship!


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


