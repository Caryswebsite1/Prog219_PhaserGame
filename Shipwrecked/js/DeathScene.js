// JavaScript source code
class DeathScene extends Phaser.Scene {
    constructor() {
        super({ key: "DeathScene" });

        this.gameOver = true;
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
        //this.load.image("bigSand", "assets/island_sand_d.jpg");
        this.load.image("Death", "assets/DeathSkull545.jpg");

        // Audios
        this.load.audio('DrowningSound', ['assets/audio/Drowning.mp3']);
        this.load.audio('DeathSound', ['assets/audio/DeathScream.mp3']);

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
        console.log("from DeathScene");
        console.log(this.sys.globalFunctions);


        // Camera: set bounds to whole world size.
        this.cameras.main.setBounds(0, 0, 1000, 1000);

        // set actual camera width and height for what we see.
        //this.cameras.main.setSize(1000, 1000);
        this.cameras.main.setSize(500, 400);


        /* *********************************************************************
         * *********** Main Map Setup ******************************************* 
         * *********************************************************************/


        //NOTE: add in order from bottom layer to top.

        // to only add an image someplace, you would say:
        //this.add.image(500, 500, "bigSand");
        this.add.image(250, 200, "Death");




        /* ************************************************************
         * ***************** Dialog Box Section ***********************
         * ************************************************************ */

        // Dialog box:
        this.dialogBox = this.sys.dialogModal;
        this.dialogBox.init({ windowHeight: 60, windowWidth: 450, locationX: 20, locationY: 320 });
        this.dialogBox.setText("Alas! You have died!");


        // audios
        this.DrowningAudio = this.sound.add('DrowningSound');
        this.DeathScreamAudio = this.sound.add('DeathSound');

    } // end create


    // ---------------------------------------------------------
    // update()
    //
    // Description: main update function for scene.  Handles 
    // player movement and end of map event at this level.  
    // Std functionality handles most everything else.
    // -----------------------------------------------------------
    update() {


        if (sleepDeath) {
            return;
        }

    }// end update


    // ---------------------------------------------------------
    // setSleepFlag(bool)
    //
    // Description: sets our scene sleep flag to true (sleeping) or 
    // false (awake.)
    // -----------------------------------------------------------
    setSleepFlag(bSleep) {
        sleepDeath = bSleep;
    }


    // ---------------------------------------------------------
    // isSleepFlagSet()
    //
    // Description: Override to some extent. Returns our global flag 
    // on if this scene is supposed to be sleeping.
    // -----------------------------------------------------------
    isSleepFlagSet() {
        return sleepDeath;
    }

} // end class DeathScene
