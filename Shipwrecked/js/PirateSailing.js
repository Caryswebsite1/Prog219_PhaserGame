/* eslint-disable indent */

class PirateSailing extends Phaser.Scene {
    constructor() {
        super({ key: "PirateSailing" });

        this.gameOver = false;
        this.hunterStartTime = 0;
        this.hunterSpawnTimer = 60000; // one hunter every 60 seconds
        this.hunterSpawn = 0; // used for clearing setInterval for hunter spawning
        this.hunterAttackTime = 1500; // if a hunter is in range for 1 second, they attack!
        this.hunterIncreaseSpawn = 60000; // rate of hunter spawn increases every minute. 


        // sail times, actually based on number of update calls between, not actual miliseconds etc.
        this.hunterSailTime = 150; // current elapsed hunter sail time.  Set to max to force move at start.
        this.maxHunterSail = 150; // max allowed hunter sail time before new direction set.
        this.muzzleFlash = '';

        this.cargoShipTimer = 5000; // time for a new cargo ship to spawn
        this.cargoSpawn = 0; // used for clearing setInterval for cargo spawning
    } // end constructor



    // ---------------------------------------------------------
    //  preload()
    //
    // Description: main preload function for scene.  Not strictly
    // required by the framework.  Handles initial loading of images
    // (assets).  Also sets the framewidth and height for sprites
    // when they are loaded. Provides variable names for each image
    // or sprite loaded in.
    // -----------------------------------------------------------
    preload() {

        // plugins:
        this.load.plugin('DialogModalPlugin', './js/dialog_plugin.js');
        this.load.plugin('PirateFunctionsPlugin', './js/PirateFunctionsPlugin.js');

        // main images
        this.load.image("island2", "assets/island1.png");
        this.load.image("island3", "assets/island2.png");
        this.load.image("island1", "assets/island3.png");
        this.load.image("island4", "assets/island4.png");
        this.load.image("island5", "assets/island5.png");
        this.load.image("portIMG", "assets/tempPort.png");
        this.load.image("TortugaIMG", "assets/TortugaPort.png");
        this.load.image("bigWater", "assets/ocean.jpg");

        this.load.image("hunterImg", "assets/HunterShipWCOA25.png");
        this.load.image("flashImg", "assets/Flash1.png");

        // cargo ships:
        this.load.image("cargoDinghy", "assets/cargoDinghy10.png");
        this.load.image("cargoSchooner", "assets/cargoSchooner25.png");
        this.load.image("cargoFluyt", "assets/cargoFluyt32.png");
        this.load.image("cargoGalleon", "assets/cargoGalleon40.png");

        // cargo ship navigation waypoint
        this.load.image("waypoint", "assets/waypoint.png");


        // player ship sprite
        this.load.spritesheet("pirateShip", "assets/pirateShip.png", { frameWidth: 80, frameHeight: 95 });


        // // status icons will be on top of anything else.
        // this.load.image("singleHeart", "assets/singleHeart16.png");
        // this.load.image("blankHeart", "assets/blankHeart16.png");

        // Audio: 
        //Really should have.ogg too.
        // Notes: instances allows for the given number of multiple simultainous plays of the same item.
        // so instances :4 allows 4 copies of that sound to play simultainiously or overlapping if desired.
        this.load.audio('OceanSound', ['assets/audio/Waves.mp3']);
        this.load.audio('CannonSound', ['assets/audio/multiCannon.mp3'], { instances: 2 });

    } // end preload





