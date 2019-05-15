/* eslint-disable indent */

class Shipwrecked4 extends Phaser.Scene {
    constructor() {
        super({ key: "Shipwrecked4" });

        this.gold = 0;
        this.wood = 0;
        this.rope = 0;
        this.sails = 0;
        this.food = 0;
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


        // status icons will be on top of anything else.
        this.load.image("heart2", "assets/heartshealth2.png");
        this.load.image("heart1", "assets/heartshealth1.png");
        this.load.image("noHealth", "assets/noHealth.png");
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

        // bottom
        for (i = 1000; i > 0; i -= 16) {
            console.log("in second i loop for ocean");
            for (j = 1000; j > 935; j -= 16) {
                this.BigOcean.create(i, j, "ocean");
            }// end for j
        }// end for i

        console.log("out of ocean 4 creation");


        /* *********************************************************************
         * *********** Set Up Player ******************************************* 
         * *********************************************************************/

        // get player start position data from data manager:
        //this.registry.events.on('changedata', this.getStartPosition, this);

        // The player and its settings
        this.player = this.physics.add.sprite(this.startX, this.startY, "dude");

        //  Player physics properties. Give the little guy a slight bounce.
        // this.player.setBounce(0.15);
        this.player.setCollideWorldBounds(true);


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


        /* *****************************************************************************************
         * *********************  Header and Hearts ************************************************
         * ***************************************************************************************** */

        // Header and hearts
        this.goldText = this.add.text(20, 10, "Gold: 0", { fontsize: "32px", fill: "#000", align: "center" });
        this.goldText.setScrollFactor(0);

        this.woodText = this.add.text(100, 10, "Wood: 0", { fontsize: "32px", fill: "#000", align: "center" });
        this.woodText.setScrollFactor(0);

        this.ropeText = this.add.text(180, 10, "Rope: 0", { fontsize: "32px", fill: "#000", align: "center" });
        this.ropeText.setScrollFactor(0);

        this.foodText = this.add.text(260, 10, "Food: 0", { fontsize: "32px", fill: "#000", align: "center" });
        this.foodText.setScrollFactor(0);

        //adds 2 hearts to display
        this.playerLifeImg = this.add.image(500, 50, "heart2")
        this.playerLifeImg.setScrollFactor(0);


        /* ************************************************************
         * ************** Colliders Section ***************************
         * ************************************************************ */

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

        //console.log("Doing update 4");

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
        }// end else

        // Health Heart display update:
        // checks if 50% health
        if (playerLife === 5) {
            this.playerLifeImg.setTexture("heart1");
        }

        //  Position the center of the camera on the player
        //  We -400 because the camera width is 800px and
        //  we want the center of the camera on the player, not the left-hand side of it
        this.cameras.main.scrollX = this.player.x - 400;
        this.cameras.main.scrollY = this.player.y - 300;


        /* ***************************************************
         * Check for edge of map to switch maps!
         * 
         * Be sure to place player on new map OUTSIDE of check zone.
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
        }// end else if
        // right is ocean, bottom is ocean so don't need them.

    }// end update


    // ---------------------------------------------------------
    // boarPlayerCombat(thePlayer, boar)
    //
    // Description: Handler for when player and boar connect.
    // currently just decrements players hitpoints and if player
    // reaches 0, ends the game.
    // -----------------------------------------------------------
    boarPlayerCombat(thePlayer, boar) {
        playerLife -= 5;
        boar.disableBody(true, true);

        if (playerLife <= 0) {

            this.physics.pause();

            thePlayer.setTint(0xff0000);

            thePlayer.anims.play("turn");

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
