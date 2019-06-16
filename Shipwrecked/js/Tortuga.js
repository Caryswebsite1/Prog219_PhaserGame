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
        this.load.plugin('PirateFunctionsPlugin', './js/PirateFunctionsPlugin.js');

        // main images
        this.load.image("Port", "assets/PortScene800.jpg");
        this.load.image("SailBtn", "assets/TallShip45.jpg");
        this.load.image("IronBtn", "assets/IronOre4.png");

        // status icons will be on top of anything else.
        //this.load.image("singleHeart", "assets/singleHeart16.png");
        //this.load.image("blankHeart", "assets/blankHeart16.png");


        // Audio:  Needed all incase of game end while in this scene.
        //Really should have.ogg too.
        // Notes: instances allows for the given number of multiple simultainous plays of the same item.
        // so instances :4 allows 4 copies of that sound to play simultainiously or overlapping if desired.
        this.load.audio('OceanSound', ['assets/audio/Waves.mp3']);
        this.load.audio('MarketSound', ['assets/audio/ShoppingMallAmbiance.mp3']);
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

        this.sys.install('PirateFunctionsPlugin');
        console.log("from Tortuga");
        console.log(this.sys.PirateFunctions);

        this.events.on('wake', this.onWake, this);

        // Camera: set bounds to whole world size.
        this.cameras.main.setBounds(0, 0, 1000, 1000);

        // set actual camera width and height for what we see.
        //this.cameras.main.setSize(1000, 1000);
        this.cameras.main.setSize(500, 400);

        // island audios
        this.OceanAudio = this.sound.add('OceanSound');
        this.MarketAudio = this.sound.add('MarketSound');
        //this.VolcanoAudio = this.sound.add('VolcanoSound');
        //this.VolcanoAudio2 = this.sound.add('VolcanoSound');
        //this.EarthQuakeAudio = this.sound.add('EarthQuakeSound');


        // set Tortuga ambiance and pause so it doesn't override all the other maps
        this.OceanAudio.volume = 0.2;
        this.OceanAudio.play({ loop: true });
        this.OceanAudio.pause();

        this.MarketAudio.volume = 0.5;
        this.MarketAudio.play({ loop: true });
        this.MarketAudio.pause();



        /* *********************************************************************
         * *********** Main Map Setup ******************************************* 
         * *********************************************************************/


        //NOTE: add in order from bottom layer to top.

        // to only add an image someplace, you would say:
        this.add.image(400, 400, "Port");
        //this.add.image(250, 200, "Hull");




        //  Input Events
        // note: gameobjectdown handler should be in global plug in now.
        this.input.on('gameobjectdown', this.sys.PirateFunctions.onGameObjectClicked, this);


        /* *****************************************************************************************
         * *********************  Header and Hearts ************************************************
         * ***************************************************************************************** */

        this.sys.PirateFunctions.tortugaTextFunction();


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
        this.dialogBox.init({ windowHeight: 60, windowWidth: 560, locationX: 90, locationY: 390 });
        this.dialogBox.toggleWindow();


        // ******* Boat Construction and Selection Texts  **************
        this.style = { font: "20px Courier", strokeThickness: 1, stroke: "#000", fill: "#000", tabs: [60, 60, 60] };

        //heading
        this.text1 = this.add.text(90, 20, 'Tortuga Port: ', this.style);
        //this.text2 = this.add.text(350, 20, 'Current Ship: ' + playerShip.shipType, this.style);
        this.text3 = this.add.text(90, 50, 'Buy a New Ship with Gold!', this.style);

        this.text4 = this.add.text(170, 90, 'Canoe', this.style);
        this.text5 = this.add.text(270, 90, 'Schooner', this.style);
        this.text6 = this.add.text(415, 90, 'Brig', this.style);
        this.text7 = this.add.text(530, 90, 'Frigate', this.style);
        this.text8 = this.add.text(90, 100, "---------------------------------------------",
            this.style);

        this.text9 = this.add.text(90, 120, 'Cost:', this.style);
        this.text10 = this.add.text(190, 120, '3', this.style);
        this.text11 = this.add.text(310, 120, '50', this.style);
        this.text12 = this.add.text(420, 120, '500', this.style);
        this.text13 = this.add.text(550, 120, '1000', this.style);

        this.text14 = this.add.text(90, 140, "---------------------------------------------",
            this.style);


        // ***********  BUY BUTTON ETC..  **********
        this.buyShipButton = {
            font: "20px Courier",
            strokeThickness: 1,
            stroke: "#0a0",
            fill: "#0a0",
            border: "5px solid red"
        };

        //buy canoe
        this.buyCanoe = this.add.text(180, 160, 'Buy', this.buyShipButton);
        this.buyCanoe.name = "buyCanoeWGold";
        this.buyCanoe.setInteractive();

        // buy schooner
        this.buySchooner = this.add.text(290, 160, 'Buy', this.buyShipButton);
        this.buySchooner.name = "buySchoonerWGold";
        this.buySchooner.setInteractive();

        // buy two master
        this.buyTwoMaster = this.add.text(420, 160, 'Buy', this.buyShipButton);
        this.buyTwoMaster.name = "buyBrigWGold";
        this.buyTwoMaster.setInteractive();

        // buy Four master
        this.buyFourMaster = this.add.text(570, 160, 'Buy', this.buyShipButton);
        this.buyFourMaster.name = "buyFrigateWGold";
        this.buyFourMaster.setInteractive();

        this.text15 = this.add.text(90, 240, "---------------------------------------------",
            this.style);

        // upgrade with Iron plating.
        this.text16 = this.add.text(90, 200, 'Upgrade your ship with Iron Plating!', this.style);
        this.text17 = this.add.text(90, 225, 'Cost:', this.style);
        this.text18 = this.add.text(190, 225, '2', this.style);
        this.text19 = this.add.text(310, 225, '10', this.style);
        this.text20 = this.add.text(420, 225, '50', this.style);
        this.text21 = this.add.text(550, 225, '100', this.style);

        this.text22 = this.add.text(90, 240, "---------------------------------------------",
            this.style);

        // add buy IronPlating button
        this.buyIronPlate = this.add.text(270, 260, 'Buy Iron Plate', this.buyShipButton);
        this.buyIronPlate.name = "buyIronPlateBtn";
        this.buyIronPlate.setInteractive();

        this.text23 = this.add.text(90, 280, "---------------------------------------------",
            this.style);


        // Buy Cannons!.
        this.text24 = this.add.text(90, 300, 'Buy Cannons! ', this.style);
        this.text26 = this.add.text(370, 300, 'Cost: 5 Gold per Cannon', this.style);
        this.text25 = this.add.text(90, 320, 'Max:', this.style);
        this.text27 = this.add.text(190, 320, '1', this.style);
        this.text28 = this.add.text(310, 320, '3', this.style);
        this.text29 = this.add.text(420, 320, '8', this.style);
        this.text30 = this.add.text(550, 320, '20', this.style);


        this.text31 = this.add.text(90, 335, "---------------------------------------------",
            this.style);

        // the following put in by buy cannon button handler.
        //this.text32 = this.add.text(80, 355, 'Cannons on Board: ' + playerShip.cannon + '  Available Space: ' + (playerShip.maxCannon - playerShip.cannon), this.style);

        // buy cannon button
        this.buyCannon = this.add.text(270, 380, 'Buy A Cannon', this.buyShipButton);
        this.buyCannon.name = "buyCannonBtn";
        this.buyCannon.setInteractive();

        this.text33 = this.add.text(90, 395, "---------------------------------------------",
            this.style);

        // ship repair
        this.text34 = this.add.text(90, 415, 'Repair Your Ship! ', this.style);

        // next line is from pirateFunctions because of update.
        //this.text36 = this.add.text(360, 415, 'Max Cost: ' + ((playerShip.maxHitPoints - playerShip.hitPoints) * 2), this.style);

        this.text36 = this.add.text(90, 435, "---------------------------------------------",
            this.style);

        // repair Ship button
        this.repairShip = this.add.text(270, 455, 'Repair Ship', this.buyShipButton);
        this.repairShip.name = "repairShipBtn";
        this.repairShip.setInteractive();


        // set sail!
        this.setSail = this.add.text(50, 560, 'Set Sail!', {
            font: "30px Courier",
            strokeThickness: 1,
            stroke: "#00a",
            fill: "#00a",
            border: "5px solid red"
        });
        this.setSail.name = "pirateSetSailBtn";
        this.setSail.setInteractive();

        // Retire
        this.retire = this.add.text(600, 560, 'Retire!', {
            font: "30px Courier",
            strokeThickness: 1,
            stroke: "#a00",
           fill: "#a00",
            border: "5px solid red"
        });
        this.retire.name = "pirateRetireBtn";
        this.retire.setInteractive();





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
            this.OceanAudio.pause();
            this.MarketAudio.pause();
        }

    }


    // ---------------------------------------------------------
    // isSleepFlagSet()
    //
    // Description: Override to some extent. Returns our global flag 
    // on if this scene is supposed to be sleeping.
    // -----------------------------------------------------------
    isSleepFlagSet() {
        return sleepTortuga;
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
        //this.sys.PirateFunctions.updateHearts();
        //this.sys.PirateFunctions.updateTortugaDisplay();

        console.log('attempting to resume audio in tortuga.');
        // set Tortuga ambiance
        this.OceanAudio.resume();
        this.MarketAudio.resume();



        // #########################################
        //####### FOR TESTING #######################
        //################################################
        //if (playerShip.shipType === "Canoe") {

        //    playerShip = new BoatConstructor(50, 60, 75, 0, 0, 0, 0);
        //    playerShip.gold = 600;
        //    playerShip.iron = 10;
        //    playerShip.wool = 10;
        //    playerShip.wood = 0;
        //    playerShip.food = 0;

        //    Gold = 620;
        //}

        console.log("in Tortuga Wake.  Ship Type: " + playerShip.shipType);
        // #################### End for testing ####################

        this.sys.PirateFunctions.updateTortugaDisplay();

    }


} // end class Tortuga
