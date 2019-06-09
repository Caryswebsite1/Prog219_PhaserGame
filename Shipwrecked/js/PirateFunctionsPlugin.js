var PirateFunctionsPlugin = function (scene) {
    // the scene that owns the plugin
    this.scene = scene;
    this.systems = scene.sys;

    // these will be set once the scene calls the associate global function below.
    this.goldText = "";


    if (!scene.sys.settings.isBooted) {
        scene.sys.events.once('boot', this.boot, this);
    }
};


// Register this plugin with the PluginManager
PirateFunctionsPlugin.register = function (PluginManager) {
    PluginManager.register('PirateFunctionsPlugin', PirateFunctionsPlugin, 'PirateFunctions');
};


PirateFunctionsPlugin.prototype = {
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
    // cargoShipCombat(cargoShip)
    //
    // Description: Handler for when player and cargo ship fight.
    // Can be called due to a player click OR due to the player's
    // ship and the cargo ship overlapping.  In the later case,
    // we go to hand to hand combat...
    // -----------------------------------------------------------
    cargoShipCombat(cargoShip) {

    //    if (playerInventory.includes("Machete")) {
    //        playerLife -= 1;
    //        hearts[playerLife] = this.add.image((20 + (playerLife * 18)), 50, 'blankHeart');
    //        hearts[playerLife].setScrollFactor(0);
    //        this.HeadChopAudio.play();
    //        this.dialogBox.setText("Take that boar!  Ha!");
    //    } else {

    //        // no machete == Ouch Time! drop life by 5!
    //        this.BoarAudio.play();
    //        playerLife -= 5;
    //        this.dialogBox.setText("ow! Ow! OW!  That Hurt!");
    //    } // end else no machete 

    //    // update hearts: 
    //    this.sys.globalFunctions.updateHearts();

    //    boar.disableBody(true, true);
    //    Gold++;
    //    Food++;
    //    this.sys.globalFunctions.goldText.setText("Gold: " + Gold);
    //    this.sys.globalFunctions.foodText.setText("Food: " + Food);

    //    if (playerLife <= 0) {

    //        // stop movement on screen
    //        this.physics.pause();

    //        // turn player bloody red
    //        thePlayer.setTint(0xff0000);
    //        //this.playerLifeImg.setTexture("noHealth");

    //        // force facing
    //        thePlayer.anims.play("turn");

    //        this.gameOver = true;
    //        this.dialogBox.setText("Alas! You have died!");
    //        this.sys.globalFunctions.ShipwreckedGameOver(this);

    //    } // end if playerLife

    }, // end cargoShipCombat


    // ---------------------------------------------------------
    // PirateHunterCombat(thePlayer, hunter)
    //
    // Description: Handler for when player and Pirate Hunter fight.
    // Can be called due to a player click OR due to the player's
    // ship and the Pirate Hunter overlapping.  In the later case,
    // we go to hand to hand combat...
    // -----------------------------------------------------------
    PirateHunterCombat: function (thePlayer, hunter) {

    //    if (playerInventory.includes("Machete")) {
    //        playerLife -= 1;
    //        hearts[playerLife] = this.add.image((20 + (playerLife * 18)), 50, 'blankHeart');
    //        hearts[playerLife].setScrollFactor(0);
    //        this.HeadChopAudio.play();
    //        this.dialogBox.setText("Take that boar!  Ha!");
    //    } else {

    //        // no machete == Ouch Time! drop life by 5!
    //        this.BoarAudio.play();
    //        playerLife -= 5;
    //        this.dialogBox.setText("ow! Ow! OW!  That Hurt!");
    //    } // end else no machete 

    //    // update hearts: 
    //    this.sys.globalFunctions.updateHearts();

    //    boar.disableBody(true, true);
    //    Gold++;
    //    Food++;
    //    this.sys.globalFunctions.goldText.setText("Gold: " + Gold);
    //    this.sys.globalFunctions.foodText.setText("Food: " + Food);

    //    if (playerLife <= 0) {

    //        // stop movement on screen
    //        this.physics.pause();

    //        // turn player bloody red
    //        thePlayer.setTint(0xff0000);
    //        //this.playerLifeImg.setTexture("noHealth");

    //        // force facing
    //        thePlayer.anims.play("turn");

    //        this.gameOver = true;
    //        this.dialogBox.setText("Alas! You have died!");
    //        this.sys.globalFunctions.ShipwreckedGameOver(this);

    //    } // end if playerLife

    }, // end PirateHunterCombat


    // ---------------------------------------------------------
    // PirateHunterAttack(thePlayer, hunter)
    //
    // Description: Handler for when Pirate Hunter attacks the player
    // from range.  Started if the player gets too close to the
    // Pirate Hunter, regardless if the player attacks..
    // Will not be active if the Pirate Hunter's ship overlaps
    // the player's.  In that case, see PirateHunterCombat.
   // -----------------------------------------------------------
    PirateHunterAttack: function (thePlayer, hunter) {

        //    if (playerInventory.includes("Machete")) {
        //        playerLife -= 1;
        //        hearts[playerLife] = this.add.image((20 + (playerLife * 18)), 50, 'blankHeart');
        //        hearts[playerLife].setScrollFactor(0);
        //        this.HeadChopAudio.play();
        //        this.dialogBox.setText("Take that boar!  Ha!");
        //    } else {

        //        // no machete == Ouch Time! drop life by 5!
        //        this.BoarAudio.play();
        //        playerLife -= 5;
        //        this.dialogBox.setText("ow! Ow! OW!  That Hurt!");
        //    } // end else no machete 

        //    // update hearts: 
        //    this.sys.globalFunctions.updateHearts();

        //    boar.disableBody(true, true);
        //    Gold++;
        //    Food++;
        //    this.sys.globalFunctions.goldText.setText("Gold: " + Gold);
        //    this.sys.globalFunctions.foodText.setText("Food: " + Food);

        //    if (playerLife <= 0) {

        //        // stop movement on screen
        //        this.physics.pause();

        //        // turn player bloody red
        //        thePlayer.setTint(0xff0000);
        //        //this.playerLifeImg.setTexture("noHealth");

        //        // force facing
        //        thePlayer.anims.play("turn");

        //        this.gameOver = true;
        //        this.dialogBox.setText("Alas! You have died!");
        //        this.sys.globalFunctions.ShipwreckedGameOver(this);

        //    } // end if playerLife

    }, // end PirateHunterAttack






    //--------------------------------------------------------------
    // onGameObjectClicked(pointer, gameObject)
    //
    // Description:  A call back.  Called when any interactive object is clicked...
    // 
    // --------------------------------------------------------------
    onGameObjectClicked: function (pointer, gameObject) {
        console.log("made it into New onGameObjectClicked. ");

        switch (gameObject.name) {
            case "pirateIntroContinueBtn":

                var portScene = this.scene.manager.getScene("Tortuga");
                console.log("in pirateIntroContinueBtn Handler. getScene Results: " + portScene.scene.key);
                this.scene.wake("Tortuga");
                this.scene.bringToTop("Tortuga");
                this.scene.setActive(true, "Tortuga");
                this.scene.setVisible(true, "Tortuga");
                portScene.setSleepFlag(false);

                // attempt to increase camera size for tortuga..
                portScene.cameras.main.setSize(800, 600);

                // decrease camera size for the intro
                this.cameras.main.setSize(500, 400);

                this.scene.setActive(false);
                this.scene.setVisible(false);
                this.scene.sleep();
                this.setSleepFlag(true);

                break; // end pirateIntroContinueBtn


            case "pirateSetSailBtn":

                var sailScene = this.scene.manager.getScene("PirateSailing");
                console.log("in pirateSetSailBtn Handler. getScene Results: " + sailScene.scene.key);
                this.scene.wake("PirateSailing");
                this.scene.bringToTop("PirateSailing");
                this.scene.setActive(true, "PirateSailing");
                this.scene.setVisible(true, "PirateSailing");
                sailScene.setSleepFlag(false);


                // attempt to decrease camera size for Tortuga..
                this.cameras.main.setSize(500, 400);

                this.scene.setActive(false);
                this.scene.setVisible(false);
                this.scene.sleep();
                this.setSleepFlag(true);

                break; // end pirateSetSailBtn


            case "pirateRetireBtn":

                var retireScene = this.scene.manager.getScene("PirateRetire");
                console.log("in ConstructBtn Handler. getScene Results: " + retireScene.scene.key);
                this.scene.wake("PirateRetire");
                this.scene.bringToTop("PirateRetire");
                this.scene.setActive(true, "PirateRetire");
                this.scene.setVisible(true, "PirateRetire");
                retireScene.setSleepFlag(false);

                // attempt to increase camera size..
                retireScene.cameras.main.setSize(800, 600);

                // ##################################################
                // ############ Do we want to allow restart?##########
                this.scene.setActive(false);
                this.scene.setVisible(false);
                this.scene.sleep();
                this.setSleepFlag(true);

                // ****** shut down pirate stuff. ********
                // stop all environment audios
                //if (this.OceanAudio) {
                //    if (this.OceanAudio.isPlaying) {
                //        this.OceanAudio.stop();
                //    }
                //}
                //if (this.JungleAudio) {
                //    if (this.JungleAudio.isPlaying) {
                //        this.JungleAudio.stop();
                //    }
                //}

                // get manager to enable killing all the pirate scenes.
                let manager = this.scene.manager;

                // now remove them.
                manager.remove("PirateIntro");
                manager.remove("Tortuga");
                manager.remove("PirateSailing");

                break; // end pirateRetireBtn


            case "cargoShip":

                if (playerShip.cannon <= 0) {
                    if (
                        (Math.abs((this.player.x - gameObject.x)) <= 30) &&
                        (Math.abs((this.player.y - gameObject.y)) <= 30)
                    ) {
                        //this.SheepAudio.play();
                        this.dialogBox.setText("I don't have any cannons!  I can't shoot that ship!");
                        console.log("no cannons to shoot with");
                    }
                    else {
                        //this.CannonShotsAudio.play();
                        this.dialogBox.setText("I am too far away from that to do anything.");
                    }
                }
                else {
                    console.log("in else for cargoShip, Check to see if close enough!");

                    console.log("player x: " + this.player.x + "  player y: " + this.player.y);
                    console.log("cargoship x: " + gameObject.x + "  cargoship y: " + gameObject.y);
                    // if player close to ship piece then do battle!.
                    if (
                        (Math.abs((this.player.x - gameObject.x)) <= 30) &&
                        (Math.abs((this.player.y - gameObject.y)) <= 30)
                    ) {
                        // close enough to shoot!
                        this.sys.PirateFunctions.cargoShipCombat(gameObject);
                    }
                    else {
                        this.dialogBox.setText("I am too far away from that to do anything.");
                        console.log("NOPE NOT close enough!");
                    }

                }// end else
                break; // end sheep


            case "TortugaPort":

                console.log("TortugaPort Clicked.. Check to see if close enough!");

                console.log("player x: " + this.player.x + "  player y: " + this.player.y);
                console.log("port x: " + gameObject.x + "  port y: " + gameObject.y);

                if (
                    (Math.abs((this.player.x - gameObject.x)) <= 60) &&
                    (Math.abs((this.player.y - gameObject.y)) <= 60)
                ) {
                    // close enough to go to port!
                    var portScene = this.scene.manager.getScene("Tortuga");
                    console.log("in TortugaPort click Handler. getScene Results: " + portScene.scene.key);
                    this.scene.wake("Tortuga");
                    this.scene.bringToTop("Tortuga");
                    this.scene.setActive(true, "Tortuga");
                    this.scene.setVisible(true, "Tortuga");
                    portScene.setSleepFlag(false);

                    // attempt to increase camera size..
                    portScene.cameras.main.setSize(800, 600);

                    // put sailing scene to sleep
                    this.scene.setActive(false);
                    this.scene.setVisible(false);
                    this.scene.sleep();
                    this.setSleepFlag(true);

                }
                else {
                    this.dialogBox.setText("I am too far away from that to do anything.");
                    console.log("NOPE NOT close enough!");
                }

                break; // TortugaPort


            // ******* buy a ship with gold: ********
            case "buyCanoeWGold":
                if (Gold >= 3) {
                    Gold -= 3;
                    playerShip = new BoatConstructor(1, 5, 25, 0, 0, 0, 0);;
                }
                else {
                    this.dialogBox.setText("You don't have enough Gold for a Canoe!");
                    console.log("No gold for canoe!");
                }
                break;

            case "buySchoonerWGold":
                if (Gold >= 50) {
                    Gold -= 50;
                    playerShip = new BoatConstructor(15, 10, 40, 0, 0, 0, 0);;
                }
                else {
                    this.dialogBox.setText("You don't have enough Gold for a Schooner!");
                    console.log("No gold for schooner!");
                }
                break;

            case "buyBrigWGold":
                if (Gold >= 500) {
                    Gold -= 500;
                    playerShip = new BoatConstructor(30, 25, 50, 0, 0, 0, 0);;
                }
                else {
                    this.dialogBox.setText("You don't have enough Gold for a Brig!");
                    console.log("No gold for brig!");
                }
                break;

            case "buyFrigateWGold":
                if (Gold >= 1000) {
                    Gold -= 1000;
                    playerShip = new BoatConstructor(50, 60, 75,0, 0, 0, 0);
                }
                else {
                    this.dialogBox.setText("You don't have enough Gold for a Frigate!");
                    console.log("No gold for frigate!");
                }
                break;


            // ******* Buy Iron Plate ********
            case "buyIronPlateBtn":
                if (playerShip.bIronPlate === false) {
                    let cost = 0;
                    switch (playerShip.shipType) {
                        case "Canoe":
                            cost = 2;
                            break;
                        case "Schooner":
                            cost = 10;
                            break;
                        case "Brig":
                            cost = 50;
                            break;
                        case "Frigate":
                            cost = 100;
                            break;

                    } // end switch shipType

                    if (Gold >= cost) {
                        Gold -= cost;
                        playerShip.bIronPlate = true;
                    }
                    else {
                        this.dialogBox.setText("You don't have enough Gold for Iron Plate!");
                        console.log("No gold for iron plate!");
                    }
                }// end if no iron plate yet
                else {
                    this.dialogBox.setText("Your ship already has Iron Plate");
                    console.log("ship already has iron plate");
                }
                break;


            // ******* Buy Cannon ********
            case "buyCannonBtn":
                if (Gold >= 5) {
                    if ((playerShip.maxCannon - playerShip.cannon) > 0) {
                        // have gold and room. ok to buy.
                        Gold -= 5;
                        playerShip.cannon += 1;
                    }
                    else {
                        this.dialogBox.setText("There isn't room for more cannon!");
                        console.log("No room for cannon!");
                    }
                }
                else {
                    this.dialogBox.setText("You don't have enough Gold for a cannon!");
                    console.log("No gold for cannon!");

                }
                break;


            default:
                break;

        }// end switch


    }, // end onGameObjectClicked


    /* **********************************************************************************************************
    ***********  Text Display initalization functions:  All scenes must call these to enable their display *********
    ************************************************************************************************************ */
    sailingGoldTextFunction: function () {
        this.sailingGoldText = this.scene.add.text(50, 10, "Gold: " + Gold, { fontsize: "32px", strokeThickness: 1, stroke: "#fe0", fill: "#fe0", shadowStroke: true, shadowFill: true, shadowColor: "#000", shadowOffsetX: 1, shadowOffsetY: 1, align: "center" });
        this.sailingGoldText.setScrollFactor(0);
    },

    tortugaGoldTextFunction: function () {
        TortugaStyle = { font: "20px Courier", fill: "#000", tabs: [60, 60, 60] };

        this.tortugaGoldText = this.scene.add.text(220, 20, "Gold: " + Gold, TortugaStyle);
        this.tortugaGoldText.setScrollFactor(0);

    },



    /* **********************************************************************************************************
    ***********  Text Display update function:  All scenes should call this on wake to update their displays. *********
    ************************************************************************************************************ */
    updateTortugaDisplay: function () {
        this.tortugaGoldText.setText("Gold: " + Gold);
    },

    updateSailingDisplay: function () {
        this.sailingGoldText.setText("Gold: " + Gold);
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
     * ***************** Pirate Hunter Spawn Timer ******************
     * *************************************************************** */
    HunterSpawnTimer: function (bPrintNow) {

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


