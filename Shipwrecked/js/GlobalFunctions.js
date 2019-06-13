var GlobalFunctionsPlugin = function (scene) {
    // the scene that owns the plugin
    this.scene = scene;
    this.systems = scene.sys;

    // these will be set once the scene calls the associate global function below.
    this.goldText = "";
    this.woodText = "";
    this.ironText = "";
    this.woolText = "";
    this.foodText = "";


    if (!scene.sys.settings.isBooted) {
        scene.sys.events.once('boot', this.boot, this);
    }
};


// Register this plugin with the PluginManager
GlobalFunctionsPlugin.register = function (PluginManager) {
    PluginManager.register('GlobalFunctionsPlugin', GlobalFunctionsPlugin, 'globalFunctions');
};


GlobalFunctionsPlugin.prototype = {
    boot: function () {
        var eventEmitter = this.systems.events;
        eventEmitter.on('shutdown', this.shutdown, this);
        eventEmitter.on('destroy', this.destroy, this);
    },

    //  Called when a Scene shuts down, it may then come back again later
    // (which will invoke the 'start' event) but should be considered dormant.
    shutdown: function () {


        if (this.timedEvent) this.timedEvent.remove();
        if (this.text) this.text.destroy();
    },

    // called when a Scene is destroyed by the Scene Manager
    destroy: function () {
        this.shutdown();
        this.scene = undefined;
    },

    // ---------------------------------------------------------
    // boarPlayerCombat(thePlayer, boar)
    //
    // Description: Handler for when player and boar connect.
    // If the player has a machete (his weapon) he will fight
    // the boar with it, kill the boar and only loose 1 heart 
    // of life doing so.  If no machete, then it's hand vs tusk...
    // Boar will die either way but now the player looses 5 hearts!
    // Killing a boar will increase gold by 1 and food by 1.
    //
    //########################################################################
    // NOTE: because this is a callback / handler to a scene event, 
    //       the "this" in this function is the Scene! Not the plugin!
    //########################################################################
    // -----------------------------------------------------------
    boarPlayerCombat: function (thePlayer, boar) {

        if (playerInventory.includes("Machete")) {
            playerLife -= 1;
            hearts[playerLife] = this.add.image((20 + (playerLife * 18)), 50, 'blankHeart');
            hearts[playerLife].setScrollFactor(0);
            this.HeadChopAudio.play();
            this.dialogBox.setText("Take that boar!  Ha!");
        } else {

            // no machete == Ouch Time! drop life by 5!
            this.BoarAudio.play();
            playerLife -= 5;
            this.dialogBox.setText("ow! Ow! OW!  That Hurt!");
        } // end else no machete 

        // update hearts: 
        this.sys.globalFunctions.updateHearts();

        boar.disableBody(true, true);
        Gold++;
        Food++;
        this.sys.globalFunctions.goldText.setText("Gold: " + Gold);
        this.sys.globalFunctions.foodText.setText("Food: " + Food);

        if (playerLife <= 0) {

            // stop movement on screen
            this.physics.pause();

            // turn player bloody red
            thePlayer.setTint(0xff0000);
            //this.playerLifeImg.setTexture("noHealth");

            // force facing
            thePlayer.anims.play("turn");

            this.gameOver = true;
            this.dialogBox.setText("Alas! You have died!");
            this.sys.globalFunctions.ShipwreckedGameOver(this);

        } // end if playerLife

    }, // end boarPlayerCombat


    //--------------------------------------------------------------
    // onGameObjectClicked(pointer, gameObject)
    //
    // Description:  A call back.  Called when any interactive object is clicked...
    // 
    // --------------------------------------------------------------
    onGameObjectClicked: function (pointer, gameObject) {
        console.log("made it into New onGameObjectClicked. ");

        switch (gameObject.name) {
            case "jungle":

                if (!playerInventory.includes("Machete")) {
                    if (
                        (Math.abs((this.player.x - gameObject.x)) <= 60) &&
                        (Math.abs((this.player.y - gameObject.y)) <= 60)
                    ) {

                        this.dialogBox.setText("Sure wish I had a Machete!");
                        console.log("Sure wish I had a Machete!");
                    }
                    else {
                        this.dialogBox.setText("I am too far away from that to do anything.");
                    }
                }
                else {
                    console.log("in else, Check to see if close enough!");

                    console.log("player x: " + this.player.x + "  player y: " + this.player.y);
                    console.log("jungle x: " + gameObject.x + "  jungle y: " + gameObject.y);
                    // if player close to jungle piece then destroy it (chopped!).
                    if (
                        (Math.abs((this.player.x - gameObject.x)) <= 60) &&
                        (Math.abs((this.player.y - gameObject.y)) <= 60)
                    ) {
                        // close enough to chop!
                        this.JungleChopAudio.setSeek(2000);
                        this.JungleChopAudio.play();
                        this.dialogBox.setText("CHOP! CHOP!");

                        gameObject.disableBody(true, true);
                        console.log("chopping jungle yet to be fully implemented.");
                    }
                    else {
                        this.dialogBox.setText("I am too far away from that to do anything.");
                        console.log("NOPE NOT close enough!");
                    }

                }// end else


                break; // end jungle


            case "sheep":

                if (!playerInventory.includes("Machete")) {
                    if (
                        (Math.abs((this.player.x - gameObject.x)) <= 30) &&
                        (Math.abs((this.player.y - gameObject.y)) <= 30)
                    ) {
                        this.SheepAudio.play();
                        this.dialogBox.setText("I can't sheer these sheep with my bare hands!");
                        console.log("can't sheer these sheep with bare hands");
                    }
                    else {
                        this.SheepAudio.play();
                        this.dialogBox.setText("I am too far away from that to do anything.");
                    }
                }
                else {
                    console.log("in else for sheep, Check to see if close enough!");

                    console.log("player x: " + this.player.x + "  player y: " + this.player.y);
                    console.log("sheep x: " + gameObject.x + "  sheep y: " + gameObject.y);
                    // if player close to sheep piece then destroy it (chopped!).
                    if (
                        (Math.abs((this.player.x - gameObject.x)) <= 30) &&
                        (Math.abs((this.player.y - gameObject.y)) <= 30)
                    ) {
                        // close enough to chop!
                        this.SheepAudio.play();
                        this.HeadChopAudio.play();
                        this.dialogBox.setText("Baaaaa!  Baaaaa! Baa.");

                        gameObject.disableBody(true, true);

                        // gain resources!
                        Wool++;
                        Food++;
                        this.sys.globalFunctions.woolText.setText("Wool: " + Wool);
                        this.sys.globalFunctions.foodText.setText("Food: " + Food);

                    }
                    else {
                        this.dialogBox.setText("I am too far away from that to do anything.");
                        console.log("NOPE NOT close enough!");
                    }

                }// end else
                break; // end sheep


            case "tree":

                if (!playerInventory.includes("Axe")) {
                    if (
                        (Math.abs((this.player.x - gameObject.x)) <= 60) &&
                        (Math.abs((this.player.y - gameObject.y)) <= 60)
                    ) {

                        this.dialogBox.setText("I sure wish I had an Axe!");
                        console.log("I sure wish I had an Axe!");
                    }
                    else {
                        this.dialogBox.setText("I am too far away from that to do anything.");
                    }
                }
                else {
                    console.log("in else for trees, Check to see if close enough!");

                    console.log("player x: " + this.player.x + "  player y: " + this.player.y);
                    console.log("tree x: " + gameObject.x + "  tree y: " + gameObject.y);
                    // if player close to sheep piece then destroy it (chopped!).
                    if (
                        (Math.abs((this.player.x - gameObject.x)) <= 60) &&
                        (Math.abs((this.player.y - gameObject.y)) <= 60)
                    ) {
                        // close enough to chop!
                        this.ChopWoodAudio.play();
                        this.dialogBox.setText("Tiiiimmmmmbbbbbeeerrrrrr!");
                        this.ChopWoodAudio2.play({ delay: 0.5 });

                        gameObject.disableBody(true, true);

                        // gain resources!
                        Wood++;
                        this.sys.globalFunctions.woodText.setText("Wood: " + Wood);

                    }
                    else {
                        this.dialogBox.setText("I am too far away from that to do anything.");
                        console.log("NOPE NOT close enough!");
                    }

                }// end else
                break; // end tree


            case "Iron1":
            case "Iron2":
            case "Iron3":
            case "Iron4":

                if (!playerInventory.includes("PickAxe")) {
                    if (
                        (Math.abs((this.player.x - gameObject.x)) <= 40) &&
                        (Math.abs((this.player.y - gameObject.y)) <= 40)
                    ) {

                        this.dialogBox.setText("I sure wish I had a PickAxe!");
                        console.log("I sure wish I had a PickAxe!");
                    }
                    else {
                        this.dialogBox.setText("I am too far away from that to do anything.");
                    }
                }
                else {
                    console.log("in else for Iron, Check to see if close enough!");

                    console.log("player x: " + this.player.x + "  player y: " + this.player.y);
                    console.log("tree x: " + gameObject.x + "  tree y: " + gameObject.y);
                    // if player close to Iron piece then destroy it (Mined!).
                    if (
                        (Math.abs((this.player.x - gameObject.x)) <= 40) &&
                        (Math.abs((this.player.y - gameObject.y)) <= 40)
                    ) {
                        // close enough to chop!
                        this.PickAxeAudio.play();
                        this.dialogBox.setText("Whew! Mining Iron is Hard!");

                        // gain resources! Switch on iron type.
                        switch (gameObject.name) {
                            case "Iron1":
                                Iron++;
                                break;

                            case "Iron2":
                                Iron += 2;
                                break;

                            case "Iron3":
                                Iron += 3;
                                break;

                            case "Iron4":
                                Iron += 4;
                                break;

                            default:
                                Iron++;
                                break;
                        } // end gain resources switch.

                        // set text:
                        this.sys.globalFunctions.ironText.setText("Iron: " + Iron);

                        gameObject.disableBody(true, true);
                    }// end close enough, mine it!
                    else {
                        this.dialogBox.setText("I am too far away from that to do anything.");
                        console.log("NOPE NOT close enough!");
                    }

                }// end else
                break; // end Iron



            case "Gold1":
            case "Gold2":
            case "Gold3":
            case "Gold4":

                if (!playerInventory.includes("PickAxe")) {
                    if (
                        (Math.abs((this.player.x - gameObject.x)) <= 40) &&
                        (Math.abs((this.player.y - gameObject.y)) <= 40)
                    ) {

                        this.dialogBox.setText("I sure wish I had a PickAxe!");
                        console.log("I sure wish I had a PickAxe!");
                    }
                    else {
                        this.dialogBox.setText("I am too far away from that to do anything.");
                    }
                }
                else {
                    console.log("in else for Gold, Check to see if close enough!");

                    console.log("player x: " + this.player.x + "  player y: " + this.player.y);
                    console.log("tree x: " + gameObject.x + "  tree y: " + gameObject.y);
                    // if player close to Iron piece then destroy it (Mined!).
                    if (
                        (Math.abs((this.player.x - gameObject.x)) <= 40) &&
                        (Math.abs((this.player.y - gameObject.y)) <= 40)
                    ) {
                        // close enough to mine!
                        this.PickAxeAudio.play();
                        this.dialogBox.setText("gold, Gold, GOLD!");

                        // gain resources! Switch on iron type.
                        switch (gameObject.name) {
                            case "Gold1":
                                Gold++;
                                break;

                            case "Gold2":
                                Gold += 2;
                                break;

                            case "Gold3":
                                Gold += 3;
                                break;

                            case "Gold4":
                                Gold += 4;
                                break;

                            default:
                                Gold++;
                                break;
                        } // end gain resources switch.

                        // set text:
                        this.sys.globalFunctions.goldText.setText("Gold: " + Gold);

                        gameObject.disableBody(true, true);
                    }// end close enough, mine it!
                    else {
                        this.dialogBox.setText("I am too far away from that to do anything.");
                        console.log("NOPE NOT close enough!");
                    }

                }// end else
                break; // end Gold



            case "ShipConstructBtn":
                var shipScene = this.scene.manager.getScene("ShipConstruction");
                console.log("in ConstructBtn Handler. getScene Results: " + shipScene.scene.key);
                this.scene.wake("ShipConstruction");
                this.scene.bringToTop("ShipConstruction");
                this.scene.setActive(true, "ShipConstruction");
                this.scene.setVisible(true, "ShipConstruction");
                shipScene.setSleepFlag(false);
                shipScene.oldSceneKey = this.scene.key;
                console.log("the old scene key: " + shipScene.oldSceneKey);

                // attempt to increase camera size..
                shipScene.cameras.main.setSize(800, 600);

                // save player location in global.
                playerStartX = this.player.x;
                playerStartY = this.player.y;



                this.scene.setVisible(false);
                this.scene.setActive(false);
                this.scene.sleep();
                this.setSleepFlag(true);

                break; // end ShipConstructBtn


            case "ShipBackBtn":
                console.log("in ShipBackBtn Handler: old scene key: " + this.oldSceneKey);
                var oldScene = this.scene.manager.getScene(this.oldSceneKey);
                console.log("manager sent back: " + oldScene.key);

                oldScene.scene.wake(this.oldSceneKey);
                oldScene.scene.bringToTop(this.oldSceneKey);
                oldScene.scene.setActive(this.oldSceneKey);
                oldScene.scene.setVisible(this.oldSceneKey);
                oldScene.setSleepFlag(false);
                this.oldSceneKey = null;

                // attempt to decrease camera size..
                this.cameras.main.setSize(500, 400);


                this.scene.setActive(false);
                this.scene.setVisible(false);
                this.scene.sleep();
                this.setSleepFlag(true);

                break; // end ShipBackBtn


            case "buyCanoe":

                if (this.sys.globalFunctions.validPurchase(canoe)) {
                    this.dialogBox.setText("Congrats you have saved only yourself!");
                    this.sys.globalFunctions.updateResourceDisplay();

                    playerShip = canoe;
                    console.log('PlayerShip shiptype: ' + playerShip.shipType);
                    this.sys.globalFunctions.displaySailButton(this);       // Sail away!

                    //this.scene.start("PirateSailing");

                } else {
                    this.dialogBox.setText("You cant afford that yet!");
                }
                break;


            case "buySchooner":

                if (this.sys.globalFunctions.validPurchase(schooner)) {
                    this.dialogBox.setText("you have bought a schooner, and actualy saved some other people then yourself!");
                    this.sys.globalFunctions.updateResourceDisplay();

                    playerShip = schooner;
                    this.sys.globalFunctions.displaySailButton(this);       // Sail away!
                } else {
                    this.dialogBox.setText("You cant afford that yet!");
                }

                break;


            case "buyTwoMaster":

                if (this.sys.globalFunctions.validPurchase(twoMaster)) {
                    this.dialogBox.setText("You bought a two master and saved a bunch of people!");
                    this.sys.globalFunctions.updateResourceDisplay();

                    playerShip = twoMaster;
                    this.sys.globalFunctions.displaySailButton(this);       // Sail away!
                } else {
                    this.dialogBox.setText("You cant afford that yet!");
                }
                break;


            case "buyFourMaster":

                if (this.sys.globalFunctions.validPurchase(fourMaster)) {
                    this.dialogBox.setText("You have saved all the people!");
                    this.sys.globalFunctions.updateResourceDisplay();

                    playerShip = fourMaster;
                    this.sys.globalFunctions.displaySailButton(this);       // Sail away!
                } else {
                    this.dialogBox.setText("You cant afford that yet!");
                }
                break;


            case "SailAway":
                // Sail away from island!

                // first initialize cargo
                playerShip.iron = 0;
                playerShip.wool = 0;
                playerShip.wood = 0;
                playerShip.food = 0;
                playerShip.gold = 0;

                let cargoSpace = playerShip.cargo;
                // load cargo, gold first..
                // gold:
                if (Gold > cargoSpace) {
                    playerShip.gold = cargoSpace;
                }
                else {
                    playerShip.gold = Gold;
                    cargoSpace -= Gold;
                }

                // Iron:
                if (Iron > cargoSpace) {
                    playerShip.iron = cargoSpace;
                }
                else {
                    playerShip.iron = Iron;
                    cargoSpace -= Iron;
                }

                // Wool:
                if (Wool > cargoSpace) {
                    playerShip.wool = cargoSpace;
                }
                else {
                    playerShip.wool = Wool;
                    cargoSpace -= Wool;
                }

                // Wood:
                if (Wood > cargoSpace) {
                    playerShip.wood = cargoSpace;
                }
                else {
                    playerShip.wood = Wood;
                    cargoSpace -= Wood;
                }

                // Food:
                if (Food > cargoSpace) {
                    playerShip.food = cargoSpace;
                }
                else {
                    playerShip.food = Food;
                    cargoSpace -= Food;
                }

                // everything loaded that can be.  zero out the globals.
                Gold = 0;
                Wood = 0;
                Iron = 0;
                Wool = 0;
                Food = 0;


                // ****** shut down Shipwrecked stuff. ********
                // stop all environment audios including volcano...
                if (this.OceanAudio) {
                    if (this.OceanAudio.isPlaying) {
                        this.OceanAudio.stop();
                    }
                }
                if (this.JungleAudio) {
                    if (this.JungleAudio.isPlaying) {
                        this.JungleAudio.stop();
                    }
                }
                if (this.BoarAudio) {
                    if (this.BoarAudio.isPlaying) {
                        this.BoarAudio.stop();
                    }
                }
                if (this.SheepAudio) {
                    if (this.SheepAudio.isPlaying) {
                        this.SheepAudio.stop();
                    }
                }
                if (this.HeadChopAudio) {
                    if (this.HeadChopAudio.isPlaying) {
                        this.HeadChopAudio.stop();
                    }
                }
                if (this.ChopWoodAudio) {
                    if (this.ChopWoodAudio.isPlaying) {
                        this.ChopWoodAudio.stop();
                    }
                }
                if (this.JungleChopAudio) {
                    if (this.JungleChopAudio.isPlaying) {
                        this.JungleChopAudio.stop();
                    }
                }
                if (this.PickAxeAudio) {
                    if (this.PickAxeAudio.isPlaying) {
                        this.PickAxeAudio.stop();
                    }
                }
                if (this.HallelujahAudio) {
                    if (this.HallelujahAudio.isPlaying) {
                        this.HallelujahAudio.stop();
                    }
                }
                if (this.EarthQuakeAudio) {
                    if (this.EarthQuakeAudio.isPlaying) {
                        this.EarthQuakeAudio.stop();
                    }
                }



                // scene specific audios
                if (this.LavaAudio) {

                    if (this.LavaAudio.isPlaying) {
                        this.LavaAudio.stop();
                    }

                }

                if (this.SizzlingAudio) {

                    if (this.SizzlingAudio.isPlaying) {
                        this.SizzlingAudio.stop();
                    }

                }

                if (this.ForestFireAudio) {

                    if (this.ForestFireAudio.isPlaying) {
                        this.ForestFireAudio.stop();
                    }

                }


                //checking whats going on here... player ship doesn't seem to make it.
                console.log('About to switch to PirateIntro. Player Ship Type: ' + playerShip.shipType);


                // bring up Pirate Intro! 
                var introScene = this.scene.manager.getScene("PirateIntro");
                this.scene.wake("PirateIntro");
                this.scene.bringToTop("PirateIntro");
                this.scene.setActive("PirateIntro");
                this.scene.setVisible("PirateIntro");
                introScene.setSleepFlag(false);

                // attempt to increase PirateIntro camera size..
                introScene.cameras.main.setSize(800, 600);

                //checking whats going on here... player ship doesn't seem to make it.
                console.log('PirateIntro now active. Player Ship Type: ' + playerShip.shipType);


                // shut down shipConstruction 
                this.scene.setActive(false);
                this.scene.setVisible(false);
                this.scene.sleep();
                this.setSleepFlag(true);

                //checking whats going on here... player ship doesn't seem to make it.
                console.log('Ship Construction now asleep. Player Ship Type: ' + playerShip.shipType);


                // get manager to enable killing all the Shipwrecked scenes.
                let manager = this.scene.manager;

                // now remove them.
                manager.remove("ShipConstruction");
                manager.remove("Shipwreck");
                manager.remove("Shipwreck2");
                manager.remove("Shipwreck3");
                manager.remove("Shipwreck4");

                //checking whats going on here... player ship doesn't seem to make it.
                console.log('All Shipwreck scenes removed... Player Ship Type: ' + playerShip.shipType);


                break;



            case "StartBtn":
                // attempt to decrease camera size to main Shipwrecked size..
                this.cameras.main.setSize(500, 400);

                // got to Shipwrecked!
                var startingScene = this.scene.manager.getScene("Shipwrecked");
                console.log("in start Btn Handler");
                this.scene.wake("Shipwrecked");
                this.scene.bringToTop("Shipwrecked");
                this.scene.setActive(true, "Shipwrecked");
                this.scene.setVisible(true, "Shipwrecked");
                startingScene.setSleepFlag(false);

                console.log("shutting down intro ");

                // stop intro audio
                this.OceanAudio.stop();
                this.WindAudio.stop();
                this.ThunderAudio.stop();
                this.ThunderAudio2.stop();
                this.ThunderAudio3.stop();
                this.ThunderStormAudio.stop();
                this.ThunderStormAudio2.stop();
                this.ThunderStormAudio3.stop();

                // use manager to remove us.
                this.scene.manager.remove("ShipwreckedIntro");

                // reset start and explode times so the player is not penalized for watching the intro screen!
                timeLeft = explodeTime;
                startTime = Date.now();
                G_bShake = false;
                G_bGameStarted = true;  // set game started flag!

                break; // end Start Game

            default:
                break;

        }// end switch


    }, // end onGameObjectClicked


    /* **********************************************************************************************************
    ***********  Text Display initalization functions:  All scenes must call these to enable their display *********
    ************************************************************************************************************ */
    goldTextFunction: function () {
        this.goldText = this.scene.add.text(50, 10, "Gold: " + Gold, { fontsize: "32px", strokeThickness: 1, stroke: "#fe0", fill: "#fe0", shadowStroke: true, shadowFill: true, shadowColor: "#000", shadowOffsetX: 1, shadowOffsetY: 1, align: "center" });
        this.goldText.setScrollFactor(0);
    },
    woodTextFunction: function () {
        this.woodText = this.scene.add.text(140, 10, "Wood: " + Wood, { fontsize: "32px", strokeThickness: 1, stroke: "#fe0", fill: "#fe0", align: "center" });
        this.woodText.setScrollFactor(0);
    },
    ironTextFunction: function () {
        this.ironText = this.scene.add.text(230, 10, "Iron: " + Iron, { fontsize: "32px", strokeThickness: 1, stroke: "#fe0", fill: "#fe0", align: "center" });
        this.ironText.setScrollFactor(0);
    },
    woolTextFunction: function () {
        this.woolText = this.scene.add.text(320, 10, "Wool: " + Wool, { fontsize: "32px", strokeThickness: 1, stroke: "#fe0", fill: "#fe0", align: "center" });
        this.woolText.setScrollFactor(0);
    },
    foodTextFunction: function () {
        this.foodText = this.scene.add.text(410, 10, "Food: " + Food, { fontsize: "32px", strokeThickness: 1, stroke: "#fe0", fill: "#fe0", align: "center" });
        this.foodText.setScrollFactor(0);
    },



    /* **********************************************************************************************************
    ***********  Text Display update function:  All scenes should call this on wake to update their displays. *********
    ************************************************************************************************************ */
    updateResourceDisplay: function () {
        this.goldText.setText("Gold: " + Gold);
        this.woodText.setText("Wood: " + Wood);
        this.ironText.setText("Iron: " + Iron);
        this.woolText.setText("Wool: " + Wool);
        this.foodText.setText("Food: " + Food);
    },



    /* **************************************************************
    * ********* Initial making of Life bar... Might not need now.. **
    * *************************************************************** */
    makeHearts: function () {
        for (i = 0; i < 10; i++) {

            hearts[i] = this.scene.add.image((20 + (i * 18)), 50, 'singleHeart');
            hearts[i].setScrollFactor(0);
        }
    },

    /* **************************************************************
    * ********* Life heart bar update ******************************
    * *************************************************************** */
    updateHearts: function () {
        console.log("in updateHearts: Life is: " + playerLife);
        for (i = 0; i < 10; i++) {
            if (i <= playerLife - 1) {
                hearts[i] = this.scene.add.image((20 + (i * 18)), 50, 'singleHeart');
            }
            else {
                hearts[i] = this.scene.add.image((20 + (i * 18)), 50, 'blankHeart');
            }
            hearts[i].setScrollFactor(0);
        }
    },


    /* **************************************************************
    * ********* Purchase Boat Validation ******************************
    * *************************************************************** */
    validPurchase: function (boat) {
        if (boat.wood > Wood) {
            return false;
        }
        if (boat.food > Food) {
            return false;
        }
        if (boat.wool > Wool) {
            return false;
        }
        if (boat.iron > Iron) {
            return false;
        }
        this.subtractResorces(boat);
        return true;
    },



    /* **************************************************************
    * ********* subtractResources for boat build/ purchase.**********
    * *************************************************************** */
    subtractResorces: function (boat) {
        Wood -= boat.wood;
        Food -= boat.food;
        Wool -= boat.wool;
        Iron -= boat.iron;
    },


    displaySailButton: function (aScene) {

        aScene.sailButton = {
            font: "30px Courier",
            fill: "#f00",
            border: "5px solid red"
        };

        aScene.Sail = aScene.add.text(300, 460, 'Sail Away!', aScene.sailButton);
        aScene.Sail.name = "SailAway";
        aScene.Sail.setInteractive();

    },

    /* **************************************************************
    * ********* Timer display init and update ******************************
    * *************************************************************** */

    timerTextFunction: function () {
        this.timerText = this.scene.add.text(220, 40, "Time Left: " + theMin + ":" + theSec, { fontsize: "32px", strokeThickness: 1, stroke: "#fe0", fill: "#fe0", align: "center" });
        this.timerText.setScrollFactor(0);
    },


    updateTimerDisplay: function () {
        if (theSec < 10) {
            theSec = "0" + theSec.toString();
        }

        this.timerText.setText("Time Left: " + theMin + ":" + theSec);
    },


    /* **************************************************************
     * ***************** Volcano Timer ******************************
     * *************************************************************** */
    VolcanoTimer: function (bPrintNow) {

        // Dont do any time related stuff unless the game is started.
        // Have to put this here because on launch, updates happen so this 
        // would get started without the game started flag..
        if (G_bGameStarted) {

            let newTime = Date.now();
            let newTimeLeft = 0;

            // calculate time left:
            newTimeLeft = explodeTime - (newTime - startTime);

            if ((newTimeLeft < 20000) && !this.gameOver) {
                G_bShake = true;
                if (!(this.scene.EarthQuakeAudio.isPlaying)) {
                    this.scene.EarthQuakeAudio.play({ loop: true });
                }
            }

            if (bPrintNow || (newTimeLeft > 0 && (timeLeft - newTimeLeft) >= 1000)) {
                // update timer display

                // calculate the global display values.
                theMin = Math.floor((newTimeLeft / 1000) / 60);
                theSec = Math.floor((newTimeLeft / 1000) % 60);

                this.updateTimerDisplay();

                // update global timeLeft
                timeLeft = newTimeLeft;

            }
            else if ((newTimeLeft > -1000) && (newTimeLeft <= 1000)) {
                // volcano starts to blow..
                if (!(this.scene.VolcanoAudio.isPlaying)) {
                    this.scene.VolcanoAudio.play();
                }
            }
            else if (newTimeLeft <= 0) {
                this.scene.VolcanoAudio2.play();

                if (this.scene.EarthQuakeAudio.isPlaying) {
                    this.scene.EarthQuakeAudio.stop();
                }

                this.ShipwreckedGameOver(this.scene, true);
                // stop earthquake audio...
            }
        }// end if game started. 

    }, // end VolcanoTimer


    /* **************************************************************
    * ********* Shipwrecked Game Over ******************************
    * *************************************************************** */
    ShipwreckedGameOver: function (callingScene, bVolcano) {

        /* ------------------------------------------------------------------------------
         * NOTE: transition function does not exist in our version.It does in the next but
         * in the next, the dialog plug in code is broken.
         * ***************************************************************** */
        // stop all environment audios except volcano...
        if (callingScene.OceanAudio) {
            if (callingScene.OceanAudio.isPlaying) {
                callingScene.OceanAudio.stop();
            }
        }
        if (callingScene.JungleAudio) {
            if (callingScene.JungleAudio.isPlaying) {
                callingScene.JungleAudio.stop();
            }
        }
        if (callingScene.BoarAudio) {
            if (callingScene.BoarAudio.isPlaying) {
                callingScene.BoarAudio.stop();
            }
        }
        if (callingScene.SheepAudio) {
            if (callingScene.SheepAudio.isPlaying) {
                callingScene.SheepAudio.stop();
            }
        }
        if (callingScene.HeadChopAudio) {
            if (callingScene.HeadChopAudio.isPlaying) {
                callingScene.HeadChopAudio.stop();
            }
        }
        if (callingScene.ChopWoodAudio) {
            if (callingScene.ChopWoodAudio.isPlaying) {
                callingScene.ChopWoodAudio.stop();
            }
        }
        if (callingScene.JungleChopAudio) {
            if (callingScene.JungleChopAudio.isPlaying) {
                callingScene.JungleChopAudio.stop();
            }
        }
        if (callingScene.PickAxeAudio) {
            if (callingScene.PickAxeAudio.isPlaying) {
                callingScene.PickAxeAudio.stop();
            }
        }
        if (callingScene.HallelujahAudio) {
            if (callingScene.HallelujahAudio.isPlaying) {
                callingScene.HallelujahAudio.stop();
            }
        }
        if (callingScene.EarthQuakeAudio) {
            if (callingScene.EarthQuakeAudio.isPlaying) {
                callingScene.EarthQuakeAudio.stop();
            }
        }



        // scene specific audios
        if (callingScene.LavaAudio) {

            if (callingScene.LavaAudio.isPlaying) {
                callingScene.LavaAudio.stop();
            }

        }

        if (callingScene.SizzlingAudio) {

            if (callingScene.SizzlingAudio.isPlaying) {
                callingScene.SizzlingAudio.stop();
            }

        }

        if (callingScene.ForestFireAudio) {

            if (callingScene.ForestFireAudio.isPlaying) {
                callingScene.ForestFireAudio.stop();
            }

        }



        callingScene.scene.bringToTop("DeathScene");
        callingScene.scene.setActive("DeathScene");
        callingScene.scene.setVisible("DeathScene");


        callingScene.scene.setActive(false);
        callingScene.scene.setVisible(false);
        callingScene.scene.sleep();
        callingScene.setSleepFlag(true);

        // get manager to enable killing old scenes.
        let manager = callingScene.scene.manager;

        // set text box text for DeathScene if from volcano.
        if (bVolcano) {
            manager.getScene("DeathScene").dialogBox.setText("The Volcano blew up!  Alas!  You have died!");
        }

        // now remove them.
        manager.remove("ShipConstruction");
        manager.remove("Shipwreck");
        manager.remove("Shipwreck2");
        manager.remove("Shipwreck3");
        manager.remove("Shipwreck4");

        this.gameOver = true;

    } // end ShipwreckedGameOver


}// end plugin prototype


