/* eslint-disable indent */

class Shipwrecked extends Phaser.Scene {
    constructor() {
        super({ key: "Shipwrecked" });

        this.gold = 0;
        this.wood = 0;
        this.rope = 0;
        this.sails = 0;
        this.food = 0;
        this.gameOver = false;
        this.score = 0;
        this.startX = 390;
        this.startY = 400;
        this.boarRunTime = 0;
        this.maxBoarRun = 150;
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
        this.load.image("portLake", "assets/portLake.png");
        this.load.image("ocean2", "assets/ocean2.png");
        this.load.image("greenGround", "assets/greenGround.png");
        this.load.image("jungleTrees", "assets/JungleOK64.png");
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
        this.add.image(615, 370, "greenGround");

        //  add ocean as a static but we will set it up as a collider later.
        this.BigOcean = this.physics.add.staticGroup();
        this.BigOcean.create(500, 970, "ocean2");
        this.BigOcean.create(125, 500, "portLake");

        // just a couple tiles wide down the left for now.

        /*
        for (i = 0; i < 65; i += 16) {
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
        let bayX = 80;
        let bayY = 300;
        let xMax = 0;
        // do top halve..
        for (bayY = 320; bayY <= 480; bayY += 16) {
            for (bayX = 80; bayX < (80 + (xMax * 16)); bayX += 16) {
                this.BigOcean.create(bayX, bayY, "ocean");

            }
            xMax += 1;
        }

        // do middle:
        for (bayY = 496; bayY <= 560; bayY += 16) {
            for (bayX = 80; bayX < (80 + (xMax * 16)); bayX += 16) {
                this.BigOcean.create(bayX, bayY, "ocean");
            }

        }


        // do bottom halve
        xMax -= 1;
        for (bayY = 576; bayY <= 736; bayY += 16) {
            for (bayX = 80; bayX < (80 + (xMax * 16)); bayX += 16) {
                this.BigOcean.create(bayX, bayY, "ocean");
            }
            xMax -= 1;
        }
*/
        console.log("out of ocean 1 creation");

        /* *********************************************************************
         * *********** Main Map Setup ******************************************* 
         * *********************************************************************/
        this.theJungle = this.physics.add.staticGroup();

        for (i = 250; i < 1016; i += 64) {
            console.log("in first i loop for jungle line");
            for (j = 0; j < 75; j += 45) {
                this.theJungle.create(i, j, "jungleTrees");
            }// end for j
        }// end for i

        let maxTiles = 13;
        let tiles = 0;
        let maxRows = 4;
        let jRows = 0;
        let xStart = 280;
        i = xStart;
        j = 86;

        // from top to bay approach
        while (jRows < maxRows) {
            console.log("while top to bay loop");
            while (tiles <= maxTiles) {
                console.log("while tiles loop");
                this.theJungle.create(i, j, "jungleTrees");
                i += 64;
                tiles += 1;
            }// end while tiles
            tiles = 0;
            xStart += 40;
            i = xStart;
            j += 45;
            jRows += 1;
        }// end while j


        // Bay Approach
        maxTiles = 4;
        tiles = 0;
        maxRows = 2;
        jRows = 0;
        xStart = 440;
        i = xStart;
        j = 266;

        
        while (jRows < maxRows) {
            console.log("while top to bay loop");
            while (tiles <= maxTiles) {
                console.log("while tiles loop");
                this.theJungle.create(i, j, "jungleTrees");
                i += 64;
                tiles += 1;
            }// end while tiles
            tiles = 0;
            xStart += 40;
            i = xStart;
            j += 45;
            jRows += 1;
        }// end while j


        //wide around top of bay
        maxTiles = 2;
        xStart = 520;
        i = xStart;
        j = 355;
        tiles = 0;
        maxRows = 3;
        jRows = 0;
        
        while (jRows < maxRows) {
            console.log("while JRows loop");
            while (tiles <= maxTiles) {
                console.log("while tiles loop");
                this.theJungle.create(i, j, "jungleTrees");
                i += 64;
                tiles += 1;
            }// end while tiles
            tiles = 0;
            xStart += 40;
            i = xStart;
            j += 45;
            jRows += 1;
        }// end while j


        // along the bay
        maxTiles = 1;
        xStart = 640;
        i = xStart;
        j = 490;
        tiles = 0;
        maxRows = 3;
        jRows = 0;

        while (jRows < maxRows) {
            console.log("while JRows loop");
            while (tiles <= maxTiles) {
                console.log("while tiles loop");
                this.theJungle.create(i, j, "jungleTrees");
                i += 64;
                tiles += 1;
            }// end while tiles
            tiles = 0;
            xStart += 0;
            i = xStart;
            j += 45;
            jRows += 1;
        }// end while j


        // break
        maxTiles = 1;
        xStart = 640;
        i = xStart;
        j = 700;
        tiles = 0;
        maxRows = 2;
        jRows = 0;

        while (jRows < maxRows) {
            console.log("while JRows loop");
            while (tiles <= maxTiles) {
                console.log("while tiles loop");
                this.theJungle.create(i, j, "jungleTrees");
                i += 64;
                tiles += 1;
            }// end while tiles
            tiles = 0;
            xStart += 0;
            i = xStart;
            j += 45;
            jRows += 1;
        }// end while j



        // along the bottom with a break..

        xStart = 765;
        let yStart = 710;
        i = xStart;
        j = yStart;
        tiles = 0;
        maxTiles = 4;
        maxRows = 2;
        jRows = 0;
        

        while (jRows < maxRows) {
            console.log("while JRows loop");
            while (tiles <= maxTiles) {
                console.log("while tiles loop");
                this.theJungle.create(i, j, "jungleTrees");
                i += 64;
                tiles += 1;
            }// end while tiles
            tiles = 0;
            xStart += 0;
            i = xStart;
            j += 45;
            jRows += 1;
        }// end while j



        /* *********************************************************************
         * *********** Set Up Player ******************************************* 
         * *********************************************************************/

        // get player start position data from data manager:
        //this.registry.events.on('changedata', this.getStartPosition, this);

        // The player and its settings
        this.player = this.physics.add.sprite(this.startX, this.startY, "dude");

        //  Player physics properties. Give the little guy a slight bounce.
        //this.player.setBounce(0.15);
        this.player.setCollideWorldBounds(true);


        // ######################################
        // NOTE:  
        // Our dude sprite sheet is 0 - 12 sprites wide over all.so
        // that means row 1 is 0 -12 for a total of 13 POSSIBLE slots.
        // However, we only have 7 in row 1 so slots 7-12 are empty.
        // row 2 starts on slot 13, etc. 
        // ##########################################

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

        //  Input Events
        this.cursors = this.input.keyboard.createCursorKeys();


        // Piggy scattered in some good areas for now
        this.boars = this.physics.add.group({
            key: "boar",
            repeat: 6,
            setXY: { x: 150, y: 0, stepX: 150, stepY: 150 }
        });

        // no speed now. will give random speed and direction in update
        this.boars.children.iterate(function (child) {
            //  Give each boar a speed to the left and bounded by world 
            //child.setVelocityX(-10);
            child.setCollideWorldBounds(true);
        });


        //  The score
        //this.scoreText = this.add.text(16, 16, myItem, { fontSize: "32px", fill: "#000" });

        // adds header
        this.goldText = this.add.text(20, 10, "Gold: " + this.gold, { fontsize: "32px", fill: "#000", align: "center" });
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
        this.physics.add.collider(this.player, this.theJungle);
        this.physics.add.collider(this.boars, this.BigOcean);
        this.physics.add.collider(this.boars, this.theJungle);

        // collide boars with each other.
        this.physics.add.collider(this.boars, this.boars);

        //  Checks to see if the player overlaps with any of the boars, if he does call the boarCombat function
        this.physics.add.overlap(this.player, this.boars, this.boarPlayerCombat, null, this);


        /* ************************************************************
         * ***************** Launch Section ***************************
         * ************************************************************ */

        // launch the other shipwrecked scenes so they are able to get the registry data when needed.
        this.scene.launch("Shipwrecked2");
        this.scene.launch("Shipwrecked3");
        this.scene.launch("Shipwrecked4");


        /********************************************************
         * ******  Current Status... *****************************
         * *****  Can put the scenes to sleep here, but they get set to awake
         * by the system somehow.  Thus their updates keep happening.  
         * The isSleeping call I put into the update functions is NOT triggering.
         * put in a global to short circuit the update and it seems to work.
         * **************************************************************** */
        // note, data shows sleeping is not stopping update... neither is pause....
        // put them to sleep.
        this.scene.sleep("Shipwrecked2");
        this.scene.sleep("Shipwrecked3");
        this.scene.sleep("Shipwrecked4");

        sleep2 = true;
        sleep3 = true;
        sleep4 = true;


        // and not visible
        this.scene.setVisible(false, "Shipwrecked2");
        this.scene.setVisible(false, "Shipwrecked3");
        this.scene.setVisible(false, "Shipwrecked4");


        // bring our first one up for input and display.
        this.scene.bringToTop("Shipwrecked");
        this.scene.setActive(true, "Shipwrecked");
        this.scene.setVisible(true, "Shipwrecked");

        console.log("checking sleep status");
        console.log("2: " + this.scene.isSleeping("Shipwrecked2"));
        console.log("3: " + this.scene.isSleeping("Shipwrecked2"));
        console.log("4: " + this.scene.isSleeping("Shipwrecked2"));

    }// end create