    // ---------------------------------------------------------
    // create()
    //
    // Description: main create function for scene.  Handles 
    // initial creation of all scene objects and player sprite.
    // Sets interaction types etc.
    // -----------------------------------------------------------
    create() {

        // plugins:
        this.sys.install('DialogModalPlugin');
        //console.log(this.sys.dialogModal);

        this.sys.install('PirateFunctionsPlugin');
        //console.log("from PirateSailing");
        //console.log(this.sys.PirateFunctions);

        this.events.on('wake', this.onWake, this);

        // Camera: set bounds to whole world size.
        this.cameras.main.setBounds(0, 0, 1000, 1000);

        // set actual camera width and height for what we see.
        //this.cameras.main.setSize(1000, 1000);
        this.cameras.main.setSize(500, 400);



        // Sailing audios
        this.OceanAudio = this.sound.add('OceanSound');
        this.CannonAudio1 = this.sound.add('CannonSound');
        this.CannonAudio2 = this.sound.add('CannonSound');


        // set Sailing ambiance
        this.OceanAudio.volume = 0.4;
        this.OceanAudio.play({ loop: true });
        this.OceanAudio.pause();


        /* *********************************************************************
         * *********** Main Map Setup ******************************************* 
         * *********************************************************************/


        // to only add an image someplace, you would say:
        this.add.image(500, 500, "bigWater");
        this.muzzleFlash = this.add.image(100, 100, "flashImg");
        this.muzzleFlash.setVisible(false);

        //this.add.image(500, 500, "singleShip");

        // islands group
        this.islands = this.physics.add.staticGroup();
        this.port = this.physics.add.group();
        let newChild = "";

        newChild = this.islands.create(50, 50, "island1");
        newChild.name = "island";

        newChild = this.port.create(210, 130, "portIMG")
        newChild.name = "port";



        newChild = this.islands.create(920, 60, "island2");
        newChild.name = "island";

        newChild = this.port.create(825, 175, "portIMG")
        newChild.name = "port";

        newChild = this.islands.create(500, 500, "island3");
        newChild.name = "island";

        newChild = this.port.create(480, 420, "portIMG")
        newChild.name = "port";


        newChild = this.islands.create(50, 925, "island4");
        newChild.name = "island";

        newChild = this.port.create(155, 835, "portIMG")
        newChild.name = "port";

        newChild = this.islands.create(940, 950, "island5");
        newChild.name = "island";

        newChild = this.port.create(840, 890, "portIMG")
        newChild.name = "port";



        // Make TORTUGA!
        newChild = this.islands.create(-110, 500, "island5");
        newChild.name = "island";

        newChild = this.port.create(20, 500, "TortugaIMG")
        newChild.name = "TortugaPort";
        newChild.setInteractive(); // make it clickable!



        // way points.
        newChild = "";
        this.waypoint = this.physics.add.group();
        newChild = this.waypoint.create(300, 300, "waypoint");
        newChild.setVisible(false);

        newChild = this.waypoint.create(700, 300, "waypoint");
        newChild.setVisible(false);



        //  Input Events
        this.cursors = this.input.keyboard.createCursorKeys();

        // note: bring in PirateFunctions..
        this.input.on('gameobjectdown', this.sys.PirateFunctions.onGameObjectClicked, this);


        /* *********************************************************************
         * *********** Player (Pirate Ship) Setup ***************************** 
         * *********************************************************************/

        // make player (pirate ship)
        this.player = this.physics.add.sprite(50, 500, "pirateShip");

        // Camera: 
        this.cameras.main.startFollow(this.player);

        // Player Sprite animation
        this.anims.create({
            key: "shipDown",
            frames: [{ key: "pirateShip", frame: 1 }],
            frameRate: 16

        });

        this.anims.create({
            key: "shipUp",
            frames: [{ key: "pirateShip", frame: 13 }],
            frameRate: 16,

        });

        this.anims.create({
            key: "shipleft",
            frames: [{ key: "pirateShip", frame: 5 }],
            frameRate: 16,

        });

        // this.anims.create({
        //     key: "shipturn",
        //     frames: [{ key: "ship", frame: 9 }],
        //     frameRate: 16
        // });

        this.anims.create({
            key: "shipright",
            frames: [{ key: "pirateShip", frame: 9 }],
            frameRate: 16,

        });




        /* *****************************************************************************************
         * *********************  Cargo and Hunter ships ******************************************
         * ***************************************************************************************** */


        // cargo ships group
        this.cargoShips = this.physics.add.group();

        // Pirate Hunters group
        this.pirateHunters = this.physics.add.group();



        /* *****************************************************************************************
         * *********************  Header and Hearts ************************************************
         * ***************************************************************************************** */

        this.sys.PirateFunctions.sailingTextFunction();



        /* ************************************************************
         * ************** Colliders Section ***************************
         * ************************************************************ */

        // collide with world:
        this.player.setCollideWorldBounds(true);

        //this.cargoShips.children.iterate(function (child) {
        //    child.setCollideWorldBounds(true);
        //});

        //this.pirateHunters.children.iterate(function (child) {
        //    child.setCollideWorldBounds(true);
        //});


        //  Collide the everything for the most part.  
        //this.physics.add.collider(this.player, this.cargoShips);
        //this.physics.add.collider(this.player, this.pirateHunters);
        this.physics.add.collider(this.player, this.islands);
        this.physics.add.collider(this.pirateHunters, this.islands);
        //this.physics.add.collider(this.cargoShip, this.islands);

        // colider for cargoship and port and waypoints
        this.physics.add.overlap(this.port, this.cargoShips, this.destroyCargoShip, null, this);
        this.physics.add.overlap(this.waypoint, this.cargoShips, this.wayPoint, null, this);

        //  Checks to see if the player overlaps with any of the Pirate Hunters, if he does call the pirate hunter combat function
        //this.physics.add.overlap(this.player, this.pirateHunters, this.sys.PirateFunctions.PirateHunterCombat, null, this);

        //  Checks to see if the player overlaps with any of the cargo ships, if he does call the pirate cargoship combat function
        // this.physics.add.overlap(this.player, this.cargoShips, this.sys.PirateFunctions.cargoShipCombat, null, this);


        /* ************************************************************
         * ***************** Dialog Box Section ***********************
         * ************************************************************ */

        // Dialog box:
        this.dialogBox = this.sys.dialogModal;
        this.dialogBox.init({ windowHeight: 60, windowWidth: 450, locationX: 20, locationY: 320 });
        this.dialogBox.toggleWindow();


    } // end create



