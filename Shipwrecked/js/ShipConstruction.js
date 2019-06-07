// JavaScript source code
class ShipConstruction extends Phaser.Scene {
    constructor() {
        super({ key: "ShipConstruction" });

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
        this.load.image("bigSand", "assets/island_sand_d.jpg");
        this.load.image("Hull", "assets/HullConstruction.png");
        this.load.image("BackBtn", "assets/boarhit.png");
        //this.load.image("jungleTrees", "assets/JungleOK64.png");
        //this.load.image("TreeImg", "assets/Jungle-Tree6450.png");
        //this.load.image("greenGround", "assets/greenGroundMap2.png");
        //this.load.image("boar", "assets/boarhit.png");
        //this.load.spritesheet("sheepImg", "assets/sheep_eat32.png", { frameWidth: 32, frameHeight: 32 });
        //this.load.spritesheet("dude", "assets/universal-lpc-sprite_male_01_32pix.png", { frameWidth: 32, frameHeight: 32 });


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
        this.load.audio('HeadChopSound', ['assets/audio/BloodyHeadChop.mp3']);
        this.load.audio('ChopWoodSound', ['assets/audio/ChopWood.mp3']);
        this.load.audio('JungleChopSound', ['assets/audio/JungleChop.mp3']);
        this.load.audio('PickAxeSound', ['assets/audio/PickAxe.mp3']);
        this.load.audio('EarthQuakeSound', ['assets/audio/EarthQuake.mp3']);
        this.load.audio('HallelujahSound', ['assets/audio/Hallelujah.mp3']);


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
        console.log("from ShipConstruction")
        console.log(this.sys.globalFunctions);


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
        //this.BoarAudio = this.sound.add('BoarSound');
        //this.SheepAudio = this.sound.add('SheepSound');
        //this.HeadChopAudio = this.sound.add('HeadChopSound');
        //this.ChopWoodAudio = this.sound.add('ChopWoodSound');
        //this.ChopWoodAudio2 = this.sound.add('ChopWoodSound');
        //this.JungleChopAudio = this.sound.add('JungleChopSound');
        //this.PickAxeAudio = this.sound.add('PickAxeSound');
        this.EarthQuakeAudio = this.sound.add('EarthQuakeSound');
        //this.HallelujahAudio = this.sound.add('HallelujahSound');



        // set island ambiance and pause so it doesn't override all the other maps
        this.OceanAudio.volume = 0.2;
        this.OceanAudio.play({ loop: true });
        this.OceanAudio.pause();

        this.JungleAudio.volume = 0.7;
        this.JungleAudio.play({ loop: true });
        this.JungleAudio.pause();



        /* *********************************************************************
         * *********** Main Map Setup ******************************************* 
         * *********************************************************************/


        //NOTE: add in order from bottom layer to top.

        // to only add an image someplace, you would say:
        this.add.image(500, 500, "bigSand");
        this.add.image(250, 200, "Hull");


        // add back button
        let newChild = "";
        this.ShipBackBtn = this.physics.add.staticGroup();
        newChild = this.ShipBackBtn.create(20, 10, "BackBtn");
        newChild.name = "ShipBackBtn";
        newChild.setInteractive();

 
        //  Input Events
       // this.cursors = this.input.keyboard.createCursorKeys();

        // note: gameobjectdown handler should be in global plug in now.
        this.input.on('gameobjectdown', this.sys.globalFunctions.onGameObjectClicked, this);




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
        console.log("in ShipConstruction create, life is: " + playerLife);
        this.sys.globalFunctions.updateHearts();


        /* ************************************************************
         * ***************** Dialog Box Section ***********************
         * ************************************************************ */

        // Dialog box:
        this.dialogBox = this.sys.dialogModal;
        this.dialogBox.init({ windowHeight: 60, windowWidth: 450, locationX: 20, locationY: 320 });
        this.dialogBox.setText("howdy fellow from ShipConstruction");




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


        if (sleepShip) {
            return;
        }

        // call timer update:
        this.sys.globalFunctions.VolcanoTimer();

 
    }// end update


    // ---------------------------------------------------------
    // setSleepFlag(bool)
    //
    // Description: sets our scene sleep flag to true (sleeping) or 
    // false (awake.)
    // -----------------------------------------------------------
    setSleepFlag(bSleep) {
        sleepShip = bSleep;

        // shut down this maps ambience audio
        this.OceanAudio.pause();
        this.JungleAudio.pause();

    }


    // ---------------------------------------------------------
    // onWake()
    //
    // Description: Handler for when scene wakes.  Sets the current
    // player position based on where they left the previous map
    // to provide consistency.  Std handler does everything else.
    // -----------------------------------------------------------
    onWake() {
        console.log("in ShipConstruction onWake");

        // update life and resource displays.
        this.sys.globalFunctions.updateHearts();
        this.sys.globalFunctions.updateResourceDisplay();

        // call timer update:
        this.sys.globalFunctions.VolcanoTimer(true);

        // set island ambiance
        this.OceanAudio.resume();
        this.JungleAudio.resume();

    }


} // end class ShipConstruction
