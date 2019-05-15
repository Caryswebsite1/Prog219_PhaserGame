/* eslint-disable indent */

class Shipwrecked4 extends Phaser.Scene {
    constructor() {
        super({ key: "Shipwrecked4" });

        this.gold = 0;
        this.wood = 0;
        this.rope = 0;
        this.sails = 0;
        this.food = 0;
        this.playerLife = 10;
        this.gameOver = false;
        this.score = 0;
        this.startX = 500;
        this.startY = 500;
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
        this.load.image("bigSand", "assets/island_sand_d.jpg");
        this.load.image("ocean", "assets/ocean16.jpg");
        this.load.image("jungle", "assets/jungle_mntn2_d16.jpg");
        this.load.image("hcTree", "assets/horse-chestnut-tree_16.png");
        this.load.image("boar", "assets/boarhit.png");
        this.load.spritesheet("dude", "assets/universal-lpc-sprite_male_01_32pix.png", { frameWidth: 32, frameHeight: 32 });
    }// end preload

    // NOTE:  Our dude sprite sheet is 0 - 12 sprites wide over all. so
    //        that means row 1 is 0 -12 for a total of 13 POSSIBLE slots.
    //        However, we only have 7 in row 1 so slots 7-12 are empty.
    //        row 2 starts on slot 13, etc. 


    // ---------------------------------------------------------
    // create()
    //
    // Description: main create function for scene.  Handles 
    // initial creation of all scene objects and player sprite.
    // Sets interaction types etc.
    // -----------------------------------------------------------
    create() {

        this.events.on('wake', this.onWake, this);

        // Camera: set bounds to whole world size.
        this.cameras.main.setBounds(0, 0, 1000, 1000);

        // set actual camera width and height for what we see.
        this.cameras.main.setSize(800, 600);


        // only for test..
        this.gold = 1;
        this.wood = 2;
        this.rope = 3;
        this.sails = 4;
        this.food = 5;
        this.score = 6;

        // loop variables
        let i = 0;
        let j = 0;

        /*
        // add the ground we can walk on (beach etc) as the whole underlying group to start..
        this.ground = this.physics.add.staticGroup();

        //  A sand everywhere.
        let i = 0;
        let j = 0;
        for (i = 0; i < 1000; i += 16) {
            console.log("in first i loop for sand");
            for (j = 0; j < 1000; j += 16) {
                this.ground.create(i, j, "sand");
            }// end for j
        }// end for i
*/

        // to only add an image someplace, you would say:
        this.add.image(500, 500, "bigSand");


        ////  add ocean as a static but we will set it up as a collider later.
        this.BigOcean = this.physics.add.staticGroup();
        // just a couple tiles wide down the right and bottom for now.
        for (i = 1000; i > 919; i -= 16) {
            console.log("in first i loop for ocean");
            for (j = 0; j < 1000; j += 16) {
                this.BigOcean.create(i, j, "ocean");
            }// end for j
        }// end for i

        for (i = 1000; i > 0; i -= 16) {
            console.log("in second i loop for ocean");
            for (j = 1000; j > 935; j -= 16) {
                this.BigOcean.create(i, j, "ocean");
            }// end for j
        }// end for i


        // **********************************************************************************
        // NOTE: this method sucks.  would be better to custom up some images of the bay then drop them in as an object.
        // ***********************************************************************************
        // create a bay
        //let bayX = 80;
        //let bayY = 300;
        //let xMax = 0;
        //// do top halve..
        //for (bayY = 320; bayY <= 480; bayY += 16) {
        //    for (bayX = 80; bayX < (80 + (xMax * 16)); bayX += 16) {
        //        this.BigOcean.create(bayX, bayY, "ocean");

        //    }
        //    xMax += 1;
        //}

        //// do middle:
        //for (bayY = 496; bayY <= 560; bayY += 16) {
        //    for (bayX = 80; bayX < (80 + (xMax * 16)); bayX += 16) {
        //        this.BigOcean.create(bayX, bayY, "ocean");
        //    }

        //}


        //// do bottom halve
        //xMax -= 1;
        //for (bayY = 576; bayY <= 736; bayY += 16) {
        //    for (bayX = 80; bayX < (80 + (xMax * 16)); bayX += 16) {
        //        this.BigOcean.create(bayX, bayY, "ocean");
        //    }
        //    xMax -= 1;
        //}

        //console.log("out of ocean creation");


        /* *********************************************************************
         * ********** Set Up Player ******************************************* */

        // get player start position data from data manager:
        this.registry.events.on('changedata', this.getStartPosition, this);

        // The player and its settings
        this.player = this.physics.add.sprite(this.startX, this.startY, "dude");

        //  Player physics properties. Give the little guy a slight bounce.
        // this.player.setBounce(0.15);
        this.player.setCollideWorldBounds(true);


        // ######################################
        // NOTE:  
        // Our dude sprite sheet is 0 - 12 sprites wide over all.so
        // that means row 1 is 0 -12 for a total of 13 POSSIBLE slots.
        // However, we only have 7 in row 1 so slots 7-12 are empty.
        // row 2 starts on slot 13, etc. 
        // ##########################################
/*
        // Our player animations, turning, walking up, down, left and right.
        // start and end are the frame numbers for the starting picture through 
        // the end picture of the animation.
        this.anims.create({
            key: "front",
            frames: this.anims.generateFrameNumbers("dude", { start: 130, end: 138 }),
            frameRate: 16,
            repeate: -1
        });

        this.anims.create({
            key: "back",
            frames: this.anims.generateFrameNumbers("dude", { start: 104, end: 112 }),
            frameRate: 16,
            repeate: -1
        });


        this.anims.create({
            key: "left",
            frames: this.anims.generateFrameNumbers("dude", { start: 117, end: 125 }),
            frameRate: 16,
            repeat: -1
        });

        this.anims.create({
            key: "turn",
            frames: [{ key: "dude", frame: 130 }],
            frameRate: 16
        });

        this.anims.create({
            key: "right",
            frames: this.anims.generateFrameNumbers("dude", { start: 143, end: 151 }),
            frameRate: 16,
            repeat: -1
        });
*/

        //  Input Events
        this.cursors = this.input.keyboard.createCursorKeys();


        // Piggy down the right side area for now
        this.boars = this.physics.add.group({
            key: "boar",
            repeat: 4,
            setXY: { x: 550, y: 0, stepY: 150 }
        });


        this.boars.children.iterate(function (child) {
            //  Give each boar a speed to the left and bounded by world and an id number.
            child.setVelocityX(-10);
            child.setCollideWorldBounds(true);
        });


        //  The score
        this.scoreText = this.add.text(16, 16, myItem, { fontSize: "32px", fill: "#000" });

        //  Collide the player and the boars with the ocean
        this.physics.add.collider(this.player, this.BigOcean);
        this.physics.add.collider(this.boars, this.BigOcean);

        // collide boars with each other.
        this.physics.add.collider(this.boars, this.boars);

        //  Checks to see if the player overlaps with any of the boars, if he does call the boarCombat function
        this.physics.add.overlap(this.player, this.boars, this.boarPlayerCombat, null, this);

    }// end create


