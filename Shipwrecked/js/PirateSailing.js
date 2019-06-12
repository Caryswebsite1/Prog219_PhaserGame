/* eslint-disable indent */

class PirateSailing extends Phaser.Scene {
    constructor() {
        super({ key: "PirateSailing" });

        this.gameOver = false;
        this.hunterStartTime = Date.now();
        this.hunterSpawnTime = 60000;   // one hunter every min.
        this.hunterAttackTime = 1000;  // if a hunter is in range for 1 second, they attack!

        // sail times, actually based on number of update calls between, not actual miliseconds etc.
        this.hunterSailTime = 150; // current elapsed hunter sail time.  Set to max to force move at start.
        this.maxHunterSail = 150; // max allowed hunter sail time before new direction set.

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
        //this.load.plugin('PirateFunctionsPlugin', './js/PirateFunctionsPlugin.js');

        // main images
        this.load.image("island1", "assets/island1.png");
        this.load.image("island2", "assets/island2.png");
        this.load.image("island3", "assets/island3.png");
        this.load.image("island4", "assets/island4.png");
        this.load.image("island5", "assets/island5.png");

        this.load.image("bigWater", "assets/ocean.jpg");

        this.load.image("hunterImg", "assets/boarhit.png");


        this.load.spritesheet("ship", "assets/pirateShip.png", { frameWidth: 80, frameHeight: 95 });


        // // status icons will be on top of anything else.
        // this.load.image("singleHeart", "assets/singleHeart16.png");
        // this.load.image("blankHeart", "assets/blankHeart16.png");

        // Audio: 
        //Really should have.ogg too.
        // Notes: instances allows for the given number of multiple simultainous plays of the same item.
        // so instances :4 allows 4 copies of that sound to play simultainiously or overlapping if desired.
        this.load.audio('OceanSound', ['assets/audio/Waves.mp3']);

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
        console.log(this.sys.dialogModal);

        //this.sys.install('PirateFunctionsPlugin');
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


        // set Sailing ambiance
        this.OceanAudio.volume = 0.4;
        this.OceanAudio.play({ loop: true });
        this.OceanAudio.pause();


        /* *********************************************************************
         * *********** Main Map Setup ******************************************* 
         * *********************************************************************/


        // to only add an image someplace, you would say:
        this.add.image(500, 500, "bigWater");


        // islands group
        this.islands = this.physics.add.staticGroup();
        let newChild = "";

        newChild = this.islands.create(500, 500, "island1");
        newChild.name = "island";

        newChild = this.islands.create(100, 100, "island2");
        newChild.name = "island";

        newChild = this.islands.create(800, 100, "island3");
        newChild.name = "island";

        newChild = this.islands.create(100, 850, "island4");
        newChild.name = "island";

        newChild = this.islands.create(800, 850, "island5");
        newChild.name = "island";




        //  Input Events
        this.cursors = this.input.keyboard.createCursorKeys();

        // note: bring in PirateFunctions..
        //this.input.on('gameobjectdown', this.sys.PirateFunctions.onGameObjectClicked, this);

        /* *********************************************************************
         * *********** Player (Pirate Ship) Setup ***************************** 
         * *********************************************************************/

        // make player (pirate ship)
        this.player = this.physics.add.sprite(300, 100, "ship");
        this.player.setScale(0.4);

        this.cameras.main.startFollow(this.player);


        this.anims.create({
            key: "shipDown",
            frames: [{ key: "ship", frame: 1 }],
            frameRate: 16

        });

        this.anims.create({
            key: "shipUp",
            frames: [{ key: "ship", frame: 13 }],
            frameRate: 16,

        });

        this.anims.create({
            key: "shipleft",
            frames: [{ key: "ship", frame: 5 }],
            frameRate: 16,

        });

        // this.anims.create({
        //     key: "shipturn",
        //     frames: [{ key: "ship", frame: 9 }],
        //     frameRate: 16
        // });

        this.anims.create({
            key: "shipright",
            frames: [{ key: "ship", frame: 9 }],
            frameRate: 16,

        });




        /* *****************************************************************************************
         * *********************  Cargo and Hunter ships ******************************************
         * ***************************************************************************************** */


        // cargo ships group
        //this.cargoShips = this.physics.add.group();
        //{
        //    key: "cargoShip",
        //    repeat: 6,
        //    setXY: { x: 150, y: 50, stepX: 150, stepY: 150 }
        //});

        //newChild = "";

        //       newChild = this.cargoShips.create(i, j, "cargoShipImg");
        //        newChild.name = "cargoShip";



        // Pirate Hunters group
        this.pirateHunters = this.physics.add.group();

        /* ######################  TEST CODE ##############################
         * ###################################################################
         */

        // hunter ships all Brigs..
        newChild = "";

        newChild = this.pirateHunters.create(300, 300, "hunterImg");
        newChild.name = "hunterShip";
        newChild.Ship = new BoatConstructor(30, 25, 50, 0, 0, 0, 0);
        newChild.Ship.cannon = 8;

        /* ######################   END TEST CODE ##############################
         * ###################################################################
         */




        /* *****************************************************************************************
         * *********************  Header and Hearts ************************************************
         * ***************************************************************************************** */

        //this.sys.PirateFunctions.sailingTextFunction();




        //this.scene.add.text(60, 64, 'hi');
        //this.add.text(210, 10, "Food: "); //, this.style);
        //this.text1.parseList(this.canoe);





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


        //  Checks to see if the player overlaps with any of the Pirate Hunters, if he does call the pirate hunter combat function
       // this.physics.add.overlap(this.player, this.pirateHunters, this.sys.PirateFunctions.PirateHunterCombat, null, this);

        //  Checks to see if the player overlaps with any of the cargo ships, if he does call the pirate cargoship combat function
        // this.physics.add.overlap(this.player, this.cargoShips, this.sys.PirateFunctions.cargoShipCombat, null, this);


    } // end create



