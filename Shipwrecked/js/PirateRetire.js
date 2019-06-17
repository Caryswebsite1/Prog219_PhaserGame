// JavaScript source code
class PirateRetire extends Phaser.Scene {
        constructor() {
                super({ key: "PirateRetire" });

                this.gameOver = false;

                this.RetiredSummary = [];
                this.RetiredSummary[0] = "Well, you survived.  Not that you have any gold to speak of.  You exist as a beggar in the streets, doomed to a miserable existance and  a disease ridden death.";
                this.RetiredSummary[1] = "You survived and have a very small bit to show for it.  You manage to rent a small hovel in a rather bad part of town.  You live very simply with no luxuries except a bottle of rum once a year.";
                this.RetiredSummary[2] = "You survived and have a bit to show for it.  You rent an appartment in town and live a simple life with few luxuries.";
                this.RetiredSummary[3] = "You survived and have something to show for it!  You buy a nice little cottage in town and live a normal life with a few parties every year.";
                this.RetiredSummary[4] = "You have done reasonably well!  You buy a nice house in town, have a servant and live a good life with some parties every year.";
                this.RetiredSummary[5] = "You have done well!  You buy a small estate outside of town. You have a few servants, live a good life and celebrate with fairly nice parties every year.";
                this.RetiredSummary[6] = "You have done Very well!  You have amassed a large amount of wealth.  You buy a large estate outside of town. You have a lots of servants, live a great life and celebrate with very nice parties every year.";
                this.RetiredSummary[7] = "Who says Piracy doesn't Pay?  You have amassed a huge fortune.  You buy your way into the Governership of Tortuga.  You buy multiple large estates and have lots of servants. You live a fairytale life and host wild fantasic parties year round which are the talk of the caribbean!";

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
                this.load.image("PortSceneImg", "assets/PortScene800.jpg");
                this.load.image("BeggarImg", "assets/BeggarInPort.jpg");
                this.load.image("HovelImg", "assets/Hovel.jpg");
                this.load.image("ApartmentImg", "assets/Apartment.jpg");
                this.load.image("CottageImg", "assets/Cottage.jpg");
                this.load.image("HouseImg", "assets/House.jpg");
                this.load.image("EstateImg", "assets/Estate1.jpg");
                this.load.image("LargeEstateImg", "assets/Estate2.jpg");
                this.load.image("GovernorImg", "assets/Govenor.jpg");

                //this.load.image("SailBtn", "assets/TallShip45.jpg");
                //this.load.image("IronBtn", "assets/IronOre4.png");

                // status icons will be on top of anything else.
                //this.load.image("singleHeart", "assets/singleHeart16.png");
                //this.load.image("blankHeart", "assets/blankHeart16.png");


                // Audio:  Needed all incase of game end while in this scene.
                //Really should have.ogg too.
                // Notes: instances allows for the given number of multiple simultainous plays of the same item.
                // so instances :4 allows 4 copies of that sound to play simultainiously or overlapping if desired.
                this.load.audio('OceanSound', ['assets/audio/Waves.mp3']);
                this.load.audio('MarketSound', ['assets/audio/ShoppingMallAmbiance.mp3']);
                this.load.audio('CryingSound', ['assets/audio/Sad_Male.mp3']);
                this.load.audio('CarnivalSound', ['assets/audio/CrowdAtCarnival.mp3']);
                this.load.audio('PartyCrowdSound', ['assets/audio/party-crowd.mp3']);
                this.load.audio('PartyHornSound', ['assets/audio/party-horn.mp3'], { instances: 3 });
                this.load.audio('FireworksSound', ['assets/audio/Fireworks.mp3']);

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

                this.sys.install('PirateFunctionsPlugin');
                //console.log("from PirateRetire");
                //console.log(this.sys.PirateFunctions);

                // #########################################
                //####### FOR TESTING #######################
                //################################################

                //playerShip = new BoatConstructor(50, 60, 75, 0, 0, 0, 0);
                //playerShip.gold = 600;
                //playerShip.iron = 10;
                //playerShip.wool = 10;
                //playerShip.wood = 0;
                //playerShip.food = 0;

                //Gold = 620;
                //// #################### End for testing ####################


                this.events.on('wake', this.onWake, this);

                // Camera: set bounds to whole world size.
                this.cameras.main.setBounds(0, 0, 1000, 1000);

                // set actual camera width and height for what we see.
                //this.cameras.main.setSize(1000, 1000);
                this.cameras.main.setSize(500, 400);


                // possible Retirement Audios
                this.OceanAudio = this.sound.add('OceanSound');
                this.MarketAudio = this.sound.add('MarketSound');
                this.CryingAudio = this.sound.add('CryingSound');
                this.CarnivalAudio = this.sound.add('CarnivalSound');
                this.PartyCrowdAudio = this.sound.add('PartyCrowdSound');
                this.PartyHornAudio = this.sound.add('PartyHornSound');
                this.FireworksAudio = this.sound.add('FireworksSound');



                // set possible Retired ambiance volumes.  Actual play will be done on wake. 
                this.OceanAudio.volume = 0.2;
                this.MarketAudio.volume = 0.4;
                this.CryingAudio.volume = 0.8;
                this.CarnivalAudio.volume = 0.4;
                this.PartyCrowdAudio.volume = 0.5;
                this.PartyHornAudio.volume = 0.5;
                this.FireworksAudio.volume = 0.7;


                ////this.OceanAudio.play({ loop: true });
                ////this.OceanAudio.pause();

                //this.JungleAudio.volume = 0.5;
                //this.JungleAudio.play({ loop: true });
                //this.JungleAudio.pause();



                /* *********************************************************************
                 * *********** Main Map Setup ******************************************* 
                 * *********************************************************************/


                //NOTE: add in order from bottom layer to top.

                // Adding all images to try to get them to readd onwake.
                // this.add.image(400, 200, "BeggarImg");
                // this.add.image(400, 300, "HovelImg");
                //this.add.image(400, 375, "ApartmentImg");
                //this.add.image(450, 300, "CottageImg");
                //this.add.image(400, 400, "HouseImg");
                //this.add.image(450, 300, "EstateImg");
                //this.add.image(450, 300, "LargeEstateImg");
                //this.add.image(400, 300, "GovernorImg");
                //this.add.image(400, 200, "PortSceneImg");
                //this.add.image(250, 200, "Hull");




                //  Input Events
                // note: gameobjectdown handler should be in global plug in now.
                //this.input.on('gameobjectdown', this.sys.PirateFunctions.onGameObjectClicked, this);


                /* *****************************************************************************************
                 * *********************  Header and Hearts ************************************************
                 * ***************************************************************************************** */

                // this.sys.PirateFunctions.retiredTextFunction();


                /* **************************************************************
                 * ********* Life heart bar  ******************************
                 * *************************************************************** */
                //console.log("in PirateRetire create, ship hitpoints are: " + playerShip.hitPoints);
                // this.sys.globalFunctions.updateHearts();


                /* ************************************************************
                 * ***************** Dialog Box Section ***********************
                 * ************************************************************ */

                // Dialog box:
                //this.dialogBox = this.sys.dialogModal;
                //this.dialogBox.init({ windowHeight: 150, windowWidth: 560, locationX: 120, locationY: 110 });
                //this.dialogBox.toggleWindow();
                //this.dialogBox.addTextLine(20, 20, "Welcome to Tortuga!  You have a " + playerShip.shipType + " and you were able to bring the following to port: " +
                //    "Gold: " + playerShip.gold + " Iron: " + playerShip.iron + " Wool: " + playerShip.wool + " Wood: " + playerShip.wood + " Food: " + playerShip.food  + " ." +
                //    "  Everything but the gold was sold to provide funds for this next adventure!  Your Gold total has been updated.", false);


                // ******* Boat Construction and Selection Texts  **************
                //this.style = { font: "20px Courier", strokeThickness: 1, stroke: "#000", fill: "#000", tabs: [60, 60, 60] };

                //heading
                //this.text1 = this.add.text(20, 20, 'Tortuga Port: ', this.style);
                ////this.text2 = this.add.text(350, 20, 'Current Ship: ' + playerShip.shipType, this.style);
                //this.text3 = this.add.text(20, 50, 'Retired!', this.style);

                //this.text4 = this.add.text(100, 90, 'Canoe', this.style);
                //this.text5 = this.add.text(200, 90, 'Schooner', this.style);
                //this.text6 = this.add.text(345, 90, 'Brig', this.style);
                //this.text7 = this.add.text(460, 90, 'Frigate', this.style);
                //this.text8 = this.add.text(20, 110, "---------------------------------------------",
                //    this.style);

                //this.text9 = this.add.text(20, 130, 'Cost:', this.style);
                //this.text10 = this.add.text(120, 130, '3', this.style);
                //this.text11 = this.add.text(240, 130, '50', this.style);
                //this.text12 = this.add.text(350, 130, '500', this.style);
                //this.text13 = this.add.text(480, 130, '1000', this.style);

                //this.text14 = this.add.text(20, 160, "---------------------------------------------",
                //    this.style);


                //// ***********  BUY BUTTON ETC..  **********
                //this.buyShipButton = {
                //    font: "20px Courier",
                //    fill: "#0a0",
                //    border: "5px solid red"
                //};

                ////buy canoe
                //this.buyCanoe = this.add.text(110, 180, 'Buy', this.buyShipButton);
                //this.buyCanoe.name = "buyCanoeWGold";
                //this.buyCanoe.setInteractive();

                //// buy schooner
                //this.buySchooner = this.add.text(220, 180, 'Buy', this.buyShipButton);
                //this.buySchooner.name = "buySchoonerWGold";
                //this.buySchooner.setInteractive();

                //// buy two master
                //this.buyTwoMaster = this.add.text(350, 180, 'Buy', this.buyShipButton);
                //this.buyTwoMaster.name = "buyBrigWGold";
                //this.buyTwoMaster.setInteractive();

                //// buy Four master
                //this.buyFourMaster = this.add.text(500, 180, 'Buy', this.buyShipButton);
                //this.buyFourMaster.name = "buyFrigateWGold";
                //this.buyFourMaster.setInteractive();

                //this.text15 = this.add.text(20, 210, "---------------------------------------------",
                //    this.style);

                //// upgrade with Iron plating.
                //this.text16 = this.add.text(20, 230, 'Upgrade your ship with Iron Plating!', this.style);
                //this.text17 = this.add.text(20, 260, 'Cost:', this.style);
                //this.text18 = this.add.text(120, 260, '2', this.style);
                //this.text19 = this.add.text(240, 260, '10', this.style);
                //this.text20 = this.add.text(350, 260, '50', this.style);
                //this.text21 = this.add.text(480, 260, '100', this.style);

                //this.text22 = this.add.text(20, 280, "---------------------------------------------",
                //    this.style);

                //// add buy IronPlating button
                //this.buyIronPlate = this.add.text(200, 300, 'Buy Iron Plate', this.buyShipButton);
                //this.buyIronPlate.name = "buyIronPlateBtn";
                //this.buyIronPlate.setInteractive();

                //this.text23 = this.add.text(20, 330, "---------------------------------------------",
                //    this.style);


                //// Buy Cannons!.
                //this.text24 = this.add.text(20, 360, 'Buy Cannons! ', this.style);
                //this.text26 = this.add.text(300, 360, 'Cost: 5 Gold per Cannon', this.style);
                //this.text25 = this.add.text(20, 390, 'Max:', this.style);
                //this.text27 = this.add.text(120, 390, '1', this.style);
                //this.text28 = this.add.text(240, 390, '3', this.style);
                //this.text29 = this.add.text(350, 390, '8', this.style);
                //this.text30 = this.add.text(480, 390, '20', this.style);


                //this.text31 = this.add.text(20, 410, "---------------------------------------------",
                //    this.style);

                ////this.text32 = this.add.text(20, 430, 'Cannons on Board: ' + playerShip.cannon + '  Available Space: ' + (playerShip.maxCannon - playerShip.cannon), this.style);

                //// buy cannon button
                //this.buyCannon = this.add.text(200, 460, 'Buy a Cannon', this.buyShipButton);
                //this.buyCannon.name = "buyCannonBtn";
                //this.buyCannon.setInteractive();

                //this.text33 = this.add.text(20, 490, "---------------------------------------------",
                //    this.style);


                //// set sail!
                //this.setSail = this.add.text(50, 560, 'Set Sail!', {
                //    font: "30px Courier",
                //    fill: "#00a",
                //    border: "5px solid red"
                //});
                //this.setSail.name = "pirateSetSailBtn";
                //this.setSail.setInteractive();

                //// Retire
                //this.retire = this.add.text(400, 560, 'Retire!', {
                //    font: "30px Courier",
                //    fill: "#a00",
                //    border: "5px solid red"
                //});
                //this.retire.name = "pirateRetireBtn";
                //this.retire.setInteractive();





            } // end create



