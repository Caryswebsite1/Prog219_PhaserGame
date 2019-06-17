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

                // status icons will be on top of anything else.
                this.load.image("singleHeart", "assets/singleHeart16.png");
                this.load.image("blankHeart", "assets/blankHeart16.png");


                // Audio:  Needed all incase of game end while in this scene.
                //Really should have.ogg too.
                // Notes: instances allows for the given number of multiple simultainous plays of the same item.
                // so instances :4 allows 4 copies of that sound to play simultainiously or overlapping if desired.
                this.load.audio('OceanSound', ['assets/audio/Waves.mp3']);
                this.load.audio('JungleSound', ['assets/audio/rainforest.mp3']);
                this.load.audio('VolcanoSound', ['assets/audio/Atomic_Bomb.mp3'], { instances: 2 });
                this.load.audio('EarthQuakeSound', ['assets/audio/EarthQuake.mp3']);

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
                //console.log(this.sys.dialogModal);

                this.sys.install('GlobalFunctionsPlugin');
                //console.log("from ShipConstruction");
                //console.log(this.sys.globalFunctions);


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
                this.EarthQuakeAudio = this.sound.add('EarthQuakeSound');


                // set island ambiance and pause so it doesn't override all the other maps
                this.OceanAudio.volume = 0.2;
                this.OceanAudio.play({ loop: true });
                this.OceanAudio.pause();

                this.JungleAudio.volume = 0.5;
                this.JungleAudio.play({ loop: true });
                this.JungleAudio.pause();



                /* *********************************************************************
                 * *********** Main Map Setup ******************************************* 
                 * *********************************************************************/


                // boat notes:

                // this.BoatConstructor = function(pCrew, pCargo, pSpeed, pWood, pWool, pIron, pFood) {
                //     this.crew = pCrew;
                //     this.cargo = pCargo;
                //     this.speed = pSpeed;
                //     this.iron = pIron;
                //     this.wool = pWool;
                //     this.wood = pWood;
                //     this.food = pFood;
                // }


                // this.canoe = new this.BoatConstructor(1, 5, 25, 0, 0, 0, 1);
                // this.schooner = new this.BoatConstructor(15, 10, 40, 20, 15, 0, 15);
                // this.twoMaster = new this.BoatConstructor(30, 25, 50, 40, 25, 15, 30);
                // this.fourMaster = new this.BoatConstructor(50, 60, 75, 80, 45, 35, 50);

                //NOTE: add in order from bottom layer to top.

                // to only add an image someplace, you would say:
                this.add.image(500, 500, "bigSand");
                //this.add.image(250, 200, "Hull");


                // add back button
                let newChild = "";
                this.ShipBackBtn = this.physics.add.staticGroup();
                newChild = this.ShipBackBtn.create(20, 10, "BackBtn");
                newChild.name = "ShipBackBtn";
                newChild.setInteractive();


                //  Input Events
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
                //console.log("in ShipConstruction create, life is: " + playerLife);
                this.sys.globalFunctions.updateHearts();


                /* ************************************************************
                 * ***************** Dialog Box Section ***********************
                 * ************************************************************ */

                // Dialog box:
                this.dialogBox = this.sys.dialogModal;
                this.dialogBox.init({ windowHeight: 60, windowWidth: 450, locationX: 20, locationY: 510 });
                this.dialogBox.setText("Build your ship and escape!");


                // ******* Boat Construction and Selection Texts  **************
                this.style = { font: "20px Courier", fill: "#000", tabs: [60, 60, 60] };

                //heading
                this.text1 = this.add.text(20, 120, 'Crew:', this.style);
                this.text2 = this.add.text(20, 150, 'Cargo:', this.style);
                this.text3 = this.add.text(20, 180, 'Speed:', this.style);

                //boat
                this.text4 = this.add.text(100, 90, 'Canoe', this.style);
                this.text5 = this.add.text(180, 90, 'Schooner', this.style);
                this.text6 = this.add.text(300, 90, 'Brig', this.style);
                this.text16 = this.add.text(450, 90, 'Frigate', this.style);

                //canoe
                this.text7 = this.add.text(120, 120, canoe.crew, this.style);
                this.text8 = this.add.text(120, 150, canoe.cargo, this.style);
                this.text9 = this.add.text(120, 180, canoe.speed, this.style);

                //schooner
                this.text10 = this.add.text(200, 120, schooner.crew, this.style);
                this.text11 = this.add.text(200, 150, schooner.cargo, this.style);
                this.text12 = this.add.text(200, 180, schooner.speed, this.style);

                //twomaster
                this.text13 = this.add.text(320, 120, twoMaster.crew, this.style);
                this.text14 = this.add.text(320, 150, twoMaster.cargo, this.style);
                this.text15 = this.add.text(320, 180, twoMaster.speed, this.style);

                //four master
                this.text17 = this.add.text(470, 120, fourMaster.crew, this.style);
                this.text18 = this.add.text(470, 150, fourMaster.cargo, this.style);
                this.text19 = this.add.text(470, 180, fourMaster.speed, this.style);

                this.text20 = this.add.text(20, 210, "---------------------------------------------",
                    this.style);

                //costs
                this.add.text(220, 230, 'Costs:', this.style);
                this.add.text(20, 260, 'Wood:', this.style);
                this.add.text(20, 300, 'Food:', this.style);
                this.add.text(20, 340, 'Wool:', this.style);
                this.add.text(20, 380, 'Iron:', this.style);

                //canoo
                this.add.text(120, 260, canoe.wood, this.style);
                this.add.text(120, 300, canoe.food, this.style);
                this.add.text(120, 340, canoe.wool, this.style);
                this.add.text(120, 380, canoe.iron, this.style);

                //schooner
                this.add.text(200, 260, schooner.wood, this.style);
                this.add.text(200, 300, schooner.food, this.style);
                this.add.text(200, 340, schooner.wool, this.style);
                this.add.text(200, 380, schooner.iron, this.style);

                //twomaster
                this.add.text(320, 260, twoMaster.wood, this.style);
                this.add.text(320, 300, twoMaster.food, this.style);
                this.add.text(320, 340, twoMaster.wool, this.style);
                this.add.text(320, 380, twoMaster.iron, this.style);

                //fourmaster
                this.add.text(470, 260, fourMaster.wood, this.style);
                this.add.text(470, 300, fourMaster.food, this.style);
                this.add.text(470, 340, fourMaster.wool, this.style);
                this.add.text(470, 380, fourMaster.iron, this.style);


                // ***********  BUY BUTTON ETC..  **********
                this.buyButton = {
                    font: "25px Courier",
                    fill: "#0a0",
                    border: "5px solid red"
                };

                //buy canoe
                this.buyCanoe = this.add.text(80, 410, 'Build', this.buyButton);
                this.buyCanoe.name = "buyCanoe";
                this.buyCanoe.setInteractive();

                // buy schooner
                this.buySchooner = this.add.text(180, 410, 'Build', this.buyButton);
                this.buySchooner.name = "buySchooner";
                this.buySchooner.setInteractive();

                // buy two master
                this.buyTwoMaster = this.add.text(310, 410, 'Build', this.buyButton);
                this.buyTwoMaster.name = "buyTwoMaster";
                this.buyTwoMaster.setInteractive();

                // buy Four master
                this.buyFourMaster = this.add.text(460, 410, 'Build', this.buyButton);
                this.buyFourMaster.name = "buyFourMaster";
                this.buyFourMaster.setInteractive();


            } // end create

        // ---------------------------------------------------------
        // update()
        //
        // Description: main update function for scene.  Handles 
        // player movement and end of map event at this level.  
        // Std functionality handles most everything else.
        // -----------------------------------------------------------
        update() {
                ////console.log("in update shipConstruction");
                if (this.gameOver) {
                    //console.log("game is over??");
                    return;
                }


                if (sleepShip) {
                    return;
                }

                // call timer update:
                this.sys.globalFunctions.VolcanoTimer();


            } // end update


        // ---------------------------------------------------------
        // setSleepFlag(bool)
        //
        // Description: sets our scene sleep flag to true (sleeping) or 
        // false (awake.)
        // -----------------------------------------------------------
        setSleepFlag(bSleep) {
            sleepShip = bSleep;

            if (bSleep === true) {
                // shut down this maps ambience audio
                //console.log("shutting down audio in construction.");
                this.OceanAudio.pause();
                this.JungleAudio.pause();
                if (this.EarthQuakeAudio.isPlaying) {
                    this.EarthQuakeAudio.pause();
                }

            }

        }


        // ---------------------------------------------------------
        // isSleepFlagSet()
        //
        // Description: Override to some extent. Returns our global flag 
        // on if this scene is supposed to be sleeping.
        // -----------------------------------------------------------
        isSleepFlagSet() {
            return sleepShip;
        }


        // ---------------------------------------------------------
        // onWake()
        //
        // Description: Handler for when scene wakes.  Sets the current
        // player position based on where they left the previous map
        // to provide consistency.  Std handler does everything else.
        // -----------------------------------------------------------
        onWake() {
            //console.log("in ShipConstruction onWake");

            // update life and resource displays.
            this.sys.globalFunctions.updateHearts();
            this.sys.globalFunctions.updateResourceDisplay();

            // call timer update:
            this.sys.globalFunctions.VolcanoTimer(true);

            //console.log('attempting to resume audio in construction.');
            // set island ambiance
            this.OceanAudio.resume();
            this.JungleAudio.resume();

        }


    } // end class ShipConstruction