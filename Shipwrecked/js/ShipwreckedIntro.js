/* eslint-disable indent */

class ShipwreckedIntro extends Phaser.Scene {
        constructor() {
                super({ key: "ShipwreckedIntro" });

                // start button timer related
                this.loadStart = 0;
                this.loadingTime = 22000; // 22 seconds
                this.bStartBtn = false;

                this.loadStart = Date.now();

                // text display time counter.
                this.introTextTime = Date.now() - 3000;
                this.maxTimeToText = 4000; // delayed for animation...
                this.introTextArrayCounter = 0;

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
                this.load.image("Storm", "assets/Storm1000.jpg");

                // status icons will be on top of anything else.
                this.load.image("StartBtn", "assets/StartBtn1Red113.png");

                // Audio: 
                //Really should have.ogg too.
                // Notes: instances allows for the given number of multiple simultainous plays of the same item.
                // so instances :4 allows 4 copies of that sound to play simultainiously or overlapping if desired.
                this.load.audio('OceanSound', ['assets/audio/Waves.mp3']);

                // possibly for intro??
                this.load.audio('WindSound', ['assets/audio/wind01.mp3'], { instances: 2 });
                this.load.audio('ThunderSound', ['assets/audio/ThunderStrike.mp3'], { instances: 3 });
                this.load.audio('ThunderStormSound', ['assets/audio/ThunderStorm.mp3'], { instances: 3 });
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
                //console.log(this.sys.dialogModal);

                this.sys.install('GlobalFunctionsPlugin');
                //console.log("from intro");
                //console.log(this.sys.globalFunctions);


                // Camera: set bounds to screen size.
                this.cameras.main.setBounds(0, 0, 1000, 1000);

                // set actual camera width and height for what we see.
                //this.cameras.main.setSize(1000, 1000);
                this.cameras.main.setSize(1000, 1000);


                // island audios
                this.OceanAudio = this.sound.add('OceanSound');
                this.WindAudio = this.sound.add('WindSound');
                this.ThunderAudio = this.sound.add('ThunderSound');
                this.ThunderAudio2 = this.sound.add('ThunderSound');
                this.ThunderAudio3 = this.sound.add('ThunderSound');

                this.ThunderStormAudio = this.sound.add('ThunderStormSound');
                this.ThunderStormAudio2 = this.sound.add('ThunderStormSound');
                this.ThunderStormAudio3 = this.sound.add('ThunderStormSound');


                // set intro ambiance
                this.OceanAudio.volume = 0.5;
                this.OceanAudio.play({ loop: true });
                this.WindAudio.volume = 0.9;
                this.WindAudio.play({ loop: true });

                this.ThunderAudio.volume = 0.7;
                this.ThunderAudio.play({ loop: true, delay: 3 });
                this.ThunderAudio2.volume = 0.7;
                this.ThunderAudio2.play({ loop: true, delay: 8 });
                this.ThunderAudio3.volume = 0.7;
                this.ThunderAudio3.play({ loop: true, delay: 15 });

                this.ThunderStormAudio.volume = 0.7;
                this.ThunderStormAudio.play({ loop: true });
                this.ThunderStormAudio2.volume = 0.7;
                this.ThunderStormAudio2.play({ loop: true, delay: 7 });
                this.ThunderStormAudio3.volume = 0.7;
                this.ThunderStormAudio3.play({ loop: true, delay: 17 });

                /* *********************************************************************
                 * *********** Main Map Setup ******************************************* 
                 * *********************************************************************/
                // Add ships in storm image
                this.add.image(500, 250, "Storm");


                /* **************************************************************
                 * ********* Input Events, Other Events Etc. ********************
                 * *************************************************************** */

                //make sure we have access to gameobjectdown handler.
                this.input.on('gameobjectdown', this.sys.globalFunctions.onGameObjectClicked, this);



                /* ************************************************************
                 * ***************** Dialog Box Section ***********************
                 * ************************************************************ */

                // Dialog box:
                this.dialogBox = this.sys.dialogModal;
                this.dialogBox.init({ windowHeight: 300, windowWidth: 960, locationX: 20, locationY: 480 });

                // text for while we are loading up all the game stuff.
                this.introText = [];
                this.introText[0] = "It was supposed to be an easy crossing, but an unseasonable storm came upon us...";
                this.introText[1] = "It was as if the ancient Greek God Poseidon had decided to punish us! ";
                this.introText[2] = "The lightning set our ships on fire, the wind fanned the flames, and the waves crushed us..";
                this.introText[3] = " ";
                this.introText[4] = "A few of us managed to make it to a nearby island.";
                this.introText[5] = "Alas! The island is infested with mad wild boar and the volcano is rumbling!";
                this.introText[6] = "We must hurry and gather materials to make a ship to escape before the volcano explodes!";
                this.introText[7] = " ";
                this.introText[8] = "Use the arrow keys to move.  Use the mouse to interact with things. ";
                this.introText[9] = "Beware the wild boar!  If you don't have a weapon, you are likely to get gored!";
                this.introText[10] = "Click on the ship icon in the upper left of the first map to see what ship you can build.";
                this.introText[11] = "The timer shows how much time left till the volcano explodes.  You don't want to be around for that!";


                /* ************************************************************
                 * ***************** Launch Section ***************************
                 * ************************************************************ */

                // launch the other shipwrecked scenes so they are available to show when needed without delay.
                this.scene.launch("Shipwrecked");
                this.scene.launch("Shipwrecked2");
                this.scene.launch("Shipwrecked3");
                this.scene.launch("Shipwrecked4");
                this.scene.launch("ShipConstruction");
                this.scene.launch("DeathScene");


                // these are required here because we are merging our Pirate and Shipwrecked.
                this.scene.launch("PirateIntro");
                this.scene.launch("Tortuga");
                this.scene.launch("PirateSailing");
                this.scene.launch("PirateRetire");



                /********************************************************
                 * ******  Current Status... *****************************
                 * *****  Can put the scenes to sleep here, but they get set to awake
                 * by the system somehow.  Thus their updates keep happening.  
                 * The isSleeping call I put into the update functions is NOT triggering.
                 * put in a global to short circuit the update and it seems to work.
                 * **************************************************************** */
                // note, data shows sleeping is not stopping update... neither is pause....
                // and not visible.

                // So basically, these function calls do NADA!  The sleep flags are what matters 
                // to us and the set active and bring to top.

                // put them to sleep.
                this.scene.sleep("Shipwrecked");
                this.scene.sleep("Shipwrecked2");
                this.scene.sleep("Shipwrecked3");
                this.scene.sleep("Shipwrecked4");
                this.scene.sleep("ShipConstruction");
                this.scene.sleep("DeathScene");

                // these are required here because we are merging our Pirate and Shipwrecked.
                this.scene.sleep("PirateIntro");
                this.scene.sleep("Tortuga");
                this.scene.sleep("PirateSailing");
                this.scene.sleep("PirateRetire");


                sleep1 = true;
                sleep2 = true;
                sleep3 = true;
                sleep4 = true;
                sleepShip = true;
                sleepDeath = true;


                // these are required here because we are merging our Pirate and Shipwrecked.
                sleepPirateIntro = true;
                sleepTortuga = true;
                sleepPirate = true;
                sleepRetire = true;


                this.scene.setVisible(false, "Shipwrecked");
                this.scene.setVisible(false, "Shipwrecked2");
                this.scene.setVisible(false, "Shipwrecked3");
                this.scene.setVisible(false, "Shipwrecked4");
                this.scene.setVisible(false, "ShipConstruction");
                this.scene.setVisible(false, "DeathScene");

                // these are required here because we are merging our Pirate and Shipwrecked.
                this.scene.setVisible(false, "PirateIntro");
                this.scene.setVisible(false, "Tortuga");
                this.scene.setVisible(false, "PirateSailing");
                this.scene.setVisible(false, "PirateRetire");



                this.scene.setActive(true, "Shipwrecked");
                this.scene.setActive(false, "Shipwrecked");
                this.scene.setActive(false, "Shipwrecked2");
                this.scene.setActive(false, "Shipwrecked3");
                this.scene.setActive(false, "Shipwrecked4");
                this.scene.setActive(false, "ShipConstruction");
                this.scene.setActive(false, "DeathScene");

                // these are required here because we are merging our Pirate and Shipwrecked.
                this.scene.setActive(false, "PirateIntro");
                this.scene.setActive(false, "Tortuga");
                this.scene.setActive(false, "PirateSailing");
                this.scene.setActive(false, "PirateRetire");


                // bring this intro scene up for input and display.
                this.scene.bringToTop("ShipwreckedIntro");
                this.scene.setActive(true, "ShipwreckedShipwreckedIntro");
                this.scene.setVisible(true, "ShipwreckedShipwreckedIntro");


            } // end create