    // ---------------------------------------------------------
    // update()
    //
    // Description: main update function for scene.  Handles 
    // player movement and end of map event at this level.  
    // Std functionality handles most everything else.
    // -----------------------------------------------------------
    update() {
        ////console.log("in update shipConstruction");
        if (this.gameOver) {
            //console.log("game is over??");
            return;
        }


        if (sleepPirate) {
            return;
        }


        // hunter movement:
        if (this.hunterSailTime > this.maxHunterSail) {

            this.pirateHunters.children.iterate(function (child) {
                // set speed in random direction from -50 to +50.
                child.setVelocityX(-50 + (Math.random() * 100));
                child.setVelocityY(-50 + (Math.random() * 100));
            });
            this.hunterSailTime = 0;
        } else {
            this.hunterSailTime += 1;
        }


        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-playerShip.speed);
            this.player.anims.play("shipleft", true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(playerShip.speed);
            this.player.anims.play("shipright", true);
        } else if (this.cursors.up.isDown) {
            this.player.setVelocityY(-playerShip.speed);
            this.player.anims.play("shipUp", true);
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(playerShip.speed);
            this.player.anims.play("shipDown", true);
        } else {
            this.player.setVelocityX(0);
            this.player.setVelocityY(0);
            //this.player.anims.play("shipturn");
        }

        this.checkForHunterAttack(this);

