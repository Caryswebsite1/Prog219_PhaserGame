// JavaScript source code
class Tortuga extends Phaser.Scene {
    constructor() {
        super({ key: "Tortuga" });

        this.gameOver = false;
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
        this.load.image("Port", "assets/island_sand_d.jpg");
        this.load.image("SailBtn", "assets/TallShip45.jpg");
        this.load.image("IronBtn", "assets/IronOre4.png");

        // status icons will be on top of anything else.
        this.load.image("singleHeart", "assets/singleHeart16.png");
        this.load.image("blankHeart", "assets/blankHeart16.png");


        // Audio:  Needed all incase of game end while in this scene.
        //Really should have.ogg too.
        // Notes: instances allows for the given number of multiple simultainous plays of the same item.
        // so instances :4 allows 4 copies of that sound to play simultainiously or overlapping if desired.
        //this.load.audio('OceanSound', ['assets/audio/Waves.mp3']);
        //this.load.audio('JungleSound', ['assets/audio/rainforest.mp3']);
        //this.load.audio('VolcanoSound', ['assets/audio/Atomic_Bomb.mp3'], { instances: 2 });
        //this.load.audio('EarthQuakeSound', ['assets/audio/EarthQuake.mp3']);

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

        // #########################################
        //####### FOR TESTING #######################
        //################################################

        playerShip = fourMaster;
        playerShip.gold = 600;
        playerShip.iron = 10;
        playerShip.wool = 10;
        playerShip.wood = 0;
        playerShip.food = 0;

        Gold = 620;
        // #################### End for testing ####################


        this.events.on('wake', this.onWake, this);

        // Camera: set bounds to whole world size.
        this.cameras.main.setBounds(0, 0, 1000, 1000);

        // set actual camera width and height for what we see.
        //this.cameras.main.setSize(1000, 1000);
        this.cameras.main.setSize(800, 600);

        // island audios
        //this.OceanAudio = this.sound.add('OceanSound');
        //this.JungleAudio = this.sound.add('JungleSound');
        //this.VolcanoAudio = this.sound.add('VolcanoSound');
        //this.VolcanoAudio2 = this.sound.add('VolcanoSound');
        //this.EarthQuakeAudio = this.sound.add('EarthQuakeSound');


        // set island ambiance and pause so it doesn't override all the other maps
        //this.OceanAudio.volume = 0.2;
        //this.OceanAudio.play({ loop: true });
        //this.OceanAudio.pause();

        //this.JungleAudio.volume = 0.5;
        //this.JungleAudio.play({ loop: true });
        //this.JungleAudio.pause();



        /* *********************************************************************
         * *********** Main Map Setup ******************************************* 
         * *********************************************************************/


        //NOTE: add in order from bottom layer to top.

        // to only add an image someplace, you would say:
        this.add.image(500, 500, "Port");
        //this.add.image(250, 200, "Hull");




        //  Input Events
        // note: gameobjectdown handler should be in global plug in now.
        this.input.on('gameobjectdown', this.sys.globalFunctions.onGameObjectClicked, this);


        /* *****************************************************************************************
         * *********************  Header and Hearts ************************************************
         * ***************************************************************************************** */

        this.sys.globalFunctions.pirateGoldTextFunction();


        /* **************************************************************
         * ********* Life heart bar  ******************************
         * *************************************************************** */
        console.log("in tortuga create, ship hitpoints are: " + playerShip.hitPoints);
       // this.sys.globalFunctions.updateHearts();


        /* ************************************************************
         * ***************** Dialog Box Section ***********************
         * ************************************************************ */

        // Dialog box:
        this.dialogBox = this.sys.dialogModal;
        this.dialogBox.init({ windowHeight: 200, windowWidth: 560, locationX: 20, locationY: 390 });
        this.dialogBox.addTextLine(20, 20, "Welcome to Tortuga!  You have a " + playerShip.shipType + " and you were able to bring the following to port: " +
            "Gold: " + playerShip.gold + " Iron: " + playerShip.iron + " Wool: " + playerShip.wool + " Wood: " + playerShip.wood + " Food: " + playerShip.food  + " ." +
            "  Everything but the gold was sold to provide funds for this next adventure!  Your Gold total has been updated.", false);


        // ******* Boat Construction and Selection Texts  **************
        this.style = { font: "20px Courier", fill: "#000", tabs: [60, 60, 60] };

        //heading
        this.text1 = this.add.text(20, 20, 'Tortuga Port: ', this.style);
        this.text2 = this.add.text(350, 20, 'Current Ship: ' + playerShip.shipType, this.style);
        this.text2 = this.add.text(20, 50, 'Buy a New Ship with Gold!', this.style);

        this.text4 = this.add.text(100, 90, 'Canoe', this.style);
        this.text5 = this.add.text(180, 90, 'Schooner', this.style);
        this.text6 = this.add.text(300, 90, 'Two Master', this.style);
        this.text16 = this.add.text(450, 90, 'Four Master', this.style);
        this.text20 = this.add.text(20, 110, "---------------------------------------------",
            this.style);

        this.text4 =this.add.text(20, 130, 'Cost:', this.style);
        this.text4 = this.add.text(120, 130, '3', this.style);
        this.text5 = this.add.text(240, 130, '50', this.style);
        this.text6 = this.add.text(350, 130, '500', this.style);
        this.text16 = this.add.text(480, 130, '1000', this.style);

        this.text20 = this.add.text(20, 160, "---------------------------------------------",
            this.style);


        // ***********  BUY BUTTON ETC..  **********
        this.buyShipButton = {
            font: "20px Courier",
            fill: "#0a0",
            border: "5px solid red"
        };

        //buy canoe
        this.buyCanoe = this.add.text(110, 180, 'Buy', this.buyShipButton);
        this.buyCanoe.name = "buyCanoeWGold";
        this.buyCanoe.setInteractive();

        // buy schooner
        this.buySchooner = this.add.text(220, 180, 'Buy', this.buyShipButton);
        this.buySchooner.name = "buySchoonerWGold";
        this.buySchooner.setInteractive();

        // buy two master
        this.buyTwoMaster = this.add.text(350, 180, 'Buy', this.buyShipButton);
        this.buyTwoMaster.name = "buyBrigWGold";
        this.buyTwoMaster.setInteractive();

        // buy Four master
        this.buyFourMaster = this.add.text(500, 180, 'Buy', this.buyShipButton);
        this.buyFourMaster.name = "buyFrigateWGold";
        this.buyFourMaster.setInteractive();

        this.text20 = this.add.text(20, 210, "---------------------------------------------",
            this.style);

        // upgrade with Iron plating.
        this.text2 = this.add.text(20, 230, 'Upgrade your ship with Iron Plating!', this.style);
        this.text4 = this.add.text(20, 260, 'Cost:', this.style);
        this.text4 = this.add.text(120, 260, '2', this.style);
        this.text5 = this.add.text(240, 260, '10', this.style);
        this.text6 = this.add.text(350, 260, '50', this.style);
        this.text16 = this.add.text(480, 260, '100', this.style);

        this.text20 = this.add.text(20, 280, "---------------------------------------------",
            this.style);

        // add buy IronPlating button
        this.buyIronPlate = this.add.text(200, 300, 'Buy Iron Plate', this.buyShipButton);
        this.buyIronPlate.name = "ironPlateBtn";
        this.buyIronPlate.setInteractive();

        this.text20 = this.add.text(20, 330, "---------------------------------------------",
            this.style);



        // set sail!
        this.setSail = this.add.text(250, 360, 'Set Sail!', this.buyShipButton);
        this.setSail.name = "pirateSetSailBtn";
        this.setSail.setInteractive();


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


        if (sleepTortuga) {
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
        sleepTortuga = bSleep;

        if (bSleep === true) {
            // shut down this maps ambience audio
            console.log("shutting down audio in Tortuga.");
            //this.OceanAudio.pause();
            //this.JungleAudio.pause();
            //if (this.EarthQuakeAudio.isPlaying) {
            //    this.EarthQuakeAudio.pause();
            //}

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
        console.log("in Tortuga onWake");

        // update life and resource displays.
        this.sys.globalFunctions.updateHearts();
        this.sys.globalFunctions.updateGoldDisplay();

        console.log('attempting to resume audio in tortuga.');
        // set island ambiance
        //this.OceanAudio.resume();
        //this.JungleAudio.resume();

    }


} // end class Tortuga