    // ---------------------------------------------------------
    // update()
    //
    // Description: main update function for scene.  Handles 
    // player movement and end of map event at this level.  
    // Std functionality handles most everything else.
    // -----------------------------------------------------------
    update() {
        //console.log("in update shipConstruction");
        if (this.gameOver) {
            console.log("game is over??");
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
        }
        else {
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

        this.checkForHunterSpawn();
        this.checkForCargoShipSpawn();

        this.checkForHunterAttack();

    } // end update


    // ---------------------------------------------------------
    // checkForHunterSpawn()
    //
    // Description: checks to see if enough time as elapse to 
    // cause another Pirate Hunter to spawn.  If so, it spawns
    // the hunter in a random port location.
    // -----------------------------------------------------------
    checkForHunterSpawn() {
        // let currentTime = Date.now();

        // if ((currentTime - this.hunterStartTime) >= this.hunterSpawnTime) {
        //     // spawn hunter!
        //     let locX = Math.random() * 1000;
        //     let locY = Math.random() * 1000;

        //     let newChild = "";

        //     // newChild = this.pirateHunters.create(500, 500, "pirateHunterImg");
        //     // newChild.name = "pirateHunter";

        //     // reset timer.
        //     this.hunterStartTime = Date.now();
        // }// end if time to spawn hunter.

    }// end check for hunter spawn.



    // ---------------------------------------------------------
    // checkForHunterAttack()
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
    checkForHunterAttack() {

        //let currentTime = "";

        //// iterate over the hunter children to see if in range etc.
        //this.pirateHunters.children.iterate(
        //    function (child) {

        //        // check for range.
        //        if (
        //            (Math.abs((this.player.x - child.x)) <= 150) &&
        //            (Math.abs((this.player.y - child.y)) <= 150)
        //        ) {
        //            //In range, check if attack flage set.  if so check for elapsed time
        //            if (child.AttackFlag === true) {
        //                // check elapsed time.
        //                currentTime = Date.now();
        //                if ((currentTime - child.StartTime) >= this.hunterAttackTime) {
        //                    // Attack!
        //                    this.sys.PirateFunctions.HunterAttack(this.player, child);

        //                    // reset attack time
        //                    child.StartTime = currentTime;
        //                }// end if enough time elapsed

        //            }// end if child AttackFlag set.
        //            else {
        //                // set Attack Flag and start timer
        //                child.AttackFlag = true;
        //                child.StartTime = Date.now();
        //            }

        //        }// end if in range.
        //        else {
        //            // make sure AttackFlag not set. Timer set to current time.
        //            child.AttackFlag = false;
        //            child.StartTime = Date.now();
        //        }

        //    }// end function for iteration
        //); // end iterate

    }// end checkForHunterAttack.



    // ---------------------------------------------------------
    // checkForCargoShipSpawn()
    //
    // Description: checks each island to see if enough time has 
    // elapse to cause another cargo ship to spawn.  If so, it spawns
    // a cargo ship just outside that island's port with another Island
    // destination.
    // -----------------------------------------------------------
    checkForCargoShipSpawn() {

        // if (
        //     (Math.abs((this.player.x - hunter.x)) <= 150) &&
        //     (Math.abs((this.player.y - hunter.y)) <= 150)
        // ) {

        //let currentTime = Date.now();

        //if ((currentTime - hunterStartTime) >= this.hunterSpawnTime) {
        //    // spawn hunter!
        //    let locX = Math.random() * 1000;
        //    let locY = Math.random() * 1000;

        //    let newChild = "";

        //    newChild = this.pirateHunters.create(500, 500, "pirateHunterImg");
        //    newChild.name = "pirateHunter";

        //    // restt timer.
        //    hunterStartTime = Date.now();
        //}// end if time to spawn hunter.

    }// end checkForCargoShipSpawn



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

        }
    }// end setSleepFlag


    // ---------------------------------------------------------
    // onWake()
    //
    // Description: Handler for when scene wakes.  Sets the current
    // player position based on where they left the previous map
    // to provide consistency.  Std handler does everything else.
    // -----------------------------------------------------------
    onWake() {
        console.log("in PirateSailing onWake");

        // player always starts at Tortuga...
        //this.player.x = playerStartX;
        //this.player.y = playerStartY;
        //console.log("Set player position to " + playerStartX + ", " + playerStartY);

        // update life and resource displays.
        //this.sys.PirateFunctions.updateHearts();
        //this.sys.PirateFunctions.updateSailingDisplay();

        //// call timer update:
        //this.sys.globalFunctions.VolcanoTimer(true);

        // set Sailing ambiance
        this.OceanAudio.resume();
        //this.JungleAudio.resume();

    }// end onWake


} // end class PirateSailing