        // set up advancing hunter spawns over time.
        if ((Date.now() - this.hunterStartTime) > this.hunterIncreaseSpawn && (this.hunterSpawnTimer > 2000)) {

            console.log("increaseing hunter spawn rate now.  Current rate: " + this.hunterSpawnTimer);
            this.hunterSpawnTimer -= 10000;
            if (this.hunterSpawnTimer < 2000) {
                this.hunterSpawnTimer = 2000;
            }

            // shut down the hunter spawn set interval function.
            clearInterval(this.hunterSpawn);

            // start up the Hunter ships again with new interval
            this.hunterSpawn = setInterval(this.spawnHunter, this.hunterSpawnTimer, this);

            this.hunterStartTime = Date.now();

        }// end if changing hunter spawn interval.

    } // end update


    //############################################################
    //###############  OTHER FUNCTIONS  ##########################
    //############################################################

    // ---------------------------------------------------------
    // destroyCargoShip(port, ship)
    //
    // Description: called by cargoship port overlap to destroy the c
    // cargoship now that it has reached its destination.
    // -----------------------------------------------------------
    destroyCargoShip(port, ship) {
        ship.destroy();
    }


    // ---------------------------------------------------------
    // createCargoShip(theScene)
    //
    // Description: Called by set interval timer to create a cargo ship
    // at one of the ports and sends it on it's way to its destination.
    // -----------------------------------------------------------
    createCargoShip(theScene) {

        // randomize starting port and insure it doesn't start and 
        // end at same port!
        //console.log("making a ship");
        this.newFrom = getRandomNumber();
        do {
            this.newTo = getRandomNumber();
        } while (this.newFrom == this.newTo);
        this.cargoShip = new CargoShipConstructor(this.newFrom, this.newTo);
        let myShip = ""; // the new cargoship

        // port locations..
        let location = [{ x: 210, y: 130 }, { x: 825, y: 175 }, { x: 480, y: 420 }, { x: 155, y: 835 }, { x: 840, y: 890 }];

        // modify spawn point depending on start and destination to
        // avoid crossing a waypoint we don't want.
        let changeY = 0;
        let changeX = 0
        if (this.cargoShip.from === 2) {
            changeX = -80
            changeY = -30;

        } else if (this.cargoShip.from < 3) {
            changeY = 70;

        } else {
            changeY = -70;
        }

        // actual cargo ship creation
        //        myShip = theScene.cargoShips.create(location[this.cargoShip.from - 1].x + changeX, location[this.cargoShip.from - 1].y + changeY, "singleShip");

        // create random size and gold load...
        // would like weighted average though..
        let randomShip = [0, 0, 1, 1, 2, 3];
        let size = randomShip[Math.floor(Math.random() * 6)];

        switch (size) {
            case 0:
                // cannoe?!!
                myShip = theScene.cargoShips.create(location[this.cargoShip.from - 1].x + changeX, location[this.cargoShip.from - 1].y + changeY, "cargoDinghy");
                myShip.Ship = new BoatConstructor(1, 5, 25, 0, 0, 0, 0);
                myShip.Ship.cannon = 0;
                myShip.Ship.gold = 10;
                myShip.Ship.speed = 1; // NOTE: since we are using the accelerate to function the speed factors are different
                break;

            case 1:
                // Schooner
                myShip = theScene.cargoShips.create(location[this.cargoShip.from - 1].x + changeX, location[this.cargoShip.from - 1].y + changeY, "cargoSchooner");
                myShip.Ship = new BoatConstructor(15, 10, 40, 0, 0, 0, 0);
                myShip.Ship.cannon = 1;
                myShip.Ship.gold = 25;
                myShip.Ship.speed = 2; // NOTE: since we are using the accelerate to function the speed factors are different
                break;

            case 2:
                // Fluyt
                myShip = theScene.cargoShips.create(location[this.cargoShip.from - 1].x + changeX, location[this.cargoShip.from - 1].y + changeY, "cargoFluyt");
                myShip.Ship = new BoatConstructor(30, 25, 50, 0, 0, 0, 0);
                myShip.Ship.cannon = 4;
                myShip.Ship.gold = 50;
                myShip.Ship.speed = 3; // NOTE: since we are using the accelerate to function the speed factors are different
                break;

            case 3:
                // Galleon
                myShip = theScene.cargoShips.create(location[this.cargoShip.from - 1].x + changeX, location[this.cargoShip.from - 1].y + changeY, "cargoGalleon");
                myShip.Ship = new BoatConstructor(50, 60, 75, 0, 0, 0, 0);
                myShip.Ship.cannon = 10;
                myShip.Ship.gold = 100;
                myShip.Ship.speed = 5; // NOTE: since we are using the accelerate to function the speed factors are different
                break;

            default:

        } // end switch

        // set other cargoship properties
        myShip.to = this.cargoShip.to;
        myShip.from = this.cargoShip.from;

        myShip.name = "cargoShip";
        myShip.hitWaypoint = false;

        // make interactive so we can attack it! Arg!
        myShip.setInteractive();



        // Set Cargoships to move toward destinations.

        // using accellerateTo function to send ships to their way points
        // or destinations.
        //console.log(`From: ${myShip.from}    To:${myShip.to}`)
        if ((myShip.to === 2 && myShip.from === 4) || (myShip.to === 4 && myShip.from === 2) || (myShip.to === 3 && myShip.from === 4) || (myShip.to === 4 && myShip.from === 3)) {

            theScene.physics.accelerateTo(myShip, 300, 300, myShip.Ship.speed);
            ////console.log("going to left way point");
        } else if ((myShip.to === 5 && myShip.from === 1) || (myShip.to === 1 && myShip.from === 5) || (myShip.to === 3 && myShip.from === 5) || (myShip.to === 5 && myShip.from === 3)) {
            ////console.log("going to right way point");
            theScene.physics.accelerateTo(myShip, 700, 300, myShip.Ship.speed);

        } else {
            theScene.physics.accelerateTo(myShip, location[this.cargoShip.to - 1].x, location[this.cargoShip.to - 1].y, myShip.Ship.speed);
        }


    } // end create cargo ship


    // ---------------------------------------------------------
    // wayPoint(waypoint, cargoShip)
    //
    // Description: called by waypoint overlap event.  Sends cargo
    // ship on to its destination.
    // -----------------------------------------------------------
    wayPoint(waypoint, cargoShip) {
        let location = [{ x: 210, y: 130 }, { x: 825, y: 175 }, { x: 480, y: 420 }, { x: 155, y: 835 }, { x: 840, y: 890 }];

        if (!(cargoShip.from === 1 && cargoShip.to === 3) && !(cargoShip.from === 3 && cargoShip.to === 1) && !(cargoShip.from === 2 && cargoShip.to === 3) && !(cargoShip.from === 3 && cargoShip.to === 2)) {
            if (cargoShip.hitWaypoint === false) {
                cargoShip.setVelocityX(0);
                cargoShip.setVelocityY(0);
                this.physics.accelerateTo(cargoShip, location[cargoShip.to - 1].x, location[cargoShip.to - 1].y, cargoShip.Ship.speed);

                //ship.destroy()
                //.log("hit waypoint, headed to" + ship.to);
                cargoShip.hitWaypoint = true;
            }
        }

    } // end wayPoint



    // ---------------------------------------------------------
    // spawnHunter(theScene)
    //
    // Description: Causes a Pirate Hunter ship to spawn at a 
    // random port.
    // Starts the hunter moveing in a random direction.
    // -----------------------------------------------------------
    spawnHunter(theScene) {
        // port locations for reference.. ports are 30 by 30 centered on locations below. Must spawn so there is no overlap
        // location = [{ x: 210, y: 130 }, { x: 825, y: 175 }, { x: 480, y: 420 }, { x: 155, y: 835 }, { x: 840, y: 890 }];
        // hunter 25 are  25 wide, 50 high..

        //corrisponding hunter ship spawn locations:
        let hunterSpawnLocations = [{ x: 210, y: 200 }, { x: 825, y: 250 }, { x: 480, y: 345 }, { x: 155, y: 760 }, { x: 770, y: 890 }];

        // get random port
        let portIndex = Math.floor(Math.random() * 5);
        if (portIndex > 4) { portIndex = 4 };

        // hunter ships are all Brigs..
        let newChild = "";

        newChild = theScene.pirateHunters.create(hunterSpawnLocations[portIndex].x, hunterSpawnLocations[portIndex].y, "hunterImg");
        newChild.name = "hunterShip";
        newChild.Ship = new BoatConstructor(30, 25, 50, 0, 0, 0, 0);
        newChild.Ship.cannon = 8;
        newChild.Ship.gold = 50;
        newChild.setInteractive();
        newChild.setCollideWorldBounds(true);


    } // end spawnHunter



    // ---------------------------------------------------------
    // checkForHunterAttack(theScene)
    //
    // Description: checks to see if a player is too close to a Hunter.  
    // If so, the specific Hunter's HunterAttack timer starts and Hunter Attack flag  is set.
    // If the Attack Flag is set, and timer is over 1 seconds (1000), 
    // then calls HunterAttack().  
    // If the player is not in range of a Hunter, then Attack Flag is set
    // to false and timer set to current time. 
    // NOTE: it is possible for the player to get hit by multiple hunters
    // in rapid succession if their are multiple hunters close.
    // -----------------------------------------------------------
    checkForHunterAttack(theScene) {

        let currentTime = "";

        // iterate over the hunter children to see if in range etc.
        theScene.pirateHunters.children.iterate(
            function (child) {

                // check for range.
                if (
                    (Math.abs((theScene.player.x - child.x)) <= 150) &&
                    (Math.abs((theScene.player.y - child.y)) <= 150)
                ) {
                    //In range, check if attack flage set.  if so check for elapsed time
                    if (child.AttackFlag === true) {
                        // check elapsed time.
                        currentTime = Date.now();
                        if ((currentTime - child.StartTime) >= theScene.hunterAttackTime) {
                            // Attack!
                            theScene.sys.PirateFunctions.HunterAttack(theScene.player, child);

                            // reset attack time
                            child.StartTime = currentTime;
                        } // end if enough time elapsed

                    } // end if child AttackFlag set.
                    else {
                        // set Attack Flag and start timer
                        child.AttackFlag = true;
                        child.StartTime = Date.now();
                    }

                } // end if in range.
                else {
                    // make sure AttackFlag not set. Timer set to current time.
                    child.AttackFlag = false;
                    child.StartTime = Date.now();
                }

            } // end function for iteration
        ); // end iterate

    } // end checkForHunterAttack.


    // ---------------------------------------------------------
    // setSleepFlag(bool)
    //
    // Description: sets our scene sleep flag to true (sleeping) or 
    // false (awake.)
    // -----------------------------------------------------------
    setSleepFlag(bSleep) {
        sleepPirate = bSleep;

        if (bSleep === true) {
            this.OceanAudio.pause();
            //this.JungleAudio.pause();
            //if (this.EarthQuakeAudio.isPlaying) {
            //    this.EarthQuakeAudio.pause();
            //}

            // shut down the cargo spawn set interval function.
            clearInterval(this.cargoSpawn);

            // shut down the hunter spawn set interval function.
            clearInterval(this.hunterSpawn);

            this.hunterStartTime = 0;

        }
    } // end setSleepFlag



    // ---------------------------------------------------------
    // isSleepFlagSet()
    //
    // Description: Override to some extent. Returns our global flag 
    // on if this scene is supposed to be sleeping.
    // -----------------------------------------------------------
    isSleepFlagSet() {
        return sleepPirate;
    }


    // ---------------------------------------------------------
    // onWake()
    //
    // Description: Handler for when scene wakes.  Sets the current
    // player position based on where they left the previous map
    // to provide consistency.  Std handler does everything else.
    // -----------------------------------------------------------
    onWake() {
        //console.log("in PirateSailing onWake");

        //##################### TEST CODE #########################
        //playerShip.hitPoints = 1000;
        //playerShip.bIronPlate = true;
        //playerShip.cannon = 20;
        //playerShip.speed = 150;
        //Gold += 100;
        //##################### END TEST CODE #########################


        // player always starts at Tortuga...
        //this.player.x = playerStartX;
        //this.player.y = playerStartY;
        ////console.log("Set player position to " + playerStartX + ", " + playerStartY);

        // update life and resource displays.
        //this.sys.PirateFunctions.updateHearts();
        this.sys.PirateFunctions.updateSailingDisplay();

        // scale size of ship to type of ship the player ended up with.
        switch (playerShip.shipType) {

            case "Canoe":
                this.player.setScale(0.2);
                break;

            case "Schooner":
                this.player.setScale(0.3);
                break;

            case "Brig":
                this.player.setScale(0.4);
                break;

            case "Frigate":
                this.player.setScale(0.5);
                break;

            default:
                this.player.setScale(0.4);
                break;
        } // end switch



        // set Sailing ambiance
        this.OceanAudio.resume();


        // start up the cargo ships again
        this.cargoSpawn = setInterval(this.createCargoShip, this.cargoShipTimer, this);

        // start up the Hunter ships again
        this.hunterSpawn = setInterval(this.spawnHunter, this.hunterSpawnTimer, this);

        this.hunterStartTime = Date.now(); // start up hunter spawn rate increase timer.

    } // end onWake


} // end class PirateSailing


// global functions...
function
    getRandomNumber() {
    return (Math.floor(Math.random() * 5)) + 1;
}

function CargoShipConstructor(from, to) {
    this.from = from;
    this.to = to;

}