        // ---------------------------------------------------------
        // update()
        //
        // Description: main update function for scene.  Handles 
        // time dependent events like intro text display and start button
        // display which is dependent on load time for whole game.
        // Currently 15 seconds seems to be a good load time.
        // -----------------------------------------------------------
        update() {

                let currentTime = Date.now();
                let elapsedTime = (currentTime - this.introTextTime);

                let i = this.introTextArrayCounter; // not so much to type!

                // intro text display...
                if ((i < this.introText.length) && (elapsedTime >= this.maxTimeToText)) {
                    // add a new line of text using the new addTextLine and keep track of where you are!.
                    //console.log("in intro text if.");

                    this.dialogBox.addTextLine(20, (i * 20), this.introText[i], false);
                    this.introTextArrayCounter += 1;

                    this.introTextTime = currentTime; // update next text display time.
                }

                // start button creation related
                if (this.bStartBtn == false) {
                    if ((currentTime - this.loadStart) >= this.loadingTime) {
                        //console.log("Setting Up Start Button");
                        // ok to set up start button.
                        this.bStartBtn = true;

                        // add Start button
                        let newChild = "";
                        this.StartGameBtn = this.physics.add.staticGroup();
                        newChild = this.StartGameBtn.create(500, 455, "StartBtn");
                        newChild.name = "StartBtn";
                        newChild.setInteractive();
                        newChild.setScrollFactor(0);

                    } // end if loading time expired

                } // end if bStartBtn

            } // end update



    } // end class ShipwreckedIntro