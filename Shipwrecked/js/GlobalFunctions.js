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
            this.dialogBox.setText("Take that boar!  Ha!");
        } else {

            // no machete == Ouch Time! drop life by 5!
            playerLife -= 5;
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
                        //############### NEED A CHOPPING SOUND HERE #################
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

                        this.dialogBox.setText("I can't sheer these sheep with my bare hands!");
                        console.log("can't sheer these sheep with bare hands");
                    }
                    else {
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
                        //############### NEED A sheep dieing SOUND HERE #################
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
                        //############### NEED A sheep dieing SOUND HERE #################
                        this.dialogBox.setText("Chop! Chop! Chop! Tiiiimmmmmbbbbbeeerrrrrr!");

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
                        //############### NEED A sheep dieing SOUND HERE #################
                        this.dialogBox.setText("Thunk... Thunk.. Thunk.. Whew! Pounding Rocks is Hard!");

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
                        // close enough to chop!
                        //############### NEED A sheep dieing SOUND HERE #################
                        this.dialogBox.setText("Thunk... Thunk.. Thunk.. Whew! Pounding Rocks is Hard!");

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

                // save player location in global.
                playerStartX = this.player.x;
                playerStartY = this.player.y;


                this.scene.setActive(false);
                this.scene.setVisible(false);
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

                this.scene.setActive(false);
                this.scene.setVisible(false);
                this.scene.sleep();
                this.setSleepFlag(true);

                break; // end ShipBackBtn


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
    }
}