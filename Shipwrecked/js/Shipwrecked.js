/* eslint-disable indent */

class Shipwrecked extends Phaser.Scene {
    constructor() {
        super({ key: "Shipwrecked" });

        this.gameOver = false;
        this.score = 0;
        this.startX = 350;
        this.startY = 400;
        this.boarRunTime = 150; // so we get one movement set right away.
        this.maxBoarRun = 150;
        this.sheepEatTime = 400; // so we get one movement set right away.
        this.maxSheepEat = 400;
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

        // plugins
        this.load.plugin('DialogModalPlugin', './js/dialog_plugin.js');

        // main images
        this.load.image("bigSand", "assets/island_sand_d.jpg");
        this.load.image("ocean1", "assets/ocean4.png");
        this.load.image("ocean2", "assets/ocean2.png");
        this.load.image("greenGround", "assets/greenGround.png");
        this.load.image("jungleTrees", "assets/JungleOK64.png");
        this.load.image("macheteImg", "assets/machete16A.png");
        this.load.image("hcTree", "assets/horse-chestnut-tree_16.png");
        this.load.image("TreeImg", "assets/Jungle-Tree6450.png");
        this.load.image("boar", "assets/boarhit.png");
        this.load.spritesheet("sheepImg", "assets/sheep_eat32.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("dude", "assets/universal-lpc-sprite_male_01_32pix.png", { frameWidth: 32, frameHeight: 32 });


        // status icons will be on top of anything else.
        this.load.image("singleHeart", "assets/singleHeart16.png");
        this.load.image("blankHeart", "assets/blankHeart16.png");

    } // end preload


    // ---------------------------------------------------------
    // create()
    //
    // Description: main create function for scene.  Handles 
    // initial creation of all scene objects and player sprite.
    // Sets interaction types etc.
    // -----------------------------------------------------------
    create() {

        // General Create:
        this.events.on('wake', this.onWake, this);

        // Camera: set bounds to whole world size.
        this.cameras.main.setBounds(0, 0, 1000, 1000);

        // set actual camera width and height for what we see.
        this.cameras.main.setSize(800, 600);


        // only for test..
        this.score = 6;

        // loop variables
        let i = 0;
        let j = 0;


        // to only add an image someplace, you would say:
        this.add.image(500, 500, "bigSand");
        this.add.image(615, 370, "greenGround");

        //  add ocean as a static but we will set it up as a collider later.
        this.BigOcean = this.physics.add.staticGroup();
        this.BigOcean.create(500, 970, "ocean2");
        this.BigOcean.create(70, 500, "ocean1");

        console.log("out of ocean 1 creation");


        /* *********************************************************************
         * *********** Main Map Setup ******************************************* 
         * *********************************************************************/

        // Jungle:
        this.theJungle = this.physics.add.staticGroup();

        let newChild = "";

        for (i = 250; i < 1016; i += 64) {
            console.log("in first i loop for jungle line");
            for (j = 0; j < 75; j += 45) {
                newChild = this.theJungle.create(i, j, "jungleTrees");
                newChild.name = "jungle";

            } // end for j
        } // end for i

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
                newChild = this.theJungle.create(i, j, "jungleTrees");
                newChild.name = "jungle";
                i += 64;
                tiles += 1;
            } // end while tiles
            tiles = 0;
            xStart += 40;
            i = xStart;
            j += 45;
            jRows += 1;
        } // end while j


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
                newChild = this.theJungle.create(i, j, "jungleTrees");
                newChild.name = "jungle";
                i += 64;
                tiles += 1;
            } // end while tiles
            tiles = 0;
            xStart += 40;
            i = xStart;
            j += 45;
            jRows += 1;
        } // end while j


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
                newChild = this.theJungle.create(i, j, "jungleTrees");
                newChild.name = "jungle";
                i += 64;
                tiles += 1;
            } // end while tiles
            tiles = 0;
            xStart += 40;
            i = xStart;
            j += 45;
            jRows += 1;
        } // end while j


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
                newChild = this.theJungle.create(i, j, "jungleTrees");
                newChild.name = "jungle";
                i += 64;
                tiles += 1;
            } // end while tiles
            tiles = 0;
            xStart += 0;
            i = xStart;
            j += 45;
            jRows += 1;
        } // end while j


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
                newChild = this.theJungle.create(i, j, "jungleTrees");
                newChild.name = "jungle";
                i += 64;
                tiles += 1;
            } // end while tiles
            tiles = 0;
            xStart += 0;
            i = xStart;
            j += 45;
            jRows += 1;
        } // end while j



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
                newChild = this.theJungle.create(i, j, "jungleTrees");
                newChild.name = "jungle";
                i += 64;
                tiles += 1;
            } // end while tiles
            tiles = 0;
            xStart += 0;
            i = xStart;
            j += 45;
            jRows += 1;
        } // end while j

        //----------------------------------------------------------------------
        // set the jungle to be interactive 
        //
        // NOTE: can't do onclick handler because we loose the scene version of "this"
        // so in the handler "this" is the game object and we need to access the player's
        // location.  We could do it that way if the player was a game global and not
        // a scene object.
        //----------------------------------------------------------------------
        this.theJungle.children.iterate(
            function (child) {
                child.setInteractive();
            }
        );



        /* *********************************************************************
         * *********** Add tools etc. ****************************************** 
         * *********************************************************************/
        this.machete = this.physics.add.group({
            key: "macheteImg",
            repeat: 0,
            setXY: { x: 750, y: 650 }
        });


        /* *********************************************************************
         * *********** Set Up Player ******************************************* 
         * *********************************************************************/

        // get player start position data from data manager:
        //this.registry.events.on('changedata', this.getStartPosition, this);

        // The player and its settings
        this.player = this.physics.add.sprite(this.startX, this.startY, "dude");

        //  Player physics properties. Give the little guy a slight bounce.
        //this.player.setBounce(0.15);



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


        /* **************************************************************
         * ********* Input Events, Other Events Etc. ********************
         * *************************************************************** */

        //  Input Events
        this.cursors = this.input.keyboard.createCursorKeys();

        this.input.on('gameobjectdown', this.onGameObjectClicked, this);

        /* **************************************************************
         * ********* Roaming Animals *************************************
         * *************************************************************** */

        // Piggy scattered around
        this.boars = this.physics.add.group({
            key: "boar",
            repeat: 6,
            setXY: { x: 150, y: 50, stepX: 150, stepY: 150 }
        });

        // no speed now. will give random speed and direction in update


         // Sheep: try to restrict to green grass.
        let newSheep = "";
        this.sheepHerd = this.physics.add.group();
        for (j = 280; j <= 600; j += 60) {
            for (i = 800; i < 965; i += 50) {
                newChild = this.sheepHerd.create(i, j, "sheepImg");
                newChild.name = "sheep";
            }// end i
        }// end j

        // make the sheep interactive: 
        this.sheepHerd.children.iterate(
            function (child) {
                child.setInteractive();
            }
        );

        console.log("sheep made.  Herd: " + this.sheepHerd);


        this.anims.create({
            key: "sheepLeft",
            frames: this.anims.generateFrameNumbers("sheepImg", { start: 0, end: 3 }),
            frameRate: 2,
            repeate: -1
        });

        this.anims.create({
            key: "sheepRight",
            frames: this.anims.generateFrameNumbers("sheepImg", { start: 4, end: 8 }),
            frameRate: 2,
            repeate: -1
        });

        //this.anims.create({
        //    key: "sheepStand",
        //    frames: [{ key: "sheepImg", frame: 2 }],
        //    frameRate: 2,
        //    repeate: -1
        //});

        // a few trees with the sheep.
        let newTree = "";
        this.sheepTrees = this.physics.add.staticGroup();

        // only 3 trees so hardcoding location:
        // 1:
        newTree = this.sheepTrees.create(840, 320, "TreeImg");
        newTree.name = "tree";
        // 2:
        newTree = this.sheepTrees.create(900, 460, "TreeImg");
        newTree.name = "tree";
        // 3:
        newTree = this.sheepTrees.create(800, 600, "TreeImg");
        newTree.name = "tree";

        // make the trees interactive: 
        this.sheepTrees.children.iterate(
            function (child) {
                child.setInteractive();
            }
        );


        //  The score
        //this.scoreText = this.add.text(16, 16, myItem, { fontSize: "32px", fill: "#000" });

        // adds header
        this.goldText = this.add.text(20, 10, "Gold: " + Gold, { fontsize: "32px", strokeThickness: 1, stroke: "#fe0", fill: "#fe0", shadowStroke: true, shadowFill: true, shadowColor: "#000", shadowOffsetX: 1, shadowOffsetY: 1, align: "center" });
        this.goldText.setScrollFactor(0);

        this.woodText = this.add.text(100, 10, "Wood: " + Wood, { fontsize: "32px", strokeThickness: 1, stroke: "#fe0", fill: "#fe0", align: "center" });
        this.woodText.setScrollFactor(0);

        this.ironText = this.add.text(180, 10, "Iron: " + Iron, { fontsize: "32px", strokeThickness: 1, stroke: "#fe0", fill: "#fe0", align: "center" });
        this.ironText.setScrollFactor(0);

        this.woolText = this.add.text(260, 10, "Wool: " + Wool, { fontsize: "32px", strokeThickness: 1, stroke: "#fe0", fill: "#fe0", align: "center" });
        this.woolText.setScrollFactor(0);

        this.foodText = this.add.text(340, 10, "Food: " + Food, { fontsize: "32px", strokeThickness: 1, stroke: "#fe0", fill: "#fe0", align: "center" });
        this.foodText.setScrollFactor(0);

        /* **************************************************************
         * ********* Life heart bar test ******************************
         * *************************************************************** */
        for (i = 0; i < 10; i++) {

            hearts[i] = this.add.image((20 + (i * 18)), 50, 'singleHeart');
            hearts[i].setScrollFactor(0);
        }


        //plugins

        // Dialog box:
        this.sys.install('DialogModalPlugin');
        console.log(this.sys.dialogModal);

        //this.dialogBox = this.add.text(200, 200, this.sys.dialogModal.init());
        this.dialogBox = this.sys.dialogModal;
        this.dialogBox.init({windowHeight: 100, windowWidth: 500, locationX: 20, locationY: 490 });

        console.log(this.dialogBox);

        // set scrollFactor so it scrolls with the camera (1). a (0) keeps in place.
        //this.dialogBox.graphics.scrollFactorX(1);
        //this.dialogBox.scrollFactorY(1);
        //End dialog box stuff


        /* ************************************************************
         * ************** Colliders Section ***************************
         * ************************************************************ */

        // collide with world:
        this.player.setCollideWorldBounds(true);

        this.boars.children.iterate(function (child) {
            child.setCollideWorldBounds(true);
        });

        this.sheepHerd.children.iterate(function (child) {
            child.setCollideWorldBounds(true);
        });

        this.sheepTrees.children.iterate(function (child) {
            child.setCollideWorldBounds(true);
        });

        //  Collide the everything for the most part.  
        this.physics.add.collider(this.player, this.BigOcean);
        this.physics.add.collider(this.player, this.theJungle);
        this.physics.add.collider(this.player, this.sheepTrees);
        this.physics.add.collider(this.boars, this.BigOcean);
        this.physics.add.collider(this.boars, this.theJungle);
        this.physics.add.collider(this.sheepHerd, this.BigOcean);
        this.physics.add.collider(this.sheepHerd, this.theJungle);

        
        // collide boars and sheep with each other.
        this.physics.add.collider(this.boars, this.boars);
        this.physics.add.collider(this.sheepHerd, this.boars);
        this.physics.add.collider(this.sheepHerd, this.sheepHerd);

        //  Checks to see if the player overlaps with any of the boars, if he does call the boarCombat function
        this.physics.add.overlap(this.player, this.boars, this.boarPlayerCombat, null, this);


        
        // check for tools:
        this.physics.add.overlap(this.player, this.machete, this.getMachete, null, this);



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

    } // end create


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
        } else {
            this.boarRunTime += 1;
        }



        // Sheep movement: 
        if (this.sheepEatTime > this.maxSheepEat) {

            // make as random as posible but not very changing.
           // this.sheepHerd.forEach((child) => {
            this.sheepHerd.children.iterate(function (child) {
                if (Math.random() > 0.5) {
                    // 25% chance to change.
                    // 50% change for either facing direction.
                    if (Math.random() > 0.5) {
                        child.anims.play("sheepLeft", true);
                    }
                    else {
                        child.anims.play("sheepRight", true);
                    }
                    //  Give each sheep a very very slow speed  
                    child.setVelocityX(-2 + (Math.random() * 4));
                    child.setVelocityY(-2 + (Math.random() * 4));
                }// end if changing
               
            }); // end for each

            this.sheepEatTime = 0;
        }
        else {
            this.sheepEatTime += 1;
        }// end sheep update


        // player movement
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-100);
            this.player.anims.play("left", true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(100);
            this.player.anims.play("right", true);
        } else if (this.cursors.up.isDown) {
            this.player.setVelocityY(-100);
            this.player.anims.play("back", true);
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(100);
            this.player.anims.play("front", true);
        } else {
            this.player.setVelocityX(0);
            this.player.setVelocityY(0);
            this.player.anims.play("turn");
        }


        // Health Heart display update:
        //checks if 50% health
        //if (playerLife === 5) {
           // this.playerLifeImg.setTexture("heart1");
        //}


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
        } // end else if
        // left is ocean, bottom is ocean so don't need them.

    } // end update


    /* ********************************************************************************
     * ********************************************************************************
     * *******************  Other functions *******************************************
     * ********************************************************************************
     * ******************************************************************************** */


    //--------------------------------------------------------------
    // onGameObjectClicked(pointer, gameObject)
    //
    // Description:  A call back.  Called when any interactive object is clicked...
    // 
    // --------------------------------------------------------------
    onGameObjectClicked(pointer, gameObject) {
        console.log("made it into New onGameObjectClicked. ");

        switch (gameObject.name) {
            case "jungle":

                if (!playerInventory.includes("Machete")) {
                    if (
                        (Math.abs((this.player.x - gameObject.x)) <= 50) &&
                        (Math.abs((this.player.y - gameObject.y)) <= 50)
                    ) {

                        this.dialogBox.setText("Sure wish I had a Machete!");
                        console.log("Sure wish I had a Machete!");
                    }
                    else {
                        this.dialogBox.setText("I am too far away from that to do anything.");
                    }
                }
                else {
                    console.log("in else, Check to see if close enough!");

                    console.log("player x: " + this.player.x + "  player y: " + this.player.y);
                    console.log("jungle x: " + gameObject.x + "  jungle y: " + gameObject.y);
                    // if player close to jungle piece then destroy it (chopped!).
                    if (
                        (Math.abs((this.player.x - gameObject.x)) <= 50) &&
                        (Math.abs((this.player.y - gameObject.y)) <= 50)
                    ) {
                        // close enough to chop!
                        //############### NEED A CHOPPING SOUND HERE #################
                        this.dialogBox.setText("CHOP! CHOP!");

                        gameObject.disableBody(true, true);
                        console.log("chopping jungle yet to be fully implemented.");
                    }
                    else {
                        this.dialogBox.setText("I am too far away from that to do anything.");
                        console.log("NOPE NOT close enough!");
                    }

                }// end else


                break; // end jungle


            case "sheep":

                if (!playerInventory.includes("Machete")) {
                    if (
                        (Math.abs((this.player.x - gameObject.x)) <= 16) &&
                        (Math.abs((this.player.y - gameObject.y)) <= 16)
                    ) {

                        this.dialogBox.setText("I can't sheer these sheep with my bare hands!");
                        console.log("can't sheer these sheep with bare hands");
                    }
                    else {
                        this.dialogBox.setText("I am too far away from that to do anything."); 
                    }
                }
                else {
                    console.log("in else for sheep, Check to see if close enough!");

                    console.log("player x: " + this.player.x + "  player y: " + this.player.y);
                    console.log("sheep x: " + gameObject.x + "  sheep y: " + gameObject.y);
                    // if player close to sheep piece then destroy it (chopped!).
                    if (
                        (Math.abs((this.player.x - gameObject.x)) <= 16) &&
                        (Math.abs((this.player.y - gameObject.y)) <= 16)
                    ) {
                        // close enough to chop!
                        //############### NEED A sheep dieing SOUND HERE #################
                        this.dialogBox.setText("Baaaaa!  Baaaaa! Baa.");

                        gameObject.disableBody(true, true);

                        // gain resources!
                        Wool++;
                        Food++;
                        this.woolText.setText("Wool: " + Wool);
                        this.foodText.setText("Food: " + Food);

                    }
                    else {
                        this.dialogBox.setText("I am too far away from that to do anything.");
                        console.log("NOPE NOT close enough!");
                    }

                }// end else
                break; // end sheep


            case "tree":

                if (!playerInventory.includes("Axe")) {
                    if (
                        (Math.abs((this.player.x - gameObject.x)) <= 50) &&
                        (Math.abs((this.player.y - gameObject.y)) <= 50)
                    ) {

                        this.dialogBox.setText("I sure wish I had an Axe!");
                        console.log("I sure wish I had an Axe!");
                    }
                    else {
                        this.dialogBox.setText("I am too far away from that to do anything.");
                    }
                }
                else {
                    console.log("in else for trees, Check to see if close enough!");

                    console.log("player x: " + this.player.x + "  player y: " + this.player.y);
                    console.log("tree x: " + gameObject.x + "  tree y: " + gameObject.y);
                    // if player close to sheep piece then destroy it (chopped!).
                    if (
                        (Math.abs((this.player.x - gameObject.x)) <= 50) &&
                        (Math.abs((this.player.y - gameObject.y)) <= 50)
                    ) {
                        // close enough to chop!
                        //############### NEED A sheep dieing SOUND HERE #################
                        this.dialogBox.setText("Chop! Chop! Chop! Tiiiimmmmmbbbbbeeerrrrrr!");

                        gameObject.disableBody(true, true);

                        // gain resources!
                        Wood++;
                        this.woodText.setText("Wood: " + Wood);

                    }
                    else {
                        this.dialogBox.setText("I am too far away from that to do anything.");
                        console.log("NOPE NOT close enough!");
                    }

                }// end else
                break; // end tree

            default:
                break;

        }// end switch


    }// end onGameObjectClicked



    //--------------------------------------------------------------
    // getMachete()
    //
    // Description:  handler for when player runs over machete.
    // puts machete in player's inventory.
    // 
    // --------------------------------------------------------------
    getMachete(thePlayer, theMachete) {
        playerInventory.push("Machete");
        theMachete.disableBody(true, true);

        //############### NEED A MESSAGE TO THE PLAYER HERE #################
        this.dialogBox.setText("At Last! A Machete!");
        console.log(playerInventory);
    }


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

        if (playerInventory.includes("Machete")) {
            playerLife -= 1;
            hearts[playerLife] = this.add.image((20 + (playerLife * 18)), 50, 'blankHeart');
            hearts[playerLife].setScrollFactor(0);
            this.dialogBox.setText("Take that boar!  Ha!");
        }
        else {
            let i = 0;
            if (playerLife <= 5) {
                // all blank now.
                for (i = 0; i < 10; i++) {

                    hearts[i] = this.add.image((20 + (i * 18)), 50, 'blankHeart');
                    hearts[i].setScrollFactor(0);
                }
            }
            else {
                // blank the last 5.
                let index = 0;
                for (i = 0; i < 5; i++) {
                    index = playerLife - i - 1;
                    hearts[index] = this.add.image((20 + (index * 18)), 50, 'blankHeart');
                    hearts[index].setScrollFactor(0);
                    this.dialogBox.setText("Ow! Ow! OW!  That HURT!");
                }
            }// end else

            // now drop life by 5
            playerLife -= 5;
        }// end else no machete 

        
        boar.disableBody(true, true);
        Gold++;
        Food++;
        this.goldText.setText("Gold: " + Gold);
        this.foodText.setText("Food: " + Food);

        if (playerLife <= 0) {

            // stop movement on screen
            this.physics.pause();

            // turn player bloody red
            thePlayer.setTint(0xff0000);
            //this.playerLifeImg.setTexture("noHealth");

            // force facing
            thePlayer.anims.play("turn");

            this.gameOver = true;
            this.dialogBox.setText("Alas! You have died!");

        } // end if playerLife

    } // end boarPlayerCombat


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
