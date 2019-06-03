/* eslint-disable indent */

class Shipwrecked3 extends Phaser.Scene {
    constructor() {
        super({ key: "Shipwrecked3" });

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
        this.load.image("ocean5", "assets/ocean5.png");
        this.load.image("ocean6", "assets/ocean6.png");
        this.load.image("jungleTrees", "assets/JungleOK64.png");
        this.load.image("PickAxeImg", "assets/pickaxe22.png");
        this.load.image("TreeImg", "assets/Jungle-Tree6450.png");
        this.load.image("greenGround", "assets/greenGroundMap3.png");
        this.load.image("VolcanoImg", "assets/VolcanoTopA.png");
        this.load.image("GoldSlope", "assets/GoldFieldA.png");
        this.load.image("Gold1", "assets/Gold1.png");
        this.load.image("Gold2", "assets/Gold2.png");
        this.load.image("Gold3", "assets/Gold3.png");
        this.load.image("Gold4", "assets/Gold4.png");

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
        this.sys.install('DialogModalPlugin');
        console.log(this.sys.dialogModal);


        this.sys.install('GlobalFunctionsPlugin');
        console.log("from 3")
        console.log(this.sys.globalFunctions);

        this.events.on('wake', this.onWake, this);

        // Camera: set bounds to whole world size.
        this.cameras.main.setBounds(0, 0, 1000, 1000);

        // set actual camera width and height for what we see.
        this.cameras.main.setSize(1000, 1000);
        //this.cameras.main.setSize(400, 400);

        // only for test..
       this.score = 6;

        // loop variables
        let i = 0;
        let j = 0;


        /* *********************************************************************
        * *********** Main Map Setup ******************************************* 
        * *********************************************************************/

        //NOTE: add in order from bottom layer to top.

        // to only add an image someplace, you would say:
        this.add.image(500, 500, "bigSand");


        // add the green ground.
        this.add.image(375, 650, "greenGround");


        this.BigOcean = this.physics.add.staticGroup();
        this.BigOcean.create(940, 500, "ocean5");
        this.BigOcean.create(500, 55, "ocean6");
        console.log("out of ocean 3 creation");

        // ************** VOLCANO! ******************
        this.Volcano = this.physics.add.staticGroup();
        this.Volcano.create(940, 820, "VolcanoImg");



        // ****** Gold slope.. *******
        this.add.image(410, 560, "GoldSlope");


        // ******* Gold ore, protected by boars. *******
        // ****** If under Jungle, you have to cut the Jungle down first. *******
        this.GoldOreGroup = this.physics.add.staticGroup();

        let newChild = "";
        let maxTiles = 7;
        let tiles = 0;
        let maxRows = 3;
        let jRows = 0;
        let xStart = 180;
        i = xStart;
        j = 530;
        let rand = 0;

        //// from under treeline at left accross Rocky slope
        while (jRows < maxRows) {
            console.log("while map3 GoldOre loop");
            while (tiles <= maxTiles) {
                rand = Math.floor(Math.random() * 4);

                switch (rand) {
                    case 0:
                        console.log("Gold1");
                        newChild = this.GoldOreGroup.create(i, j, "Gold1");
                        newChild.name = "Gold1";
                        break;
                    case 1:
                        console.log("Gold2");
                        newChild = this.GoldOreGroup.create(i, j, "Gold2");
                        newChild.name = "Gold2";
                        break;
                    case 2:
                        console.log("Gold3");
                        newChild = this.GoldOreGroup.create(i, j, "Gold3");
                        newChild.name = "Gold3";
                        break;
                    case 3:
                        console.log("Gold4");
                        newChild = this.GoldOreGroup.create(i, j, "Gold4");
                        newChild.name = "Gold4";
                        break;

                    default:
                        console.log("Gold default");
                        newChild = this.GoldOreGroup.create(i, j, "Gold1");
                        newChild.name = "Gold1";
                        break;
                }

                // randomize x placement some.
                i += 32 + 32 * rand;
                tiles += 1;
                // if we are now over the water... kick out of loop
                if (i > 800) {
                    tiles = maxTiles + 1;
                }
            } // end while tiles

            tiles = 0;

            // shift Y placement slightly
            if (jRows === 1 || jRows === 3)
                xStart += 20;
            i = xStart;
            j += 45;
            jRows += 1;
        } // end while j


        newChild = "";
        maxTiles = 3;
        tiles = 0;
        maxRows = 3;
        jRows = 0;
        xStart = 180;
        i = xStart;
        j = 685;
        rand = 0;

        //// from under treeline at left accross Rocky slope
        while (jRows < maxRows) {
            console.log("while map3 GoldOre 2 loop");
            while (tiles <= maxTiles) {
                rand = Math.floor(Math.random() * 4);

                switch (rand) {
                    case 0:
                        console.log("Gold1");
                        newChild = this.GoldOreGroup.create(i, j, "Gold1");
                        newChild.name = "Gold1";
                        break;
                    case 1:
                        console.log("Gold2");
                        newChild = this.GoldOreGroup.create(i, j, "Gold2");
                        newChild.name = "Gold2";
                        break;
                    case 2:
                        console.log("Gold3");
                        newChild = this.GoldOreGroup.create(i, j, "Gold3");
                        newChild.name = "Gold3";
                        break;
                    case 3:
                        console.log("Gold4");
                        newChild = this.GoldOreGroup.create(i, j, "Gold4");
                        newChild.name = "Gold4";
                        break;

                    default:
                        console.log("Gold default");
                        newChild = this.GoldOreGroup.create(i, j, "Gold1");
                        newChild.name = "Gold1";
                        break;
                }

                // randomize x placement some.
                i += 32 + 32 * rand;
                tiles += 1;
                // if we are now outside of the field
                if (i > 800) {
                    tiles = maxTiles + 1;
                }
            } // end while tiles

            tiles = 0;

            // shift Y placement slightly
            if (jRows === 1 || jRows === 3)
                xStart += 20;
            i = xStart;
            j += 45;
            jRows += 1;
        } // end while j



        //----------------------------------------------------------------------
        // set the Gold ore to be interactive 
        //
        // NOTE: Click handler taken care of by GlobalFunctions plugin.
        //----------------------------------------------------------------------
        this.GoldOreGroup.children.iterate(
            function (child) {
                child.setInteractive();
            }
        );




        // ********* Jungle ******************
        this.theJungle = this.physics.add.staticGroup();

        // small mid span top jungle row
        newChild = "";
        maxTiles = 6;
        tiles = 0;
        maxRows = 1;
        jRows = 0;
        xStart = 300;
        i = xStart;
        j = 215;

        while (jRows < maxRows) {
            console.log("while top mid span map4 loop");
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



        // from top left to Ocean, no right side beach access allowed without cutting jungle.
        newChild = "";
        maxTiles = 13;
        tiles = 0;
        maxRows = 9;
        jRows = 0;
        xStart = 0;
        i = xStart;
        j = 260;


        while (jRows < maxRows) {
            console.log("while top map4 loop");
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
            if (jRows == 8) {
                // last row of this set
                maxTiles -= 1;  // drop the last tile.
            }
        } // end while j


        // along where the volcano is.
        newChild = "";
        maxTiles = 7;
        tiles = 0;
        maxRows = 8;
        jRows = 0;
        xStart = 0;
        i = xStart;
        j = 665;

        while (jRows < maxRows) {
            console.log("while top map4 loop");
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
        this.PickAxe = this.physics.add.group({
            key: "PickAxeImg",
            repeat: 0,
            setXY: { x: 840, y: 620 }
        });


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

        // Piggy close to gold area
        this.boars = this.physics.add.group({
            key: "boar",
            repeat: 8,
            setXY: { x: 50, y: 200, stepX: 30, stepY: 75 }
        });

        // no speed now. will give random speed and direction in update




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
        console.log("in map 3 create, life is: " + playerLife);
        this.sys.globalFunctions.updateHearts();


        /* ************************************************************
         * ************** Colliders Section ***************************
         * ************************************************************ */

        this.player.setCollideWorldBounds(true);

        this.boars.children.iterate(function (child) {
            child.setCollideWorldBounds(true);
        });


        //  Collide the everything for the most part.  
        this.physics.add.collider(this.player, this.BigOcean);
        this.physics.add.collider(this.player, this.Volcano);
        this.physics.add.collider(this.player, this.theJungle);
        this.physics.add.collider(this.boars, this.BigOcean);
        this.physics.add.collider(this.boars, this.Volcano);


        // collide boars and sheep with each other.
        this.physics.add.collider(this.boars, this.boars);

        //  Checks to see if the player overlaps with any of the boars, if he does call the boarCombat function
        this.physics.add.overlap(this.player, this.boars, this.sys.globalFunctions.boarPlayerCombat, null, this);


        // check for tools:
        this.physics.add.overlap(this.player, this.PickAxe, this.getPickAxe, null, this);


        // Dialog box:
        this.dialogBox = this.sys.dialogModal;
        this.dialogBox.init({ windowHeight: 60, windowWidth: 500, locationX: 20, locationY: 490 });
        this.dialogBox.setText("howdy fellow from shipreck 3");


    } // end create



    // ---------------------------------------------------------
    // update()
    //
    // Description: main update function for scene.  Handles 
    // player movement and end of map event at this level.  
    // Std functionality handles most everything else.
    // -----------------------------------------------------------
    update() {
        //console.log("in update 3");
        if (this.gameOver) {
            console.log("game is over??");
            return;
        }

        //if (this.scene.isSleeping("Shipwrecked3")) {
        //    return;
        //}

        if (sleep3) {
            return;
        }

       //console.log("Doing update 3");

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
        //if (this.sheepEatTime > this.maxSheepEat) {

        //    // make as random as posible but not very changing.
        //    // this.sheepHerd.forEach((child) => {
        //    this.sheepHerd.children.iterate(function (child) {
        //        if (Math.random() > 0.5) {
        //            // 25% chance to change.
        //            // 50% change for either facing direction.
        //            if (Math.random() > 0.5) {
        //                child.anims.play("sheepLeft", true);
        //            }
        //            else {
        //                child.anims.play("sheepRight", true);
        //            }
        //            //  Give each sheep a very very slow speed  
        //            child.setVelocityX(-2 + (Math.random() * 4));
        //            child.setVelocityY(-2 + (Math.random() * 4));
        //        }// end if changing

        //    }); // end for each

        //    this.sheepEatTime = 0;
        //}
        //else {
        //    this.sheepEatTime += 1;
        //}// end sheep update



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
        }// end else


        //  Position the center of the camera on the player
        //  We -400 because the camera width is 800px and
        //  we want the center of the camera on the player, not the left-hand side of it
        //this.cameras.main.scrollX = this.player.x - 400;
       // this.cameras.main.scrollY = this.player.y - 300;


        /* ***************************************************
         * Check for edge of map to switch maps!
         * 
         * Be sure to place player on new map OUTSIDE of check zone.
         * *************************************************** */

        // bottom
        if (this.player.y >= 983) {
            playerStartX = this.player.x;
            playerStartY = 25;
            console.log("in transition from 3 to 4. x and y set to: " + playerStartX + ", " + playerStartY);
            this.scene.wake("Shipwrecked4");
            this.scene.bringToTop("Shipwrecked4");
            this.scene.setActive(true, "Shipwrecked4");
            this.scene.setVisible(true, "Shipwrecked4");
            sleep4 = false;

            this.scene.setActive(false, "Shipwrecked3");
            this.scene.setVisible(false, "Shipwrecked3");
            this.scene.sleep("Shipwrecked3");
            sleep3 = true;
        } // now left side:
        else if (this.player.x <= 17) {
            playerStartX = 975;
            playerStartY = this.player.y;
            console.log("in transition from 3 to 2. x and y set to: " + playerStartX + ", " + playerStartY);
            this.scene.wake("Shipwrecked2");
            this.scene.bringToTop("Shipwrecked2");
            this.scene.setActive(true, "Shipwrecked2");
            this.scene.setVisible(true, "Shipwrecked2");
            sleep2 = false;

            this.scene.setActive(false, "Shipwrecked3");
            this.scene.setVisible(false, "Shipwrecked3");
            this.scene.sleep("Shipwrecked3");
            sleep3 = true;
        }
        // right is ocean, top is ocean so don't need them.

    }// end update




    //--------------------------------------------------------------
    // getPickAxe(thePlayer, thePickAxe)
    //
    // Description:  handler for when player runs over PickAxe.
    // puts PickAxe in player's inventory.
    // 
    // --------------------------------------------------------------
    getPickAxe(thePlayer, thePickAxe) {
        playerInventory.push("PickAxe");
        thePickAxe.disableBody(true, true);

        //############### NEED A MESSAGE TO THE PLAYER HERE #################
        this.dialogBox.setText("Sweet! A PickAxe!  Maybe I can use it on the Ore I keep seeing.");
        console.log(playerInventory);
    }



    // ---------------------------------------------------------
    // onWake()
    //
    // Description: Handler for when scene wakes.  Sets the current
    // player position based on where they left the previous map
    // to provide consistency.  Std handler does everything else.
    // -----------------------------------------------------------
    onWake() {
        console.log("in Shipwrecked 3 onWake");
        this.player.x = playerStartX;
        this.player.y = playerStartY;
        console.log("Set player position to " + playerStartX + ", " + playerStartY);


        // update life and resource displays.
        this.sys.globalFunctions.updateHearts();
        this.sys.globalFunctions.updateResourceDisplay();
    }


} // end class shipwrecked 3
