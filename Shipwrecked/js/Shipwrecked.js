/* eslint-disable indent */

class Shipwrecked extends Phaser.Scene {
    constructor() {
        super({ key: "Shipwrecked" });

        this.gameOver = false;
        this.score = 0;
        this.startX = 200;
        this.startY = 280;
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
        this.load.image("ShipBtn", "assets/TallShip45.jpg");

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
        this.load.audio('HeadChopSound', ['assets/audio/BloodyHeadChop.mp3']);
        this.load.audio('ChopWoodSound', ['assets/audio/ChopWood.mp3']);
        this.load.audio('JungleChopSound', ['assets/audio/JungleChop.mp3']);
        this.load.audio('PickAxeSound', ['assets/audio/Pickaxe.mp3']);
        this.load.audio('EarthQuakeSound', ['assets/audio/EarthQuake.mp3']);
        this.load.audio('HallelujahSound', ['assets/audio/Hallelujah.mp3']);

        // possibly for intro??
        this.load.audio('WindSound', ['assets/audio/Wind01.mp3'], {instances: 2});
        this.load.audio('ThunderSound', ['assets/audio/ThunderStrike.mp3'], { instances: 3 });
        this.load.audio('ThunderStormSound', ['assets/audio/ThunderStorm.mp3'], { instances: 2 });
        this.load.audio('DrowningSound', ['assets/audio/Drowning.mp3']);

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
        console.log("from 4")
        console.log(this.sys.globalFunctions);


        // General Create:
        this.events.on('wake', this.onWake, this);

        // Camera: set bounds to whole world size.
        this.cameras.main.setBounds(0, 0, 1000, 1000);

        // set actual camera width and height for what we see.
        //this.cameras.main.setSize(1000, 1000);
        this.cameras.main.setSize(500, 400);


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



        // set island ambiance
        this.OceanAudio.volume = 0.2;
        this.OceanAudio.play({ loop: true });
        this.OceanAudio.pause();
        this.JungleAudio.volume = 0.6;
        this.JungleAudio.play({ loop: true });
        this.JungleAudio.pause();

        /* *********************************************************************
         * *********** Main Map Setup ******************************************* 
         * *********************************************************************/

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

        // set camera to follow player:
        this.cameras.main.startFollow(this.player);


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

        // note: gameobjectdown handler should be in global plug in now.
        this.input.on('gameobjectdown', this.sys.globalFunctions.onGameObjectClicked, this);


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
        console.log("in map 1 create, life is: " + playerLife);
        this.sys.globalFunctions.updateHearts();


        // add ShipConstruction button
        newChild = "";
        this.ShipConstructBtn = this.physics.add.staticGroup();
        newChild = this.ShipConstructBtn.create(20, 10, "ShipBtn");
        newChild.name = "ShipConstructBtn";
        newChild.setInteractive();
        newChild.setScrollFactor(0);

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
        this.physics.add.overlap(this.player, this.boars, this.sys.globalFunctions.boarPlayerCombat, null, this);


        
        // check for tools:
        this.physics.add.overlap(this.player, this.machete, this.getMachete, null, this);


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


        // call timer update:
        this.sys.globalFunctions.VolcanoTimer();

        // shake camera if flag is set.
        if (G_bShake && this.shakeTime > this.shakeInterval) {
            // shake the camera
            this.cameras.main.shake(250);
            this.shakeTime = 0;
        }
        else {
            this.shakeTime += 1;
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
            // in Wake we start this maps ambience audio
            sleep2 = false;

            this.scene.setActive(false, "Shipwrecked");
            this.scene.setVisible(false, "Shipwrecked");
            // shut down this maps ambience audio
            this.OceanAudio.pause();
            this.JungleAudio.pause();

            // and earthquake if happening. ( will be kicked back on by timer event.)
            if (this.EarthQuakeAudio.isPlaying) {
                this.EarthQuakeAudio.pause();
            }

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
            // in Wake we start this maps ambience audio
            sleep4 = false;

            this.scene.setActive(false, "Shipwrecked");
            this.scene.setVisible(false, "Shipwrecked");
            // shut down this maps ambience audio
            this.OceanAudio.pause();
            this.JungleAudio.pause();
            // and earthquake if happening. ( will be kicked back on by timer event.)
            if (this.EarthQuakeAudio.isPlaying) {
                this.EarthQuakeAudio.pause();
            }

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
    // getMachete()
    //
    // Description:  handler for when player runs over machete.
    // puts machete in player's inventory.
    // 
    // --------------------------------------------------------------
    getMachete(thePlayer, theMachete) {
        playerInventory.push("Machete");
        theMachete.disableBody(true, true);

        this.HallelujahAudio.play();
        this.dialogBox.setText("At Last! A Machete!");
        console.log(playerInventory);
    }



    // ---------------------------------------------------------
    // setSleepFlag(bool)
    //
    // Description: sets our scene sleep flag to true (sleeping) or 
    // false (awake.)
    // -----------------------------------------------------------
    setSleepFlag(bSleep) {
        sleep1 = bSleep;

        // because we can get to the construction scene through a button... 
        if (bSleep === true) {
            this.OceanAudio.pause();
            this.JungleAudio.pause();
            if (this.EarthQuakeAudio.isPlaying) {
                this.EarthQuakeAudio.pause();
            }

        }
    }



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

        // update life and resource displays.
        this.sys.globalFunctions.updateHearts();
        this.sys.globalFunctions.updateResourceDisplay();

        // call timer update:
        this.sys.globalFunctions.VolcanoTimer(true);

        // set island ambiance
        this.OceanAudio.resume();
        this.JungleAudio.resume();
    }

} // end class Shipwrecked