    // ---------------------------------------------------------
    // update()
    //
    // Description: main update function for scene.  Handles 
    // player movement and end of map event at this level.  
    // Std functionality handles most everything else.
    // -----------------------------------------------------------
    update() {
        //console.log("in update");
        if (this.gameOver) {
            console.log("game is over??");
            return;
        }

        //if (this.scene.isSleeping("Shipwrecked")) {
        //    return;
        //}

        if (sleep1) {
            return;
        }


        // move boars around randomly every maxBoarRun count.:
        if (this.boarRunTime > this.maxBoarRun) {

            this.boars.children.iterate(function (child) {
                //  Give each boar a speed to the left and bounded by world 
                child.setVelocityX(-40 + (Math.random() * 80));
                child.setVelocityY(-40 + (Math.random() * 80));
            });
            this.boarRunTime = 0;
        }
        else {
            this.boarRunTime += 1;
        }
        

        // player movement
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


        // Health Heart display update:
        //checks if 50% health
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
            console.log("in transition from 1 to 2. x and y set to: " + playerStartX + ", " + playerStartY);

            this.scene.wake("Shipwrecked2");
            this.scene.bringToTop("Shipwrecked2");
            this.scene.setActive(true, "Shipwrecked2");
            this.scene.setVisible(true, "Shipwrecked2");
            sleep2 = false;

            this.scene.setActive(false, "Shipwrecked");
            this.scene.setVisible(false, "Shipwrecked");
            this.scene.sleep("Shipwrecked");
            sleep1 = true;
        } // now Right side:
        else if (this.player.x >= 983) {
            playerStartX = 25;
            playerStartY = this.player.y;
            console.log("in transition from 1 to 4. x and y set to: " + playerStartX + ", " + playerStartY);
            this.scene.wake("Shipwrecked4");
            this.scene.bringToTop("Shipwrecked4");
            this.scene.setActive(true, "Shipwrecked4");
            this.scene.setVisible(true, "Shipwrecked4");
            sleep4 = false;

            //this.scene.wake("Shipwrecked4", { y: this.player.y, x: 25 });
            //this.registry.set('playerStartX', 25);
            //this.registry.set('playerStartY', this.player.y);

            this.scene.setActive(false, "Shipwrecked");
            this.scene.setVisible(false, "Shipwrecked");
            this.scene.sleep("Shipwrecked");
            sleep1 = true;
        }// end else if
        // left is ocean, bottom is ocean so don't need them.

    }// end update



    //--------------------------------------------------------------
    //getStartPosition(parent, key, data)
    //
    // Description:  changedata handler: gets start position from registry.
    // data is set by previous scene on scene transition.
    // --------------------------------------------------------------
    //getStartPosition(parent, key, data) {
    //    if (key == 'playerStartX') {
    //        this.startX = data;
    //    }
    //    else if (key == 'playerStartY') {
    //        this.startY = data;
    //    }
    //}// end getStartPosition


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
        this.gold++;
        this.goldText.setText("Gold: " + this.gold);


        if (playerLife <= 0) {

            // stop movement on screen
            this.physics.pause();

            // turn player bloody red
            thePlayer.setTint(0xff0000);
            this.playerLifeImg.setTexture("noHealth");

            // force facing
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
        console.log("in Shipwrecked onWake");
        this.player.x = playerStartX;
        this.player.y = playerStartY;
        console.log("Set player position to " + playerStartX + ", " + playerStartY);
    }


} // end class







