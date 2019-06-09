// JavaScript source code
class PirateSailing extends Phaser.Scene {
    constructor() {
        super({ key: "PirateSailing" });

        this.gameOver = false;
        this.oldSceneKey = null;
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
        this.load.plugin('GlobalFunctionsPlugin', './js/GlobalFunctions.js');

        // main images
        this.load.image("island1", "assets/island1.png");
        this.load.image("island2", "assets/island2.png");
        this.load.image("island3", "assets/island3.png");
        this.load.image("island4", "assets/island4.png");
        this.load.image("island5", "assets/island5.png");

        this.load.image("bigWater", "assets/ocean.jpg");

        this.load.spritesheet("ship", "assets/pirateShip.png", { frameWidth: 80, frameHeight: 95 });


        // // status icons will be on top of anything else.
        // this.load.image("singleHeart", "assets/singleHeart16.png");
        // this.load.image("blankHeart", "assets/blankHeart16.png");


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

        this.sys.install('GlobalFunctionsPlugin');
        console.log("from ShipConstruction")
        console.log(this.sys.globalFunctions);


        this.events.on('wake', this.onWake, this);

        // Camera: set bounds to whole world size.
        this.cameras.main.setBounds(0, 0, 1000, 1000);

        // set actual camera width and height for what we see.
        //this.cameras.main.setSize(1000, 1000);
        this.cameras.main.setSize(500, 400);


        /* *********************************************************************
         * *********** Main Map Setup ******************************************* 
         * *********************************************************************/


        // to only add an image someplace, you would say:
        this.add.image(500, 500, "bigWater");
        this.add.image(500, 500, "island1");
        this.add.image(100, 100, "island2");
        this.add.image(800, 100, "island3");
        this.add.image(100, 850, "island4");
        this.add.image(800, 850, "island5");


        //  Input Events
        this.cursors = this.input.keyboard.createCursorKeys();

        // note: gameobjectdown handler should be in global plug in now.
        this.input.on('gameobjectdown', this.sys.globalFunctions.onGameObjectClicked, this);


        this.player = this.physics.add.sprite(300, 100, "ship");
        this.player.setCollideWorldBounds(true);

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
         * *********************  Header and Hearts ************************************************
         * ***************************************************************************************** */






        //this.scene.add.text(60, 64, 'hi');
        //this.add.text(210, 10, "Food: "); //, this.style);
        //this.text1.parseList(this.canoe);


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


        //console.log("Doing update 2");
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-100);
            this.player.anims.play("shipleft", true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(100);
            this.player.anims.play("shipright", true);
        } else if (this.cursors.up.isDown) {
            this.player.setVelocityY(-100);
            this.player.anims.play("shipUp", true);
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(100);
            this.player.anims.play("shipDown", true);
        } else {
            this.player.setVelocityX(0);
            this.player.setVelocityY(0);
            //this.player.anims.play("shipturn");
        }


    } // end update


    // ---------------------------------------------------------
    // setSleepFlag(bool)
    //
    // Description: sets our scene sleep flag to true (sleeping) or 
    // false (awake.)
    // -----------------------------------------------------------
    setSleepFlag(bSleep) {
        sleepPirate = bSleep;
    }


    // ---------------------------------------------------------
    // onWake()
    //
    // Description: Handler for when scene wakes.  Sets the current
    // player position based on where they left the previous map
    // to provide consistency.  Std handler does everything else.
    // -----------------------------------------------------------
    onWake() {
        console.log("in PirateSailing onWake");

        // update life and resource displays.
        this.sys.globalFunctions.updateHearts();
        this.sys.globalFunctions.updateResourceDisplay();

    }


} // end class PirateSailing