        // ---------------------------------------------------------
        // update()
        //
        // Description: main update function for scene.  Handles 
        // player movement and end of map event at this level.  
        // Std functionality handles most everything else.
        // -----------------------------------------------------------
        update() {

                if (this.gameOver) {
                    //console.log("game is over??");
                    return;
                }


                if (sleepRetire) {
                    return;
                }


            } // end update


        // ---------------------------------------------------------
        // setSleepFlag(bool)
        //
        // Description: sets our scene sleep flag to true (sleeping) or 
        // false (awake.)
        // -----------------------------------------------------------
        setSleepFlag(bSleep) {
            sleepRetire = bSleep;

            if (bSleep === true) {
                // shut down this maps ambience audio
                //console.log("shutting down audio in PirateRetire.");
                //this.OceanAudio.pause();
                //this.JungleAudio.pause();
                //if (this.EarthQuakeAudio.isPlaying) {
                //    this.EarthQuakeAudio.pause();
                //}

            }

        }


        // ---------------------------------------------------------
        // isSleepFlagSet()
        //
        // Description: Override to some extent. Returns our global flag 
        // on if this scene is supposed to be sleeping.
        // -----------------------------------------------------------
        isSleepFlagSet() {
            return sleepRetire;
        }


        // ---------------------------------------------------------
        // onWake()
        //
        // Description: Handler for when scene wakes.  Sets the current
        // player position based on where they left the previous map
        // to provide consistency.  Std handler does everything else.
        // -----------------------------------------------------------
        onWake() {
                //console.log("in PirateRetire onWake");

                // update life and resource displays.
                //this.sys.PirateFunctions.updateHearts();
                //this.sys.PirateFunctions.updateTortugaDisplay();

                //console.log('attempting to resume audio in PirateRetire.');
                // set island ambiance
                //this.OceanAudio.resume();
                //this.JungleAudio.resume();



                //console.log("in PirateRetire Wake.  Ship Type: " + playerShip.shipType);

                // calculate pirate score
                PiratesScore = 0;
                PiratesScore += Gold;
                switch (playerShip.shipType) {

                    case "Canoe":
                        PiratesScore += 3;
                        break;

                    case "Schooner":
                        PiratesScore += 50;
                        break;

                    case "Brig":
                        PiratesScore += 500;
                        break;

                    case "Frigate":
                        PiratesScore += 1000;
                        break;

                    default:
                        PiratesScore += 0;
                        break;
                } // end switch


                // ############################################################################
                // ############ IMPORTANT! #####################################################
                // # Because almost all of our display, including the background image, depends 
                // on the players final score, and because we must be created at the very beginning
                // of the game then just hidden and slept till now, ALL the normal create stuff must
                // happen here, in the proper order, if we want our text etc to show up correctly and 
                // not be hidden by the background image.
                // #####################################################################################


                // set up background image based on player Score:
                if (PiratesScore > 6000) {
                    this.add.image(400, 300, "GovernorImg");
                    //console.log("governor");
                } else if (PiratesScore > 3500) {
                    this.add.image(450, 300, "LargeEstateImg");
                    //console.log("large estate");
                } else if (PiratesScore > 2500) {
                    this.add.image(450, 300, "EstateImg");
                    //console.log("estate");
                } else if (PiratesScore > 1200) {
                    this.add.image(400, 400, "HouseImg");
                    //console.log("house");
                } else if (PiratesScore > 700) {
                    this.add.image(450, 300, "CottageImg");
                    //console.log("cottage");
                } else if (PiratesScore > 300) {
                    this.add.image(400, 375, "ApartmentImg");
                    //console.log("apartment");
                } else if (PiratesScore > 100) {
                    this.add.image(475, 300, "HovelImg");
                    //console.log("hovel");
                } else {
                    this.add.image(400, 200, "BeggarImg");
                    //console.log("Beggar");
                }


                // main Retired text display
                this.retiredStyle = { font: "20px Courier", strokeThickness: 1, stroke: "#000", fill: "#000", tabs: [60, 60, 60] };

                // set up the dialog box and everything else:

                //console.log("in retire, setting up dialog box");
                this.dialogBox = this.sys.dialogModal;
                this.dialogBox.init({ windowHeight: 150, windowWidth: 560, locationX: 120, locationY: 110 });

                /* *****************************************************************************************
                 * ********************* PirateFunctions Texts.. *******************************************
                 * ***************************************************************************************** */

                this.sys.PirateFunctions.retiredTextFunction();



                //this text AFTER the image has been loaded.
                this.text0 = this.add.text(20, 20, 'Tortuga Port ', this.retiredStyle);
                this.text1 = this.add.text(20, 50, 'Retired!', this.retiredStyle);

                this.sys.PirateFunctions.updateRetiredDisplay();




                // set up main text and audio based on player Score:
                if (PiratesScore > 5000) {
                    // Governor
                    this.dialogBox.setText(this.RetiredSummary[7], true);
                    this.CarnivalAudio.volume = 0.2;
                    this.PartyCrowdAudio.volume = 0.6;
                    this.PartyHornAudio.volume = 0.3;
                    this.FireworksAudio.volume = 0.7;
                    this.CarnivalAudio.play({ loop: true });
                    this.PartyCrowdAudio.play({ loop: true });
                    this.FireworksAudio.play({ loop: true });
                    this.PartyHornAudio.play({ delay: 1 });
                    this.PartyHornAudio.play({ delay: 2 });
                    this.PartyHornAudio.play({ delay: 3 });
                } else if (PiratesScore > 3000) {
                    // large estate
                    this.dialogBox.setText(this.RetiredSummary[6], true);
                    this.CarnivalAudio.volume = 0.2;
                    this.PartyCrowdAudio.volume = 0.4;
                    this.PartyHornAudio.volume = 0.3;
                    this.CarnivalAudio.play({ loop: true });
                    this.PartyCrowdAudio.play({ loop: true });
                    this.PartyHornAudio.play({ delay: 1 });
                    this.PartyHornAudio.play({ delay: 2 });
                    this.PartyHornAudio.play({ delay: 3 });
                } else if (PiratesScore > 2000) {
                    // estate
                    this.dialogBox.setText(this.RetiredSummary[5], true);
                    this.CarnivalAudio.volume = 0.2;
                    this.PartyCrowdAudio.volume = 0.4;
                    this.PartyHornAudio.volume = 0.3;
                    this.CarnivalAudio.play({ loop: true });
                    this.PartyCrowdAudio.play({ loop: true });
                    this.PartyHornAudio.play({ delay: 1 });

                } else if (PiratesScore > 1000) {
                    // house
                    this.dialogBox.setText(this.RetiredSummary[4], true);
                    this.CarnivalAudio.volume = 0.4;
                    this.PartyCrowdAudio.volume = 0.2;
                    this.CarnivalAudio.play({ loop: true });
                    this.PartyCrowdAudio.play({ loop: true });

                } else if (PiratesScore > 800) {
                    // cottage
                    this.dialogBox.setText(this.RetiredSummary[3], true);
                    this.MarketAudio.volume = 0.2;
                    this.MarketAudio.play({ loop: true });
                    this.CarnivalAudio.play({ loop: true });
                } else if (PiratesScore > 300) {
                    // appartment in town, lower end
                    this.dialogBox.setText(this.RetiredSummary[2], true);
                    this.MarketAudio.play({ loop: true });
                } else if (PiratesScore > 100) {
                    // hovel
                    this.dialogBox.setText(this.RetiredSummary[1], true);
                    this.OceanAudio.play({ loop: true });
                    this.MarketAudio.play({ loop: true });
                    this.CryingAudio.volume = 0.3; // lower crying 
                    this.CryingAudio.play({ loop: true });
                } else {
                    // beggar in the streets.
                    this.dialogBox.setText(this.RetiredSummary[0], true);
                    this.OceanAudio.play({ loop: true });
                    this.MarketAudio.play({ loop: true });
                    this.CryingAudio.play({ loop: true });
                }

                //console.log("end of onwake for retire");
            } // end on wake


    } // end class PirateRetire