    // ---------------------------------------------------------
    // update()
    //
    // Description: main update function for scene.  Handles 
    // player movement and end of map event at this level.  
    // Std functionality handles most everything else.
    // -----------------------------------------------------------
    update() {
        //console.log("in update 4");
        if (this.gameOver) {
            console.log("game is over??");
            return;
        }

        //if (this.scene.isSleeping("Shipwrecked4")) {
        //    return;
        //}

        if (sleep4) {
            return;
        }


        console.log("Doing update 4");

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-100);
            this.player.anims.play("left", true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(100);
            this.player.anims.play("right", true);
        }
        else if (this.cursors.up.isDown) {
            this.player.setVelocityY(-100);
            this.player.anims.play("back", true);
        }
        else if (this.cursors.down.isDown) {
            this.player.setVelocityY(100);
            this.player.anims.play("front", true);
        } else {
            this.player.setVelocityX(0);
            this.player.setVelocityY(0);
            this.player.anims.play("turn");
        }


        //  Position the center of the camera on the player
        //  We -400 because the camera width is 800px and
        //  we want the center of the camera on the player, not the left-hand side of it
        this.cameras.main.scrollX = this.player.x - 400;
        this.cameras.main.scrollY = this.player.y - 300;


        /* ***************************************************
         * check for edge of map to switch maps!
         * *************************************************** */
        // top 
        if (this.player.y <= 17) {
            playerStartX = this.player.x;
            playerStartY = 975;
            console.log("in transition from 4 to 3. x and y set to: " + playerStartX + ", " + playerStartY);
            this.scene.wake("Shipwrecked3");
            this.scene.bringToTop("Shipwrecked3");
            this.scene.setActive(true, "Shipwrecked3");
            this.scene.setVisible(true, "Shipwrecked3");
            sleep3 = false;

            this.scene.setActive(false, "Shipwrecked4");
            this.scene.setVisible(false, "Shipwrecked4");
            this.scene.sleep("Shipwrecked4");
            sleep4 = true;
        } // now left side:
        else if (this.player.x <= 17) {
            playerStartX = 975;
            playerStartY = this.player.y;
            console.log("in transition from 4 to 1. x and y set to: " + playerStartX + ", " + playerStartY);
            this.scene.wake("Shipwrecked");
            this.scene.bringToTop("Shipwrecked");
            this.scene.setActive(true, "Shipwrecked");
            this.scene.setVisible(true, "Shipwrecked");
            sleep1 = false;

            this.scene.setActive(false, "Shipwrecked4");
            this.scene.setVisible(false, "Shipwrecked4");
            this.scene.sleep("Shipwrecked4");
            sleep4 = true;
        }
        // left is ocean, top is ocean so don't need them.

    }// end update



    //--------------------------------------------------------------
    //getStartPosition(parent, key, data)
    //
    // Description:  changedata handler: gets start position from registry.
    // data is set by previous scene on scene transition.
    // --------------------------------------------------------------
    getStartPosition(parent, key, data) {
        if (key == 'playerStartX') {
            this.startX = data;
        }
        else if (key == 'playerStartY') {
            this.startY = data;
        }
    }// end getStartPosition


    // ---------------------------------------------------------
    // boarPlayerCombat(player, boar)
    //
    // Description: Handler for when player and boar connect.
    // currently just decrements players hitpoints and if player
    // reaches 0, ends the game.
    // -----------------------------------------------------------
    boarPlayerCombat(player, boar) {
        this.playerLife -= 5;
        boar.disableBody(true, true);

        if (this.playerLife <= 0) {

            this.physics.pause();

            player.setTint(0xff0000);

            player.anims.play("turn");

            this.gameOver = true;

        }// end if playerLife

    }// end boarPlayerCombat


    // ---------------------------------------------------------
    // onWake()
    //
    // Description: Handler for when scene wakes.  Sets the current
    // player position based on where they left the previous map
    // to provide consistency.  Std handler does everything else.
    // -----------------------------------------------------------
    onWake() {
        console.log("in Shipwrecked 4 onWake");
        this.player.x = playerStartX;
        this.player.y = playerStartY;
        console.log("Set player position to " + playerStartX + ", " + playerStartY);
    }


} // end class
