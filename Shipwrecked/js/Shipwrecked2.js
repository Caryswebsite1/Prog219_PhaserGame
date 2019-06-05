/* eslint-disable indent */

class Shipwrecked2 extends Phaser.Scene {
    constructor() {
        super({ key: "Shipwrecked2" });

        this.gameOver = false;
        this.score = 0;
        this.startX = 500;
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

        // plugins:
        this.load.plugin('DialogModalPlugin', './js/dialog_plugin.js');
        this.load.plugin('GlobalFunctionsPlugin', './js/GlobalFunctions.js');

        // main images
        this.load.image("bigSand", "assets/island_sand_d.jpg");
        this.load.image("ocean3", "assets/ocean3.png");
        this.load.image("ocean4", "assets/ocean4.png");
        this.load.image("jungleTrees", "assets/JungleOK64.png");
        this.load.image("TreeImg", "assets/Jungle-Tree6450.png");
        this.load.image("greenGround", "assets/greenGroundMap2.png");
        this.load.image("boar", "assets/boarhit.png");
        this.load.spritesheet("sheepImg", "assets/sheep_eat32.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("dude", "assets/universal-lpc-sprite_male_01_32pix.png", { frameWidth: 32, frameHeight: 32 });


        // status icons will be on top of anything else.
        this.load.image("singleHeart", "assets/singleHeart16.png");
        this.load.image("blankHeart", "assets/blankHeart16.png");

    }// end preload





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
        console.log("from 4")
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

        // loop variables
        let i = 0;
        let j = 0;

        //NOTE: add in order from bottom layer to top.

        // to only add an image someplace, you would say:
        this.add.image(500, 500, "bigSand");

        // add the green ground.
        this.add.image(700, 650, "greenGround");


        this.BigOcean = this.physics.add.staticGroup();
        this.BigOcean.create(570, 65, "ocean3");
        this.BigOcean.create(60, 500, "ocean4");
        console.log("out of ocean 2 creation");



        // ********* Jungle ******************
        this.theJungle = this.physics.add.staticGroup();


        // from top line variance
        let newChild = "";
        let maxTiles = 3;
        let tiles = 0;
        let maxRows = 1;
        let jRows = 0;
        let xStart = 400;
        i = xStart;
        j = 215;


        while (jRows < maxRows) {
            console.log("while top jungle map 2 loop");
            while (tiles <= maxTiles) {
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



        // from top left to edge of map
        newChild = "";
        maxTiles = 11;
        tiles = 0;
        maxRows = 2;
        jRows = 0;
        xStart = 250;
        i = xStart;
        j = 260;


        while (jRows < maxRows) {
            console.log("while top jungle map 2 loop");
            while (tiles <= maxTiles) {
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



        // 3rd row top left to middle of map
        newChild = "";
        maxTiles = 5;
        tiles = 0;
        maxRows = 1;
        jRows = 0;
        xStart = 250;
        i = xStart;
        j = 350;


        while (jRows < maxRows) {
            console.log("while top jungle map 2 loop");
            while (tiles <= maxTiles) {
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



        // 3rd row top middle to right edge of map
        newChild = "";
        maxTiles = 4;
        tiles = 0;
        maxRows = 1;
        jRows = 0;
        xStart = 740;
        i = xStart;
        j = 350;


        while (jRows < maxRows) {
            console.log("while top jungle map 2 loop");
            while (tiles <= maxTiles) {
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



        // from Top left down beach to bottom, varied a bit.
        newChild = "";
        maxTiles = 2;
        tiles = 0;
        maxRows = 13;
        jRows = 0;
        xStart = 250;
        i = xStart;
        j = 405;

        while (jRows < maxRows) {
            console.log("while left edge jungle map 2 loop");
            // jig start of row a bit.
            if (jRows === 0 || jRows === 1 || jRows === 4 || jRows === 8 || jRows === 10) {
                i += 25;
            }
            while (tiles <= maxTiles) {
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



        // top right down right side with some variance.
        maxTiles = 1;
        tiles = 0;
        maxRows = 13;
        jRows = 0;
        xStart = 936;
        i = xStart;
        j = 405;

        while (jRows < maxRows) {
            console.log("while right side jungle map 2 loop");
            while (tiles <= maxTiles) {
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



        // bottom left accross to right.
        maxTiles = 7;
        tiles = 0;
        maxRows = 3;
        jRows = 0;
        xStart = 442;
        i = xStart;
        j = 865;

        while (jRows < maxRows) {
            console.log("while bottom jungle map2  loop");
            while (tiles <= maxTiles) {
                newChild = this.theJungle.create(i, j, "jungleTrees");
                newChild.name = "jungle";
                i += 64;
                tiles += 1;
                // skip a few on first row for variance
                if (jRows === 0 && tiles === 1) {
                    tiles = 5;
                    i += 256;
                }
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
         * *********** Set Up Player ******************************************* 
         * *********************************************************************/

        // get player start position data from data manager:
        //this.registry.events.on('changedata', this.getStartPosition, this);

        // The player and its settings
        this.player = this.physics.add.sprite(this.startX, this.startY, "dude");

        //  Player physics properties. Give the little guy a slight bounce.
        // this.player.setBounce(0.15);

        // set camera to follow player:
        this.cameras.main.startFollow(this.player);



        //########################################################
        // NOTE: CANT do another anims for the player here.  It 
        // is already defined in the first scene and persists for
        // the whole game area.
        //#########################################################


        /* **************************************************************
         * ********* Input Events, Other Events Etc. ********************
         * *************************************************************** */

        //  Input Events
        this.cursors = this.input.keyboard.createCursorKeys();

        // note: gameobjectdown handler should be in global plug in now.
        this.input.on('gameobjectdown', this.sys.globalFunctions.onGameObjectClicked, this);


        /* **************************************************************
         * ********* Roaming Animals *************************************
         * *************************************************************** */

        // Piggy scattered around
        this.boars = this.physics.add.group({
            key: "boar",
            repeat: 8,
            setXY: { x: 200, y: 200, stepX: 75, stepY: 75 }
        });

        // no speed now. will give random speed and direction in update



        //Sheep: try to restrict to green grass.
        this.sheepHerd = this.physics.add.group();
        for (j = 450; j < 760; j += 80) {
            for (i = 450; i <= 700; i += 80) {
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

        console.log("sheep made Map 2.  Herd: " + this.sheepHerd);


        // Grove of trees for wood.. Protected by boars....
        this.woodTrees = this.physics.add.staticGroup();

        maxTiles = 6;
        tiles = 0;
        maxRows = 9;
        jRows = 0;
        xStart = 452;
        i = xStart;
        j = 420;

        let rand = 0;
        let newTree = "";

        while (jRows < maxRows) {
            console.log("while map2 wood Tree  loop");
            while (tiles <= maxTiles) {
                rand = Math.floor(Math.random() * 4);
                // randomize x placement some.
                i += 10 + (32 * rand);
                newTree = this.woodTrees.create(i, j, "TreeImg");
                newTree.name = "tree";
                tiles += 1;
                if (i >= 800) {
                    // reached the end of max row length.
                    tiles = maxTiles + 1;
                }
            } // end while tiles

            tiles = 0;
            i = xStart;

            // shift starting x placement slightly for these rows
            if (jRows === 1 || jRows === 3)
                i += 20;
            j += 45;
            jRows += 1;
        } // end while j


        // make the trees interactive: 
        this.woodTrees.children.iterate(
            function (child) {
                child.setInteractive();
            }
        );



        /* *****************************************************************************************
         * *********************  Header and Hearts ************************************************
         * ***************************************************************************************** */

        this.sys.globalFunctions.goldTextFunction();

        this.sys.globalFunctions.woodTextFunction();

        this.sys.globalFunctions.ironTextFunction();

        this.sys.globalFunctions.woolTextFunction();

        this.sys.globalFunctions.foodTextFunction();

        /* **************************************************************
         * ********* Life heart bar  ******************************
         * *************************************************************** */
        console.log("in map 2 create, life is: " + playerLife);
        this.sys.globalFunctions.updateHearts();


        /* ************************************************************
         * ************** Colliders Section ***************************
         * ************************************************************ */

        this.player.setCollideWorldBounds(true);

        this.boars.children.iterate(function (child) {
            child.setCollideWorldBounds(true);
        });

        this.sheepHerd.children.iterate(function (child) {
            child.setCollideWorldBounds(true);
        });


        //  Collide the everything for the most part.  
        this.physics.add.collider(this.player, this.BigOcean);
        //this.physics.add.collider(this.player, this.Volcano);
        this.physics.add.collider(this.player, this.theJungle);
        this.physics.add.collider(this.player, this.woodTrees);
        this.physics.add.collider(this.boars, this.BigOcean);
        //this.physics.add.collider(this.boars, this.Volcano);
        this.physics.add.collider(this.boars, this.theJungle);
        this.physics.add.collider(this.sheepHerd, this.BigOcean);
        //this.physics.add.collider(this.sheepHerd, this.Volcano);
        this.physics.add.collider(this.sheepHerd, this.theJungle);


        // collide boars and sheep with each other.
        this.physics.add.collider(this.boars, this.boars);
        this.physics.add.collider(this.sheepHerd, this.boars);
        this.physics.add.collider(this.sheepHerd, this.sheepHerd);

        //  Checks to see if the player overlaps with any of the boars, if he does call the boarCombat function
        this.physics.add.overlap(this.player, this.boars, this.sys.globalFunctions.boarPlayerCombat, null, this);


        // check for tools:
        //this.physics.add.overlap(this.player, this.Axe, this.getAxe, null, this);


        /* ************************************************************
         * ***************** Dialog Box Section ***********************
         * ************************************************************ */

        // Dialog box:
        this.dialogBox = this.sys.dialogModal;
        this.dialogBox.init({ windowHeight: 60, windowWidth: 450, locationX: 20, locationY: 320 });
        this.dialogBox.setText("howdy fellow from shipreck 2");


    } // end create


    // ---------------------------------------------------------
    // update()
    //
    // Description: main update function for scene.  Handles 
    // player movement and end of map event at this level.  
    // Std functionality handles most everything else.
    // -----------------------------------------------------------
    update() {
        //console.log("in update 2");
        if (this.gameOver) {
            console.log("game is over??");
            return;
        }

        //if (this.scene.isSleeping("Shipwrecked2")) {
        //    return;
        //}

        if (sleep2) {
            return;
        }

        //console.log("Doing update 2");


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



        // player movement:

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



        /* ***************************************************
         * Check for edge of map to switch maps!
         * 
         * Be sure to place player on new map OUTSIDE of check zone.
         * *************************************************** */

        // bottom
        if (this.player.y >= 983) {
            playerStartX = this.player.x;
            playerStartY = 25;
            console.log("in transition from 2 to 1. x and y set to: " + playerStartX + ", " + playerStartY);
            this.scene.wake("Shipwrecked");
            this.scene.bringToTop("Shipwrecked");
            this.scene.setActive(true, "Shipwrecked");
            this.scene.setVisible(true, "Shipwrecked");
            sleep1 = false;

            this.scene.setActive(false, "Shipwrecked2");
            this.scene.setVisible(false, "Shipwrecked2");
            this.scene.sleep("Shipwrecked2");
            sleep2 = true;
        } // now Right side:
        else if (this.player.x >= 983) {
            playerStartX = 25;
            playerStartY = this.player.y;
            console.log("in transition from 2 to 3. x and y set to: " + playerStartX + ", " + playerStartY);
            this.scene.wake("Shipwrecked3");
            this.scene.bringToTop("Shipwrecked3");
            this.scene.setActive(true, "Shipwrecked3");
            this.scene.setVisible(true, "Shipwrecked3");
            sleep3 = false;

            this.scene.setActive(false, "Shipwrecked2");
            this.scene.setVisible(false, "Shipwrecked2");
            this.scene.sleep("Shipwrecked2");
            sleep2 = true;
        }// end else if
        // left is ocean, top is ocean so don't need them.

    }// end update


    // ---------------------------------------------------------
    // setSleepFlag(bool)
    //
    // Description: sets our scene sleep flag to true (sleeping) or 
    // false (awake.)
    // -----------------------------------------------------------
    setSleepFlag(bSleep) {
        sleep2 = bSleep;
    }



    // ---------------------------------------------------------
    // onWake()
    //
    // Description: Handler for when scene wakes.  Sets the current
    // player position based on where they left the previous map
    // to provide consistency.  Std handler does everything else.
    // -----------------------------------------------------------
    onWake() {
        console.log("in Shipwrecked 2 onWake");
        this.player.x = playerStartX;
        this.player.y = playerStartY;
        console.log("Set player position to " + playerStartX + ", " + playerStartY);

        // update life and resource displays.
        this.sys.globalFunctions.updateHearts();
        this.sys.globalFunctions.updateResourceDisplay();

    }


} // end class Shipwrecked 2
