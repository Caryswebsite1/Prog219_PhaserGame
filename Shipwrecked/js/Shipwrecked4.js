/* eslint-disable indent */

class Shipwrecked4 extends Phaser.Scene {
        constructor() {
                super({ key: "Shipwrecked4" });

                this.gameOver = false;
                this.score = 0;
                this.startX = 500;
                this.startY = 400;
                this.boarRunTime = 150; // so we get one movement set right away.
                this.maxBoarRun = 150;
                this.sheepEatTime = 400; // so we get one movement set right away.
                this.maxSheepEat = 400;
                this.shakeInterval = 100;
                this.shakeTime = 0;

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
                this.load.image("ocean7", "assets/ocean7.png");
                this.load.image("ocean8", "assets/ocean8.png");
                this.load.image("jungleTrees", "assets/JungleOK64.png");
                this.load.image("AxeImg", "assets/Axe21.png");
                this.load.image("hcTree", "assets/horse-chestnut-tree_16.png");
                this.load.image("TreeImg", "assets/Jungle-Tree6450.png");
                this.load.image("greenGround", "assets/greenGroundMap4.png");
                this.load.image("VolcanoB1", "assets/VolcanoBottom1Test.png");
                this.load.image("VolcanoB2", "assets/VolcanoBottom1E.png");
                this.load.image("VolcanoB3", "assets/VolcanoBottom1D.png");
                this.load.image("VolcanoB4", "assets/VolcanoBottom1C.png");
                this.load.image("VolcanoB5", "assets/VolcanoBottom1B.png");
                this.load.image("VolcanoB6", "assets/VolcanoBottom1A.png");
                this.load.image("RockyImg", "assets/RockySlope507.png");
                this.load.image("Iron1", "assets/IronOre1.png");
                this.load.image("Iron2", "assets/IronOre2.png");
                this.load.image("Iron3", "assets/IronOre3.png");
                this.load.image("Iron4", "assets/IronOre4.png");
                this.load.image("boar", "assets/boarhit.png");
                this.load.spritesheet("sheepImg", "assets/sheep_eat32.png", { frameWidth: 32, frameHeight: 32 });
                this.load.spritesheet("dude", "assets/universal-lpc-sprite_male_01_32pix.png", { frameWidth: 32, frameHeight: 32 });


                // status icons will be on top of anything else.
                this.load.image("singleHeart", "assets/singleHeart16.png");
                this.load.image("blankHeart", "assets/blankHeart16.png");

                // Audio: 
                //Really should have.ogg too.
                // Notes: instances allows for the given number of multiple simultainous plays of the same item.
                // so instances :4 allows 4 copies of that sound to play simultainiously or overlapping if desired.
                this.load.audio('OceanSound', ['assets/audio/Waves.mp3']);
                this.load.audio('JungleSound', ['assets/audio/rainforest.mp3']);
                this.load.audio('LavaSound', ['assets/audio/lava4.mp3']);
                this.load.audio('VolcanoSound', ['assets/audio/Atomic_Bomb.mp3'], { instances: 2 });
                this.load.audio('BoarSound', ['assets/audio/BoarOink.mp3']);
                this.load.audio('SheepSound', ['assets/audio/Sheep.mp3']);
                this.load.audio('HeadChopSound', ['assets/audio/Decapitation.mp3']);
                this.load.audio('ChopWoodSound', ['assets/audio/ChopWood.mp3']);
                this.load.audio('JungleChopSound', ['assets/audio/JungleChop.mp3']);
                this.load.audio('PickAxeSound', ['assets/audio/Pickaxe.mp3']);
                this.load.audio('EarthQuakeSound', ['assets/audio/EarthQuake.mp3']);
                this.load.audio('HallelujahSound', ['assets/audio/Hallelujah.mp3']);

                // possibly for intro??
                this.load.audio('WindSound', ['assets/audio/Wind01.mp3'], { instances: 2 });
                this.load.audio('ThunderSound', ['assets/audio/ThunderStrike.mp3'], { instances: 3 });
                this.load.audio('ThunderStormSound', ['assets/audio/ThunderStorm.mp3'], { instances: 2 });
                this.load.audio('DrowningSound', ['assets/audio/Drowning.mp3']);

                // map specific ambience
                this.load.audio('LavaSound', ['assets/audio/lava4.mp3']);
                this.load.audio('SizzlingSound', ['assets/audio/HotSizzling.mp3']);

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
                //console.log(this.sys.dialogModal);


                this.sys.install('GlobalFunctionsPlugin');
                //console.log("from 4");
                //console.log(this.sys.globalFunctions);

                this.events.on('wake', this.onWake, this);

                // Camera: set bounds to whole world size.
                this.cameras.main.setBounds(0, 0, 1000, 1000);

                // set actual camera width and height for what we see.
                //this.cameras.main.setSize(1000, 1000);
                this.cameras.main.setSize(500, 400);

                // only for test..
                this.score = 6;


                // island audios
                this.OceanAudio = this.sound.add('OceanSound');
                this.JungleAudio = this.sound.add('JungleSound');
                this.VolcanoAudio = this.sound.add('VolcanoSound');
                this.VolcanoAudio2 = this.sound.add('VolcanoSound');
                this.BoarAudio = this.sound.add('BoarSound');
                this.SheepAudio = this.sound.add('SheepSound');
                this.HeadChopAudio = this.sound.add('HeadChopSound');
                this.ChopWoodAudio = this.sound.add('ChopWoodSound');
                this.ChopWoodAudio2 = this.sound.add('ChopWoodSound');
                this.JungleChopAudio = this.sound.add('JungleChopSound');
                this.PickAxeAudio = this.sound.add('PickAxeSound');
                this.EarthQuakeAudio = this.sound.add('EarthQuakeSound');
                this.HallelujahAudio = this.sound.add('HallelujahSound');

                // map specific
                this.LavaAudio = this.sound.add('LavaSound');
                this.SizzlingAudio = this.sound.add('SizzlingSound');


                // set island ambiance and pause so it doesn't override all the other maps
                this.OceanAudio.volume = 0.2;
                this.OceanAudio.play({ loop: true });
                this.OceanAudio.pause();

                this.JungleAudio.volume = 0.5;
                this.JungleAudio.play({ loop: true });
                this.JungleAudio.pause();


                // map specific ambience
                this.LavaAudio.volume = 0.7;
                this.LavaAudio.play({ loop: true });
                this.LavaAudio.pause();

                this.SizzlingAudio.volume = 0.2;
                this.SizzlingAudio.play({ loop: true });
                this.SizzlingAudio.pause();


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
                this.add.image(200, 380, "greenGround");


                this.BigOcean = this.physics.add.staticGroup();
                this.BigOcean.create(940, 500, "ocean7");
                this.BigOcean.create(500, 980, "ocean8");
                //console.log("out of ocean 4 creation");


                this.Volcano = this.physics.add.staticGroup();
                this.Volcano.create(934, 24, "VolcanoB1");
                this.Volcano.create(936, 136, "VolcanoB2");
                this.Volcano.create(916, 184, "VolcanoB3");
                this.Volcano.create(874, 236, "VolcanoB4");
                this.Volcano.create(831, 303, "VolcanoB5");
                this.Volcano.create(825, 373, "VolcanoB6");

                // ****** rocky slope.. *******
                this.add.image(660, 470, "RockyImg");


                // ******* Iron ore, protected by boars. *******
                // ****** If under trees, you have to cut the tree down first. *******
                this.IronOreGroup = this.physics.add.staticGroup();

                let newChild = "";
                let maxTiles = 6;
                let tiles = 0;
                let maxRows = 3;
                let jRows = 0;
                let xStart = 450;
                i = xStart;
                j = 450;
                let rand = 0;

                // from under treeline at left accross Rocky slope
                while (jRows < maxRows) {
                    //console.log("while map4 IronOre loop");
                    while (tiles <= maxTiles) {
                        rand = Math.floor(Math.random() * 4);

                        switch (rand) {
                            case 0:
                                //console.log("Iron1");
                                newChild = this.IronOreGroup.create(i, j, "Iron1");
                                newChild.name = "Iron1";
                                break;
                            case 1:
                                //console.log("Iron2");
                                newChild = this.IronOreGroup.create(i, j, "Iron2");
                                newChild.name = "Iron2";
                                break;
                            case 2:
                                //console.log("Iron3");
                                newChild = this.IronOreGroup.create(i, j, "Iron3");
                                newChild.name = "Iron3";
                                break;
                            case 3:
                                //console.log("Iron4");
                                newChild = this.IronOreGroup.create(i, j, "Iron4");
                                newChild.name = "Iron4";
                                break;

                            default:
                                //console.log("Iron default");
                                newChild = this.IronOreGroup.create(i, j, "Iron1");
                                newChild.name = "Iron1";
                                break;
                        }

                        // randomize x placement some.
                        if (rand < 1) { rand = 1 }
                        i += 32 * rand;
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


                //----------------------------------------------------------------------
                // set the Iron ore to be interactive 
                //
                // NOTE: Click handler taken care of by GlobalFunctions plugin.
                //----------------------------------------------------------------------
                this.IronOreGroup.children.iterate(
                    function(child) {
                        child.setInteractive();
                    }
                );



                // ********* Jungle ******************
                this.theJungle = this.physics.add.staticGroup();

                // from top left to volcano on right with a tree of overlap or so.
                newChild = "";
                maxTiles = 7;
                tiles = 0;
                maxRows = 3;
                jRows = 0;
                xStart = 0;
                i = xStart;
                j = 0;


                while (jRows < maxRows) {
                    //console.log("while top map4 loop");
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


                // from treeline at top to left diagonal
                newChild = "";
                maxTiles = 7;
                tiles = 0;
                maxRows = 3;
                jRows = 0;
                xStart = 0;
                i = xStart;
                j = 135;

                while (jRows < maxRows) {
                    //console.log("while top map4 loop");
                    while (tiles <= maxTiles) {
                        newChild = this.theJungle.create(i, j, "jungleTrees");
                        newChild.name = "jungle";
                        i += 64;
                        tiles += 1;
                    } // end while tiles
                    if (jRows == 0) { maxTiles -= 1; }
                    tiles = 0;
                    xStart += 0;
                    i = xStart;
                    j += 45;
                    jRows += 1;
                } // end while j



                // diagonal left to right down.

                maxTiles = 3;
                tiles = 0;
                maxRows = 3;
                jRows = 0;
                xStart = 144;
                i = xStart;
                j = 270;

                // Left edge by sheep in map 1
                while (jRows < maxRows) {
                    //console.log("while left diagonal map 4 loop");
                    while (tiles <= maxTiles) {
                        newChild = this.theJungle.create(i, j, "jungleTrees");
                        newChild.name = "jungle";
                        i += 64;
                        tiles += 1;
                        // hole in last row..
                        if (jRows == (maxRows - 1)) {
                            if (tiles == 2) {
                                tiles += 2;
                                i += 128;
                            }
                        }
                    } // end while tiles
                    maxTiles += 1;
                    tiles = 0;
                    xStart += 0;
                    i = xStart;
                    j += 45;
                    jRows += 1;
                } // end while j




                // Left edge by sheep in map 1
                maxTiles = 1;
                tiles = 0;
                maxRows = 7;
                jRows = 0;
                xStart = 80;
                i = xStart;
                j = 405;

                while (jRows < maxRows) {
                    //console.log("while left edge map 4 loop");
                    // jig a bit.
                    if (jRows == 2) {
                        i += 40;
                    }
                    while (tiles <= maxTiles) {
                        newChild = this.theJungle.create(i, j, "jungleTrees");
                        newChild.name = "jungle";
                        i += 64;
                        tiles += 1;
                    } // end while tiles
                    tiles = 0;
                    xStart += 0;
                    // jig a bit.
                    if (jRows == (maxRows - 2)) {
                        xStart += 45;
                        maxTiles += 2;
                    }

                    i = xStart;
                    j += 45;
                    jRows += 1;
                } // end while j



                // Bottom line:
                maxTiles = 10;
                tiles = 0;
                maxRows = 2;
                jRows = 0;
                xStart = 0;
                i = 0;
                j = 720;


                while (jRows < maxRows) {
                    //console.log("while bottom line loop");
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
                    function(child) {
                        child.setInteractive();
                    }
                );



                /* *********************************************************************
                 * *********** Add tools etc. ****************************************** 
                 * *********************************************************************/
                this.Axe = this.physics.add.group({
                    key: "AxeImg",
                    repeat: 0,
                    setXY: { x: 750, y: 600 }
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

                // Piggy scattered around
                this.boars = this.physics.add.group({
                    key: "boar",
                    repeat: 8,
                    setXY: { x: 100, y: 100, stepX: 75, stepY: 75 }
                });

                // no speed now. will give random speed and direction in update


                //Sheep: try to restrict to green grass.
                let newSheep = "";
                this.sheepHerd = this.physics.add.group();
                for (j = 280; j < 400; j += 60) {
                    for (i = 32; i <= 100; i += 45) {
                        newChild = this.sheepHerd.create(i, j, "sheepImg");
                        newChild.name = "sheep";
                    } // end i
                } // end j


                // and a couple more lower down.
                newChild = this.sheepHerd.create(32, 500, "sheepImg");
                newChild.name = "sheep";

                newChild = this.sheepHerd.create(32, 680, "sheepImg");
                newChild.name = "sheep";


                // make the sheep interactive: 
                this.sheepHerd.children.iterate(
                    function(child) {
                        child.setInteractive();
                    }
                );

                //console.log("sheep made Map 4.  Herd: " + this.sheepHerd);


                // Grove of trees for wood.. Protected by boars....
                this.woodTrees = this.physics.add.staticGroup();

                maxTiles = 4;
                tiles = 0;
                maxRows = 6;
                jRows = 0;
                xStart = 210;
                i = xStart;
                j = 400;

                rand = 0;
                let newTree = "";

                while (jRows < maxRows) {
                    //console.log("while map2 wood Tree  loop");
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
                    function(child) {
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


                /* **********************************************************************
                 * **************  Game Timer *******************************************
                 * ********************************************************************** */

                this.sys.globalFunctions.timerTextFunction();


                /* **************************************************************
                 * ********* Life heart bar  ******************************
                 * *************************************************************** */
                //console.log("in map 4 create, life is: " + playerLife);
                this.sys.globalFunctions.updateHearts();


                /* ************************************************************
                 * ************** Colliders Section ***************************
                 * ************************************************************ */

                this.player.setCollideWorldBounds(true);

                this.boars.children.iterate(function(child) {
                    child.setCollideWorldBounds(true);
                });

                this.sheepHerd.children.iterate(function(child) {
                    child.setCollideWorldBounds(true);
                });


                //  Collide the everything for the most part.  
                this.physics.add.collider(this.player, this.BigOcean);
                this.physics.add.collider(this.player, this.Volcano);
                this.physics.add.collider(this.player, this.theJungle);
                this.physics.add.collider(this.player, this.woodTrees);
                this.physics.add.collider(this.boars, this.BigOcean);
                this.physics.add.collider(this.boars, this.Volcano);
                this.physics.add.collider(this.boars, this.theJungle);
                this.physics.add.collider(this.sheepHerd, this.BigOcean);
                this.physics.add.collider(this.sheepHerd, this.Volcano);
                this.physics.add.collider(this.sheepHerd, this.theJungle);


                // collide boars and sheep with each other.
                this.physics.add.collider(this.boars, this.boars);
                this.physics.add.collider(this.sheepHerd, this.boars);
                this.physics.add.collider(this.sheepHerd, this.sheepHerd);

                //  Checks to see if the player overlaps with any of the boars, if he does call the boarCombat function
                this.physics.add.overlap(this.player, this.boars, this.sys.globalFunctions.boarPlayerCombat, null, this);


                // check for tools:
                this.physics.add.overlap(this.player, this.Axe, this.getAxe, null, this);


                /* ************************************************************
                 * ***************** Dialog Box Section ***********************
                 * ************************************************************ */

                // Dialog box:
                this.dialogBox = this.sys.dialogModal;
                this.dialogBox.init({ windowHeight: 60, windowWidth: 350, locationX: 20, locationY: 320 });
                this.dialogBox.setText("howdy fellow from shipreck 4");


            } // end create


        // ---------------------------------------------------------
        // update()
        //
        // Description: main update function for scene.  Handles 
        // player movement and end of map event at this level.  
        // Std functionality handles most everything else.
        // -----------------------------------------------------------
        update() {
                ////console.log("in update 4");
                if (this.gameOver) {
                    //console.log("game is over??");
                    return;
                }

                //if (this.scene.isSleeping("Shipwrecked4")) {
                //    return;
                //}

                if (sleep4) {
                    return;
                }

                // call timer update:
                this.sys.globalFunctions.VolcanoTimer();

                // shake camera if flag is set.
                if (G_bShake && this.shakeTime > this.shakeInterval) {
                    // shake the camera
                    this.cameras.main.shake(250);
                    this.shakeTime = 0;
                } else {
                    this.shakeTime += 1;
                }



                // move boars around randomly every maxBoarRun count.:
                if (this.boarRunTime > this.maxBoarRun) {

                    this.boars.children.iterate(function(child) {
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
                    this.sheepHerd.children.iterate(function(child) {
                        if (Math.random() > 0.5) {
                            // 25% chance to change.
                            // 50% change for either facing direction.
                            if (Math.random() > 0.5) {
                                child.anims.play("sheepLeft", true);
                            } else {
                                child.anims.play("sheepRight", true);
                            }
                            //  Give each sheep a very very slow speed  
                            child.setVelocityX(-2 + (Math.random() * 4));
                            child.setVelocityY(-2 + (Math.random() * 4));
                        } // end if changing

                    }); // end for each

                    this.sheepEatTime = 0;
                } else {
                    this.sheepEatTime += 1;
                } // end sheep update



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
                } // end else


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

                // top
                if (this.player.y <= 17) {
                    playerStartX = this.player.x;
                    playerStartY = 975;
                    //console.log("in transition from 4 to 3. x and y set to: " + playerStartX + ", " + playerStartY);
                    this.scene.wake("Shipwrecked3");
                    this.scene.bringToTop("Shipwrecked3");
                    this.scene.setActive(true, "Shipwrecked3");
                    this.scene.setVisible(true, "Shipwrecked3");
                    sleep3 = false;

                    this.scene.setActive(false, "Shipwrecked4");
                    this.scene.setVisible(false, "Shipwrecked4");
                    // shut down this maps ambience audio
                    this.OceanAudio.pause();
                    this.JungleAudio.pause();
                    this.LavaAudio.pause();
                    this.SizzlingAudio.pause();
                    // and earthquake if happening. ( will be kicked back on by timer event.)
                    if (this.EarthQuakeAudio.isPlaying) {
                        this.EarthQuakeAudio.pause();
                    }
                    this.scene.sleep("Shipwrecked4");
                    sleep4 = true;

                } // now left side:
                else if (this.player.x <= 17) {
                    playerStartX = 975;
                    playerStartY = this.player.y;
                    //console.log("in transition from 4 to 1. x and y set to: " + playerStartX + ", " + playerStartY);
                    this.scene.wake("Shipwrecked");
                    this.scene.bringToTop("Shipwrecked");
                    this.scene.setActive(true, "Shipwrecked");
                    this.scene.setVisible(true, "Shipwrecked");
                    sleep1 = false;

                    this.scene.setActive(false, "Shipwrecked4");
                    this.scene.setVisible(false, "Shipwrecked4");
                    // shut down this maps ambience audio
                    this.OceanAudio.pause();
                    this.JungleAudio.pause();
                    this.LavaAudio.pause();
                    this.SizzlingAudio.pause();
                    // and earthquake if happening. ( will be kicked back on by timer event.)
                    if (this.EarthQuakeAudio.isPlaying) {
                        this.EarthQuakeAudio.pause();
                    }
                    this.scene.sleep("Shipwrecked4");
                    sleep4 = true;
                } // end else if
                // right is ocean, bottom is ocean so don't need them.

            } // end update





        //--------------------------------------------------------------
        // getAxe(thePlayer, theAxe)
        //
        // Description:  handler for when player runs over Axe.
        // puts Axe in player's inventory.
        // 
        // --------------------------------------------------------------
        getAxe(thePlayer, theAxe) {
            playerInventory.push("Axe");
            theAxe.disableBody(true, true);

            this.HallelujahAudio.play();
            this.dialogBox.setText("Sweet! An Axe!  Maybe I can use it on these trees I keep seeing.");
            //console.log(playerInventory);
        }


        // ---------------------------------------------------------
        // setSleepFlag(bool)
        //
        // Description: sets our scene sleep flag to true (sleeping) or 
        // false (awake.)
        // -----------------------------------------------------------
        setSleepFlag(bSleep) {
            sleep4 = bSleep;
        }


        // ---------------------------------------------------------
        // isSleepFlagSet()
        //
        // Description: Override to some extent. Returns our global flag 
        // on if this scene is supposed to be sleeping.
        // -----------------------------------------------------------
        isSleepFlagSet() {
            return sleep4;
        }




        // ---------------------------------------------------------
        // onWake()
        //
        // Description: Handler for when scene wakes.  Sets the current
        // player position based on where they left the previous map
        // to provide consistency.  Std handler does everything else.
        // -----------------------------------------------------------
        onWake() {
            //console.log("in Shipwrecked 4 onWake");
            this.player.x = playerStartX;
            this.player.y = playerStartY;
            //console.log("Set player position to " + playerStartX + ", " + playerStartY);

            // update life and resource displays.
            this.sys.globalFunctions.updateHearts();
            this.sys.globalFunctions.updateResourceDisplay();

            // call timer update:
            this.sys.globalFunctions.VolcanoTimer(true);

            // set island ambiance
            this.OceanAudio.resume();
            this.JungleAudio.resume();
            this.LavaAudio.resume();
            this.SizzlingAudio.resume();
        }


    } // end class