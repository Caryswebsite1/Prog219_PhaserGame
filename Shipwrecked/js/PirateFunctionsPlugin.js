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
    // cargoShipCombat(thePlayer, cargoShip)
    //
    // Description: Handler for when player and cargo ship fight.
    // Can be called due to a player click if player is within
    // cannon range.
    // -----------------------------------------------------------
    cargoShipCombat(thePlayer, cargoShip) {
        // use manager to get current scene and check if sleeping.
        var callingScene = this.scene.scene.manager.getScene(this.scene.scene.key);
        // nothing seems to keep scenes from getting input.. have to check in click handlers too!
        if (callingScene.isSleepFlagSet()) {
            return;
        }


        // Check if player is in range.  If so then check if player
        // has any cannon.  If so always get a shot with cannon.  
        // Then if cargoship not sunk, check if this overlap, if so
        // initiate hand to hand.  Eliminate cargo crew vs pirate crew.. 
        // 1 pirate crew elim for every 10 cargo crew..??
        // when cargo crew dead, cargo ship sinks, gold credited to player.
        // 
        // IF Not overlap, cargo ship shoots back.  Strength depends on cargoship size.
        // canoe = 1 cannon, Schooner = 2 cannon, Brig = 4 cannon, Galleon = 10 cannon
        // after return fire, check if player sunk.
        // cargo ship will only return fire, never auto fire on player.
        //

        //console.log("in cargoshipcombat.  Cargoship hit points: " + cargoShip.Ship.hitPoints);
        // if player in range, shoot cannon!.
        if (
            (Math.abs((thePlayer.x - cargoShip.x)) <= cannonRange) &&
            (Math.abs((thePlayer.y - cargoShip.y)) <= cannonRange)
        ) {
            if (playerShip.cannon > 0) {
                // #############  NEED TO DISPLAY PLAYER SHOOTING AND 
                this.scene.CannonAudio1.volume = 0.7;
                this.scene.CannonAudio2.volume = 0.7;

                this.scene.CannonAudio1.play();
                this.scene.CannonAudio2.play({ delay: 0.5 });
                //############## Cargo Ship getting hit..
                let damageToCargoShip = playerShip.cannon * 10;
                cargoShip.Ship.hitPoints -= damageToCargoShip;

                if (cargoShip.Ship.hitPoints <= 0) {
                    // cargoShip sinks, player gets gold.
                    Gold += cargoShip.Ship.gold;
                    cargoShip.destroy();
                    this.updateSailingDisplay();
                } else {
                    // cargoShip returns fire!
                    this.scene.CannonAudio1.volume = 0.7;
                    this.scene.CannonAudio2.volume = 0.7;

                    this.scene.CannonAudio1.play();
                    this.scene.CannonAudio2.play({ delay: 0.5 });
                    //###############  DISPLAY CARGOSHIP FIREING AND PLAYER GETTING HIT
                    let damageToPlayer = cargoShip.Ship.cannon * 10;

                    // check for ironplate.
                    if (playerShip.bIronPlate) {
                        damageToPlayer = Math.floor(damageToPlayer * IronPlateModifier);
                    }

                    playerShip.hitPoints -= damageToPlayer;
                    this.updateSailingDisplay();

                    if (playerShip.hitPoints <= 0) {
                        // Player Sinks!! Game over!!
                        // play drowning audio
                        // sink ship..

                        //stop movement on screen
                        this.scene.physics.pause();

                        this.scene.gameOver = true;
                        this.scene.dialogBox.setText("Alas! You have died!");
                        this.scene.sys.PirateFunctions.PirateGameOver(this.scene);

                    } // end if player sinks
                } // end cargoship returns fire

            } // end if player has cannon.
            else {
                // check for close range and if so, initiate hand to hand..
                if (
                    (Math.abs((thePlayer.x - cargoShip.x)) <= 25) &&
                    (Math.abs((thePlayer.y - cargoShip.y)) <= 25)
                ) {
                    // #### Implement hand to hand if desired here.. #####

                }

            } // end else hand to hand 
        } // end if in cannon range
        else {
            this.scene.dialogBox.setText("I am too far away from that to do anything.");
            //console.log("NOPE NOT close enough!");
        }

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
        // use manager to get current scene and check if sleeping.
        var callingScene = this.scene.scene.manager.getScene(this.scene.scene.key);
        // nothing seems to keep scenes from getting input.. have to check in click handlers too!
        if (callingScene.isSleepFlagSet()) {
            return;
        }

        // Check if player is in range.  If so then check if player
        // has any cannon.  If so always get a shot with cannon.  
        // Then if Hunter not sunk, check if this overlap, if so
        // initiate hand to hand.  Eliminate Hunter crew vs pirate crew.. 
        // 1 pirate crew elim for every 2 hunter crew..??
        // when Hunter crew dead, Hunter ship sinks, gold credited to player.
        // 
        // IF Not overlap, Hunter ship shoots back.  Hunter Ships are always Frigates..
        // Cannon = 20;
        // after return fire, check if player sunk.
        // Hunter ship will return fire, then if in range, will fire on player every 2 seconds.
        //

        // if player in range, shoot cannon!.
        if (
            (Math.abs((thePlayer.x - hunter.x)) <= cannonRange) &&
            (Math.abs((thePlayer.y - hunter.y)) <= cannonRange)
        ) {

            if (playerShip.cannon > 0) {
                // #############  NEED TO DISPLAY PLAYER SHOOTING AND 
                this.scene.CannonAudio1.volume = 0.7;
                this.scene.CannonAudio2.volume = 0.7;

                this.scene.CannonAudio1.play();
                this.scene.CannonAudio2.play({ delay: 0.5 });

                //############## Hunter Ship getting hit..
                let damageToHunter = playerShip.cannon * 10;
                hunter.Ship.hitPoints -= damageToHunter;

                if (hunter.Ship.hitPoints <= 0) {
                    // hunter sinks, player gets gold.
                    Gold += hunter.Ship.gold;
                    hunter.destroy();
                    this.updateSailingDisplay();
                    this.scene.dialogBox.setText("ARG! We sank the scurvy Pirate Hunters we did!");
                } else {
                    // hunter returns fire!
                    this.scene.CannonAudio1.volume = 0.7;
                    this.scene.CannonAudio2.volume = 0.7;

                    this.scene.CannonAudio1.play();
                    this.scene.CannonAudio2.play({ delay: 0.25 });

                    //###############  DISPLAY HUNTER SHIP FIREING AND PLAYER GETTING HIT
                    let damageToPlayer = hunter.Ship.cannon * 10;

                    // check for ironplate.
                    if (playerShip.bIronPlate) {
                        damageToPlayer = Math.floor(damageToPlayer * IronPlateModifier);
                    }

                    playerShip.hitPoints -= damageToPlayer;

                    this.updateSailingDisplay();

                    if (playerShip.hitPoints <= 0) {
                        // Player Sinks!! Game over!!
                        // play drowning audio
                        // sink ship..

                        //stop movement on screen
                        this.scene.physics.pause();

                        this.scene.gameOver = true;
                        this.scene.dialogBox.setText("Alas! You have died!");
                        this.scene.sys.PirateFunctions.PirateGameOver(this.scene);

                    } // end if player sinks
                } // end hunter returns fire

            } // end if player has cannon.
            else {
                // check for close range and if so, initiate hand to hand..
                if (
                    (Math.abs((thePlayer.x - hunter.x)) <= 25) &&
                    (Math.abs((thePlayer.y - hunter.y)) <= 25)
                ) {
                    // #### Implement hand to hand if desired here.. #####

                }

            } // end else hand to hand 
        } // end if in cannon range
        else {
            this.dialogBox.setText("I am too far away from that to do anything.");
            //console.log("NOPE NOT close enough!");
        }

    }, // end PirateHunterCombat


    // ---------------------------------------------------------
    // HunterAttack(thePlayer, hunter)
    //
    // Description: Function for when Pirate Hunter attacks the player
    // from range.  Started if the player gets too close to the
    // Pirate Hunter and stays in range for 2 seconds.  Called by
    // the PirateSailing Scene via a function call from its update
    // function.
    // Will be active if the Pirate Hunter's ship overlaps
    // the player's. See also PirateHunterCombat.
    // -----------------------------------------------------------
    HunterAttack: function (thePlayer, hunter) {
        // use manager to get current scene and check if sleeping.
        var callingScene = this.scene.scene.manager.getScene(this.scene.scene.key);
        // nothing seems to keep scenes from getting input.. have to check in click handlers too!
        if (callingScene.isSleepFlagSet()) {
            return;
        }


        // Hunter shoots player at range.  
        // Then if player not sunk, check if this overlap, if so
        // initiate hand to hand.  Eliminate Hunter crew vs pirate crew.. 
        // 1 pirate crew elim for every 2 hunter crew..??
        // when Hunter crew dead, Hunter ship sinks, no gold on hunter ships.
        // if pirate crew dead, player ship sinks, end of game.
        // 
        // IF Not overlap, up to player to shoot back.  Not automatic.
        // Hunter Ships are always Frigates..
        // Cannon = 20;

        // If this gets called, player was in range long enough.

        // hunter fires on Player:
        // play cannon shot audio
        //###############  DISPLAY Hunter FIREING AND PLAYER GETTING HIT

        //Hunter fireing display:
        this.scene.muzzleFlash.x = hunter.x;
        this.scene.muzzleFlash.y = hunter.y;
        this.scene.muzzleFlash.setVisible(true);
        this.wait(150);
        this.scene.muzzleFlash.setVisible(false);

        this.scene.CannonAudio1.volume = 0.7;
        this.scene.CannonAudio2.volume = 0.7;

        this.scene.CannonAudio1.play();
        this.scene.CannonAudio2.play({ delay: 0.25 });

        //console.log("hunter Fires!");
        // Player getting hit display


        // damage determination
        let damageToPlayer = 0;
        //console.log('hunter ship is: ' + hunter.Ship);
        //console.log('hunter Cannon are: ' + hunter.Ship.cannon);

        damageToPlayer = hunter.Ship.cannon * 10;
        //console.log('initial damage to player: ' + damageToPlayer);

        // check for ironplate.
        if (playerShip.bIronPlate) {
            damageToPlayer = Math.floor(damageToPlayer * IronPlateModifier);
        }
        //console.log('After Iron Plate,  damage to player: ' + damageToPlayer);

        playerShip.hitPoints -= damageToPlayer;
        //console.log('After damage, playerShip hitpoints: ' + playerShip.hitPoints);
        this.updateSailingDisplay();

        if (playerShip.hitPoints <= 0) {
            // Player Sinks!! Game over!!
            // play drowning audio
            // sink ship..

            //stop movement on screen
            this.scene.physics.pause();

            this.scene.gameOver = true;
            this.scene.dialogBox.setText("Alas! You have died!");
            this.scene.sys.PirateFunctions.PirateGameOver(this.scene);

        } // end if player sinks

        // check for close range and if so, initiate hand to hand..
        if (
            (Math.abs((thePlayer.x - hunter.x)) <= 25) &&
            (Math.abs((thePlayer.y - hunter.y)) <= 25)
        ) {
            // #### Implement hand to hand if desired here.. #####

        }

    }, // end HunterAttack






    //--------------------------------------------------------------
    // onGameObjectClicked(pointer, gameObject)
    //
    // Description:  A call back.  Called when any interactive object is clicked...
    // 
    // --------------------------------------------------------------
    onGameObjectClicked: function (pointer, gameObject) {
        //console.log("made it into PirateFunctions onGameObjectClicked. ");

        switch (gameObject.name) {
            case "pirateIntroContinueBtn":
                // use manager to get current scene and check if sleeping.
                var callingScene = this.scene.manager.getScene(this.scene.key);
                // nothing seems to keep scenes from getting input.. have to check in click handlers too!
                if (callingScene.isSleepFlagSet()) {
                    return;
                }


                var portScene = this.scene.manager.getScene("Tortuga");
                //console.log("in pirateIntroContinueBtn Handler. getScene Results: " + portScene.scene.key);
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
                // use manager to get current scene and check if sleeping.
                var callingScene = this.scene.manager.getScene(this.scene.key);
                // nothing seems to keep scenes from getting input.. have to check in click handlers too!
                if (callingScene.isSleepFlagSet()) {
                    return;
                }


                var sailScene = this.scene.manager.getScene("PirateSailing");
                //console.log("in pirateSetSailBtn Handler. getScene Results: " + sailScene.scene.key);
                this.scene.wake("PirateSailing");
                this.scene.bringToTop("PirateSailing");
                this.scene.setActive(true, "PirateSailing");
                this.scene.setVisible(true, "PirateSailing");
                sailScene.setSleepFlag(false);


                // attempt to decrease camera size for Tortuga..
                this.cameras.main.setSize(500, 400);

                //console.log("in SetsailBtn handler. the this is scene: " + this.scene.key);
                this.scene.setActive(false);
                this.scene.setVisible(false);
                this.scene.sleep();
                this.setSleepFlag(true);

                break; // end pirateSetSailBtn


            case "pirateRetireBtn":
                // use manager to get current scene and check if sleeping.
                var callingScene = this.scene.manager.getScene(this.scene.key);
                // nothing seems to keep scenes from getting input.. have to check in click handlers too!
                if (callingScene.isSleepFlagSet()) {
                    return;
                }


                var retireScene = this.scene.manager.getScene("PirateRetire");
                //console.log("in pirateRetireBtn Handler. getScene Results: " + retireScene.scene.key);
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
                manager.remove("DeathScene");

                //console.log("just leaving of PirateRetire handler.");
                break; // end pirateRetireBtn


            case "cargoShip":
                // use manager to get current scene and check if sleeping.
                var callingScene = this.scene.manager.getScene(this.scene.key);
                // nothing seems to keep scenes from getting input.. have to check in click handlers too!
                if (callingScene.isSleepFlagSet()) {
                    return;
                }


                if (playerShip.cannon <= 0) {
                    if (
                        (Math.abs((this.player.x - gameObject.x)) <= cannonRange) &&
                        (Math.abs((this.player.y - gameObject.y)) <= cannonRange)
                    ) {
                        //this.SheepAudio.play();
                        this.dialogBox.setText("I don't have any cannons!  I can't shoot that ship!");
                        //console.log("no cannons to shoot with");
                    } else {
                        //this.CannonShotsAudio.play();
                        this.dialogBox.setText("I am too far away from that to do anything.");
                    }
                } else {
                    ////console.log("in else for cargoShip, Check to see if close enough!");

                    ////console.log("player x: " + this.player.x + "  player y: " + this.player.y);
                    ////console.log("cargoship x: " + gameObject.x + "  cargoship y: " + gameObject.y);
                    // if player close to ship piece then do battle!.
                    if (
                        (Math.abs((this.player.x - gameObject.x)) <= cannonRange) &&
                        (Math.abs((this.player.y - gameObject.y)) <= cannonRange)
                    ) {
                        // close enough to shoot!
                        this.sys.PirateFunctions.cargoShipCombat(this.player, gameObject);
                    } else {
                        this.dialogBox.setText("I am too far away from that to do anything.");
                        //console.log("NOPE NOT close enough!");
                    }

                } // end else
                break; // end cargoship



            case "hunterShip":
                // use manager to get current scene and check if sleeping.
                var callingScene = this.scene.manager.getScene(this.scene.key);
                // nothing seems to keep scenes from getting input.. have to check in click handlers too!
                if (callingScene.isSleepFlagSet()) {
                    return;
                }


                if (playerShip.cannon <= 0) {
                    if (
                        (Math.abs((this.player.x - gameObject.x)) <= cannonRange) &&
                        (Math.abs((this.player.y - gameObject.y)) <= cannonRange)
                    ) {
                        //this.SheepAudio.play();
                        this.dialogBox.setText("I don't have any cannons!  I can't shoot that ship!");
                        //console.log("no cannons to shoot with");
                    } else {
                        //this.CannonShotsAudio.play();
                        this.dialogBox.setText("I am too far away from that to do anything.");
                    }
                } // end if player doesn't have cannons
                else {
                    //console.log("in else for hunterShip, Check to see if close enough!");

                    ////console.log("player x: " + this.player.x + "  player y: " + this.player.y);
                    ////console.log("hunterShip x: " + gameObject.x + "  hunterShip y: " + gameObject.y);
                    // if player close to ship piece then do battle!.
                    if (
                        (Math.abs((this.player.x - gameObject.x)) <= cannonRange) &&
                        (Math.abs((this.player.y - gameObject.y)) <= cannonRange)
                    ) {
                        // close enough to shoot!
                        this.sys.PirateFunctions.PirateHunterCombat(this.player, gameObject);
                    } else {
                        this.dialogBox.setText("I am too far away from that to do anything.");
                        //console.log("NOPE NOT close enough!");
                    }

                } // end else
                break; // end hunterShip



            case "TortugaPort":
                // use manager to get current scene and check if sleeping.
                var callingScene = this.scene.manager.getScene(this.scene.key);
                // nothing seems to keep scenes from getting input.. have to check in click handlers too!
                if (callingScene.isSleepFlagSet()) {
                    return;
                }


                //console.log("TortugaPort Clicked.. Check to see if close enough!");

                //console.log("player x: " + this.player.x + "  player y: " + this.player.y);
                //console.log("port x: " + gameObject.x + "  port y: " + gameObject.y);

                if (
                    (Math.abs((this.player.x - gameObject.x)) <= 40) &&
                    (Math.abs((this.player.y - gameObject.y)) <= 40)
                ) {
                    // close enough to go to port!
                    var portScene = this.scene.manager.getScene("Tortuga");
                    //console.log("in TortugaPort click Handler. getScene Results: " + portScene.scene.key);
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

                } else {
                    this.dialogBox.setText("I am too far away from that to do anything.");
                    //console.log("NOPE NOT close enough!");
                }

                break; // TortugaPort


            // ******* buy a ship with gold: ********
            case "buyCanoeWGold":
                // use manager to get current scene and check if sleeping.
                var callingScene = this.scene.manager.getScene(this.scene.key);
                // nothing seems to keep scenes from getting input.. have to check in click handlers too!
                if (callingScene.isSleepFlagSet()) {
                    return;
                }


                if (Gold >= 3) {
                    Gold -= 3;

                    // update gold for trade in at 25%
                    Gold += this.sys.PirateFunctions.tradeInRebate();

                    playerShip = new BoatConstructor(1, 5, 25, 0, 0, 0, 0);

                    // update display
                    this.sys.PirateFunctions.updateTortugaDisplay();

                } else {
                    this.dialogBox.setText("You don't have enough Gold for a Canoe!");
                    //console.log("No gold for canoe!");
                }
                break;

            case "buySchoonerWGold":
                // use manager to get current scene and check if sleeping.
                var callingScene = this.scene.manager.getScene(this.scene.key);
                // nothing seems to keep scenes from getting input.. have to check in click handlers too!
                if (callingScene.isSleepFlagSet()) {
                    return;
                }


                if (Gold >= 50) {
                    Gold -= 50;

                    // update gold for trade in at 25%
                    Gold += this.sys.PirateFunctions.tradeInRebate();

                    playerShip = new BoatConstructor(15, 10, 40, 0, 0, 0, 0);

                    // update display
                    this.sys.PirateFunctions.updateTortugaDisplay();

                } else {
                    this.dialogBox.setText("You don't have enough Gold for a Schooner!");
                    //console.log("No gold for schooner!");
                }
                break;

            case "buyBrigWGold":
                // use manager to get current scene and check if sleeping.
                var callingScene = this.scene.manager.getScene(this.scene.key);
                // nothing seems to keep scenes from getting input.. have to check in click handlers too!
                if (callingScene.isSleepFlagSet()) {
                    return;
                }


                if (Gold >= 500) {
                    Gold -= 500;

                    // update gold for trade in at 25%
                    Gold += this.sys.PirateFunctions.tradeInRebate();

                    playerShip = new BoatConstructor(30, 25, 50, 0, 0, 0, 0);

                    // update display
                    this.sys.PirateFunctions.updateTortugaDisplay();

                } else {
                    this.dialogBox.setText("You don't have enough Gold for a Brig!");
                    //console.log("No gold for brig!");
                }
                break;

            case "buyFrigateWGold":
                // use manager to get current scene and check if sleeping.
                var callingScene = this.scene.manager.getScene(this.scene.key);
                // nothing seems to keep scenes from getting input.. have to check in click handlers too!
                if (callingScene.isSleepFlagSet()) {
                    return;
                }


                if (Gold >= 1000) {
                    Gold -= 1000;

                    // update gold for trade in at 25%
                    Gold += this.sys.PirateFunctions.tradeInRebate();

                    playerShip = new BoatConstructor(50, 60, 75, 0, 0, 0, 0);

                    // update display
                    this.sys.PirateFunctions.updateTortugaDisplay();

                } else {
                    this.dialogBox.setText("You don't have enough Gold for a Frigate!");
                    //console.log("No gold for frigate!");
                }
                break;


            // ******* Buy Iron Plate ********
            case "buyIronPlateBtn":
                // use manager to get current scene and check if sleeping.
                var callingScene = this.scene.manager.getScene(this.scene.key);
                // nothing seems to keep scenes from getting input.. have to check in click handlers too!
                if (callingScene.isSleepFlagSet()) {
                    return;
                }


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

                        // update display
                        this.sys.PirateFunctions.updateTortugaDisplay();

                    } else {
                        this.dialogBox.setText("You don't have enough Gold for Iron Plate!");
                        //console.log("No gold for iron plate!");
                    }
                } // end if no iron plate yet
                else {
                    this.dialogBox.setText("Your ship already has Iron Plate");
                    //console.log("ship already has iron plate");
                }
                break;


            // ******* Buy Cannon ********
            case "buyCannonBtn":
                // use manager to get current scene and check if sleeping.
                var callingScene = this.scene.manager.getScene(this.scene.key);
                // nothing seems to keep scenes from getting input.. have to check in click handlers too!
                if (callingScene.isSleepFlagSet()) {
                    return;
                }


                if (Gold >= 5) {
                    if ((playerShip.maxCannon - playerShip.cannon) > 0) {
                        // have gold and room. ok to buy.
                        Gold -= 5;
                        playerShip.cannon += 1;

                        // update display
                        this.sys.PirateFunctions.updateTortugaDisplay();

                    } else {
                        this.dialogBox.setText("There isn't room for more cannon!");
                        //console.log("No room for cannon!");
                    }
                } else {
                    this.dialogBox.setText("You don't have enough Gold for a cannon!");
                    //console.log("No gold for cannon!");

                }
                break;


            // ******* Repair Ship ********
            case "repairShipBtn":
                // use manager to get current scene and check if sleeping.
                var callingScene = this.scene.manager.getScene(this.scene.key);
                // nothing seems to keep scenes from getting input.. have to check in click handlers too!
                if (callingScene.isSleepFlagSet()) {
                    return;
                }

                // repair the players ship for as much gold as they have or however much it takes.
                let cost = Math.floor((playerShip.maxHitPoints - playerShip.hitPoints) / 5);
                //console.log("cost for repair is: " + cost);

                if (Gold >= cost) {
                    playerShip.hitPoints = playerShip.maxHitPoints;
                    Gold -= cost;
                    this.dialogBox.setText("Ship fully repaired for: " + cost + " gold.");
                } else {
                    let ptsRepairable = Gold * 5;
                    playerShip.hitPoints += ptsRepairable;
                    Gold = 0;
                    this.dialogBox.setText("Repaired as much as you had gold for.");
                }

                // update display
                this.sys.PirateFunctions.updateTortugaDisplay();

                break; // end repair ship.



            default:
                break;

        } // end switch


    }, // end onGameObjectClicked


    /* **********************************************************************************************************
     ***********  Text Display initalization functions:  All scenes must call these to enable their display *********
     ************************************************************************************************************ */
    sailingTextFunction: function () {

        SailingStyle = { font: "20px Courier", strokeThickness: 1, stroke: "#fe0", fill: "#fe0", shadowStroke: true, shadowFill: true, shadowColor: "#000", shadowOffsetX: 1, shadowOffsetY: 1, align: "center" };

        //this.sailingGoldText = this.scene.add.text(50, 10, "Gold: " + Gold, { fontsize: "32px", strokeThickness: 1, stroke: "#fe0", fill: "#fe0", shadowStroke: true, shadowFill: true, shadowColor: "#000", shadowOffsetX: 1, shadowOffsetY: 1, align: "center" });
        //this.sailingGoldText.setScrollFactor(0);

        this.sailingGoldText = this.scene.add.text(20, 10, "Gold: " + Gold, SailingStyle);
        this.sailingGoldText.setScrollFactor(0);

        this.sailingShipText = this.scene.add.text(170, 10, 'Ship: ' + playerShip.shipType, SailingStyle);
        this.sailingShipText.setScrollFactor(0);

        this.sailingShipCannonText = this.scene.add.text(350, 10, 'Cannons: ' + playerShip.cannon, SailingStyle);
        this.sailingShipCannonText.setScrollFactor(0);

        this.sailingHitpointsText = this.scene.add.text(20, 40, 'Hull Strength: ' + playerShip.hitPoints, SailingStyle);
        this.sailingHitpointsText.setScrollFactor(0);


    },

    tortugaTextFunction: function () {
        TortugaStyle = { font: "20px Courier", strokeThickness: 1, stroke: "#000", fill: "#000", tabs: [60, 60, 60] };

        this.tortugaGoldText = this.scene.add.text(290, 20, "Gold: ", TortugaStyle);
        this.tortugaGoldText.setScrollFactor(0);

        this.tortugaGoldAmountText = this.scene.add.text(360, 20, Gold, { font: "20px Courier", strokeThickness: 1, stroke: "#fe0", fill: "#fe0", tabs: [60, 60, 60] });
        this.tortugaGoldText.setScrollFactor(0);

        this.tortugaPlayerShipText = this.scene.add.text(420, 20, 'Current Ship: ' + playerShip.shipType, TortugaStyle);
        this.tortugaPlayerShipText.setScrollFactor(0);

        this.tortugaShipCannonText = this.scene.add.text(90, 355, 'Cannons on Board: ' + playerShip.cannon + '  Available Space: ' + (playerShip.maxCannon - playerShip.cannon), TortugaStyle);
        this.tortugaShipCannonText.setScrollFactor(0);

        this.tortugaShipRepairText = this.scene.add.text(370, 415, 'Max Cost: ' + Math.floor((playerShip.maxHitPoints - playerShip.hitPoints) / 5), TortugaStyle);
        this.tortugaShipRepairText.setScrollFactor(0);

    },


    retiredTextFunction: function () {
        RetiredStyle = { font: "20px Courier", strokeThickness: 1, stroke: "#000", fill: "#000", tabs: [60, 60, 60] };

        this.retiredGoldText = this.scene.add.text(250, 20, "Gold: ", RetiredStyle);
        this.retiredGoldText.setScrollFactor(0);

        this.retiredGoldAmountText = this.scene.add.text(320, 20, Gold, { font: "20px Courier", strokeThickness: 1, stroke: "#fe0", fill: "#fe0", tabs: [60, 60, 60] });
        this.retiredGoldText.setScrollFactor(0);

        this.retiredPlayerShipText = this.scene.add.text(420, 20, 'Current Ship: ' + playerShip.shipType, RetiredStyle);
        this.retiredPlayerShipText.setScrollFactor(0);

        this.retiredScoreText = this.scene.add.text(140, 50, 'Pirates Score: ' + PiratesScore, RetiredStyle);
        this.retiredScoreText.setScrollFactor(0);

    },




    /* **********************************************************************************************************
     ***********  Text Display update function:  All scenes should call this on wake to update their displays. *********
     ************************************************************************************************************ */
    updateTortugaDisplay: function () {
        this.tortugaGoldText.setText("Gold: ");
        this.tortugaGoldAmountText.setText(Gold);
        this.tortugaPlayerShipText.setText('Current Ship: ' + playerShip.shipType);
        this.tortugaShipCannonText.setText('Cannons on Board: ' + playerShip.cannon + '  Available Space: ' + (playerShip.maxCannon - playerShip.cannon));
        this.tortugaShipRepairText.setText('Max Cost: ' + Math.floor((playerShip.maxHitPoints - playerShip.hitPoints) / 5), TortugaStyle);

    },

    updateSailingDisplay: function () {
        this.sailingGoldText.setText("Gold: " + Gold);
        this.sailingShipText.setText('Ship: ' + playerShip.shipType);
        this.sailingShipCannonText.setText('Cannons: ' + playerShip.cannon);
        this.sailingHitpointsText.setText('Hull Strength: ' + playerShip.hitPoints);
    },


    updateRetiredDisplay: function () {
        this.retiredGoldText.setText("Gold: ");
        this.retiredGoldAmountText.setText(Gold);
        this.retiredPlayerShipText.setText('Current Ship: ' + playerShip.shipType);
        this.retiredScoreText.setText('Pirates Score: ' + PiratesScore);
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
        //console.log("in updateHearts: Life is: " + playerLife);
        for (i = 0; i < 10; i++) {
            if (i <= playerLife - 1) {
                hearts[i] = this.scene.add.image((20 + (i * 18)), 50, 'singleHeart');
            } else {
                hearts[i] = this.scene.add.image((20 + (i * 18)), 50, 'blankHeart');
            }
            hearts[i].setScrollFactor(0);
        }
    },


    /* **************************************************************
     * tradeInRebate() 
     * 
     * Returns gold value of traded in ship (original cost * 25%)
     * *************************************************************** */
    tradeInRebate: function () {

        let tradeValue = 0;
        switch (playerShip.shipType) {

            case "Canoe":
                tradeValue += 3;
                break;

            case "Schooner":
                tradeValue += 50;
                break;

            case "Brig":
                tradeValue += 500;
                break;

            case "Frigate":
                tradeValue += 1000;
                break;

            default:
                tradeValue += 0;
                break;
        } // end switch

        tradeValue = Math.floor(tradeValue * .25);

        return tradeValue;
    },// end trade in rebate



        /* **************************************************************
         * ***************** Pirate Hunter Spawn Timer ******************
         * *************************************************************** */
        //HunterSpawnTimer: function (bPrintNow) {

        //    // Dont do any time related stuff unless the game is started.
        //    // Have to put this here because on launch, updates happen so this 
        //    // would get started without the game started flag..
        //    if (G_bGameStarted) {

        //        let newTime = Date.now();
        //        let newTimeLeft = 0;

        //        // calculate time left:
        //        newTimeLeft = explodeTime - (newTime - startTime);

        //        if ((newTimeLeft < 20000) && !this.gameOver) {
        //            G_bShake = true;
        //            if (!(this.scene.EarthQuakeAudio.isPlaying)) {
        //                this.scene.EarthQuakeAudio.play({ loop: true });
        //            }
        //        }

        //        if (bPrintNow || (newTimeLeft > 0 && (timeLeft - newTimeLeft) >= 1000)) {
        //            // update timer display

        //            // calculate the global display values.
        //            theMin = Math.floor((newTimeLeft / 1000) / 60);
        //            theSec = Math.floor((newTimeLeft / 1000) % 60);

        //            this.updateTimerDisplay();

        //            // update global timeLeft
        //            timeLeft = newTimeLeft;

        //        }
        //        else if ((newTimeLeft > -1000) && (newTimeLeft <= 1000)) {
        //            // volcano starts to blow..
        //            if (!(this.scene.VolcanoAudio.isPlaying)) {
        //                this.scene.VolcanoAudio.play();
        //            }
        //        }
        //        else if (newTimeLeft <= 0) {
        //            this.scene.VolcanoAudio2.play();

        //            if (this.scene.EarthQuakeAudio.isPlaying) {
        //                this.scene.EarthQuakeAudio.stop();
        //            }

        //            this.ShipwreckedGameOver(this.scene, true);
        //            // stop earthquake audio...
        //        }
        //    }// end if game started. 

        //}, // end VolcanoTimer


        /* **************************************************************
         * ********* wait  utility function ******************************
         * timeToWait in milliseconds
         * *************************************************************** */
        wait: function (timeToWait) {
        startTime = Date.now();
        while ((Date.now() - startTime) < timeToWait) {
            // freeze, do nada
        }
    }, // end wait.




    /* **************************************************************
     * ********* Pirate Game Over ******************************
     * *************************************************************** */
    PirateGameOver: function (callingScene, bVolcano) {
        //console.log("just entered PirateGameOver function");

        /* ------------------------------------------------------------------------------
         * NOTE: transition function does not exist in our version.It does in the latest but
         * in the latest, the dialog plug in code is broken.
         * ***************************************************************** */
        // stop all environment audios...
        if (callingScene.OceanAudio) {
            if (callingScene.OceanAudio.isPlaying) {
                callingScene.OceanAudio.stop();
            }
        }
        //if (callingScene.JungleAudio) {
        //    if (callingScene.JungleAudio.isPlaying) {
        //        callingScene.JungleAudio.stop();
        //    }
        //}
        //if (callingScene.BoarAudio) {
        //    if (callingScene.BoarAudio.isPlaying) {
        //        callingScene.BoarAudio.stop();
        //    }
        //}
        //if (callingScene.SheepAudio) {
        //    if (callingScene.SheepAudio.isPlaying) {
        //        callingScene.SheepAudio.stop();
        //    }
        //}
        //if (callingScene.HeadChopAudio) {
        //    if (callingScene.HeadChopAudio.isPlaying) {
        //        callingScene.HeadChopAudio.stop();
        //    }
        //}
        //if (callingScene.ChopWoodAudio) {
        //    if (callingScene.ChopWoodAudio.isPlaying) {
        //        callingScene.ChopWoodAudio.stop();
        //    }
        //}
        //if (callingScene.JungleChopAudio) {
        //    if (callingScene.JungleChopAudio.isPlaying) {
        //        callingScene.JungleChopAudio.stop();
        //    }
        //}
        //if (callingScene.PickAxeAudio) {
        //    if (callingScene.PickAxeAudio.isPlaying) {
        //        callingScene.PickAxeAudio.stop();
        //    }
        //}
        //if (callingScene.HallelujahAudio) {
        //    if (callingScene.HallelujahAudio.isPlaying) {
        //        callingScene.HallelujahAudio.stop();
        //    }
        //}
        //if (callingScene.EarthQuakeAudio) {
        //    if (callingScene.EarthQuakeAudio.isPlaying) {
        //        callingScene.EarthQuakeAudio.stop();
        //    }
        //}



        //// scene specific audios
        //if (callingScene.LavaAudio) {

        //    if (callingScene.LavaAudio.isPlaying) {
        //        callingScene.LavaAudio.stop();
        //    }

        //}

        //if (callingScene.SizzlingAudio) {

        //    if (callingScene.SizzlingAudio.isPlaying) {
        //        callingScene.SizzlingAudio.stop();
        //    }

        //}

        //if (callingScene.ForestFireAudio) {

        //    if (callingScene.ForestFireAudio.isPlaying) {
        //        callingScene.ForestFireAudio.stop();
        //    }

        //}



        callingScene.scene.bringToTop("DeathScene");
        callingScene.scene.setActive("DeathScene");
        callingScene.scene.setVisible("DeathScene");


        callingScene.scene.setActive(false);
        callingScene.scene.setVisible(false);
        callingScene.scene.sleep();
        callingScene.setSleepFlag(true);

        // get manager to enable killing old scenes.
        let manager = callingScene.scene.manager;

        // handle on deathScene.
        let Death = manager.getScene("DeathScene");

        // set text box text for DeathScene 
        Death.dialogBox.setText("Your Ship has been Sunk!!  Arg!  You're sleeping with the fishes!");

        // Play drowning audio from DeathScene
        Death.DrowningAudio.volume = 0.7;
        Death.DrowningAudio.play();


        // now remove them.
        manager.remove("Tortuga");
        manager.remove("PirateSailing");
        manager.remove("PirateRetire");

        this.gameOver = true;

    } // end PirateGameOver


} // end plugin prototype