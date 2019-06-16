// JavaScript source code
//const customGameWidth = 800;
var DialogModalPlugin = function (scene) {
    // the scene that owns the plugin
    this.scene = scene;
    this.systems = scene.sys;

    if (!scene.sys.settings.isBooted) {
        scene.sys.events.once('boot', this.boot, this);
    }
};

// Register this plugin with the PluginManager
DialogModalPlugin.register = function (PluginManager) {
    PluginManager.register('DialogModalPlugin', DialogModalPlugin, 'dialogModal');
};

DialogModalPlugin.prototype = {
    // called when the plugin is loaded by the PluginManager
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

    // Initialize the dialog modal
    init: function (opts) {
        // Check to see if any optional parameters were passed
        if (!opts) opts = {};
        // set properties from opts object or use defaults
        this.borderThickness = opts.borderThickness || 3;
        this.borderColor = opts.borderColor || 0x907748;
        this.borderAlpha = opts.borderAlpha || 1;
        this.windowAlpha = opts.windowAlpha || 0.8;
        this.windowColor = opts.windowColor || 0x303030;
        this.windowHeight = opts.windowHeight || 150;
        this.windowWidth = opts.windowWidth || this.scene.sys.game.config.width;
        this.padding = opts.padding || 15;
        this.closeBtnColor = opts.closeBtnColor || 'darkgoldenrod';
        this.textColor = opts.textColor || 'gold';
        this.dialogSpeed = opts.dialogSpeed || 3;
        this.locationX = opts.locationX || null;
        this.locationY = opts.locationY || null;

        // used for animating the text
        this.eventCounter = 0;
        // if the dialog window is shown
        this.visible = true;
        // the current text in the window
        this.text;
        // the text that will be displayed in the window
        this.dialog;
        this.graphics;
        this.closeBtn;

        // Create the dialog window
        this._createWindow();
    },



    // Gets the width of the game (based on the scene)
    _getGameWidth: function () {
        return this.scene.sys.game.config.width;;

    },

    // Gets the height of the game (based on the scene)
    _getGameHeight: function () {
        return this.scene.sys.game.config.height;
    },

    // Calculates dialog window dimentions and placement, can be based on the game size
    _calculateWindowDimensions: function (width, height) {
        var x;
        var y;
        if (this.locationX != null) {
            x = this.locationX;
        }
        else {
            x = this.padding;
        }

        if (this.locationY != null) {
            y = this.locationY;
        }
        else {
            y = height - this.windowHeight - this.padding;
        }
        var rectWidth = this.windowWidth;
        var rectHeight = this.windowHeight;
        return {
            x,
            y,
            rectWidth,
            rectHeight
        };
    },

    // Creates the inner dialog window (where the text is displayed)
    _createInnerWindow: function (x, y, rectWidth, rectHeight) {
        this.graphics.fillStyle(this.windowColor, this.windowAlpha);
        this.graphics.fillRect(x + 1, y + 1, rectWidth - 1, rectHeight - 1);
    },

    // Creates the border rectangle of the dialog window
    _createOuterWindow: function (x, y, rectWidth, rectHeight) {
        this.graphics.lineStyle(this.borderThickness, this.borderColor, this.borderAlpha);
        this.graphics.strokeRect(x, y, rectWidth, rectHeight);
    },

    // Creates the dialog window
    _createWindow: function () {
        //var gameHeight = this._getGameHeight();
        //var gameWidth = this._getGameWidth();
        //var dimensions = this._calculateWindowDimensions(gameWidth, gameHeight);

        var dimensions = this._calculateWindowDimensions(this.windowWidth, this.windowHeight);

        // check for user placement specs:
        if (this.locationX != null) {
            dimensions.x = this.locationX;
        }
        if (this.locationY != null) {
            dimensions.y = this.locationY;
        }

        this.graphics = this.scene.add.graphics();
        this.graphics.scrollFactorX = -0, 7;
        this.graphics.scrollFactorY = 0;

        this._createOuterWindow(dimensions.x, dimensions.y, dimensions.rectWidth, dimensions.rectHeight);
        this._createInnerWindow(dimensions.x, dimensions.y, dimensions.rectWidth, dimensions.rectHeight);

        this._createCloseModalButton();

        this._createCloseModalButtonBorder();
    },


    // Creates the close dialog window button
    _createCloseModalButton: function () {
        var self = this;
        let buttonX = 0;
        let buttonY = 0;

        //buttonX = this._getGameWidth() - this.padding - 6 - this.locationX;
        buttonX = this.windowWidth - this.padding + this.locationX;

        buttonY = this.locationY + 3;

        this.closeBtn = this.scene.make.text({
            x: buttonX,
            y: buttonY,
            text: 'X',
            style: {
                font: 'bold 12px Arial',
                fill: this.closeBtnColor
            }

        }); // end closeBtn text creation.

        this.closeBtn.setInteractive();
        this.closeBtn.setScrollFactor(0);

        this.closeBtn.on('pointerover', function () {
            this.setTint(0xff0000);
        });
        this.closeBtn.on('pointerout', function () {
            this.clearTint();
        });
        this.closeBtn.on('pointerdown', function () {
            self.toggleWindow();
        });


        if (self.timedEvent) self.timedEvent.remove();
        if (self.text) self.text.destroy();

    },


    // Creates the close dialog button border
    _createCloseModalButtonBorder: function () {
        let x = 0;
        let y = 0;

        //x = this._getGameWidth() - this.padding - 13 - this.locationX;
        x = this.windowWidth - this.padding - 6 + this.locationX;
        y = this.locationY + 2;

        this.graphics.strokeRect(x, y, 20, 20);
    },


    // Hide/Show the dialog window
    toggleWindow: function () {
        this.visible = !this.visible;
        if (this.text) this.text.visible = this.visible;
        if (this.graphics) this.graphics.visible = this.visible;
        if (this.closeBtn) this.closeBtn.visible = this.visible;
    },


    // Sets the text for the dialog window
    setText: function (text, animate) {

        // check if dialog is visable.  if not, make it so.
        if (!this.visible) {
            this.toggleWindow();
        }

        // Reset the dialog
        this.eventCounter = 0;
        this.dialog = text.split('');
        if (this.timedEvent) this.timedEvent.remove();

        var tempText = animate ? '' : text;
        this._setText(tempText);
        this.text.setScrollFactor(0);

        if (animate) {
            this.timedEvent = this.scene.time.addEvent({
                delay: 150 - (this.dialogSpeed * 40),
                callback: this._animateText,
                callbackScope: this,
                loop: true
            });
        }
    },


    // Slowly displays the text in the window to make it appear annimated
    _animateText: function () {
        this.eventCounter++;
        this.text.setText(this.text.text + this.dialog[this.eventCounter - 1]);
        this.text.setScrollFactor(0);
        if (this.eventCounter === this.dialog.length) {
            this.timedEvent.remove();
        }
    },


    // Calcuate the position of the text in the dialog window
    _setText: function (newText) {
        // Reset the dialog
        if (this.text) this.text.destroy();

        let x = this.locationX + this.padding + 20;
        let y = this.locationY + this.padding + 10;

        //this.text = this.scene.add.text(x, y, newText, {
        //    fontsize: "32px", strokeThickness: 1, stroke: this.textColor, fill: this.textColor, align: "center",
        //    wordWrap: { width: this._getGameWidth() - (this.padding * 2) - 25 }
        //});
        this.text = this.scene.add.text(x, y, newText, {
            fontsize: "32px", strokeThickness: 1, stroke: this.textColor, fill: this.textColor, align: "center",
            wordWrap: { width: this.windowWidth - (this.padding * 2) - 25 }
        });

    },


    // adds text in the dialog window starting at the specified location.
    // Does NOT destroy previous contents.
    addTextLine: function (x, y, text, animate) {


        let xLoc = this.locationX + this.padding + x;
        let yLoc = this.locationY + this.padding + y;

        // check if dialog is visable.  if not, make it so.
        if (!this.visible) {
            this.toggleWindow();
        }

        // Reset the dialog
        this.eventCounter = 0;
        this.dialog = text.split('');
        if (this.timedEvent) this.timedEvent.remove();

        var tempText = animate ? '' : text;
        //this._setText(tempText);
        this.text = this.scene.add.text(xLoc, yLoc, tempText, {
            fontsize: "32px", strokeThickness: 1, stroke: this.textColor, fill: this.textColor, align: "left",
            wordWrap: { width: this.windowWidth - (this.padding * 2) - 25 }
        });
        this.text.setScrollFactor(0);

        if (animate) {
            this.timedEvent = this.scene.time.addEvent({
                delay: 150 - (this.dialogSpeed * 40),
                callback: this._animateText,
                callbackScope: this,
                loop: true
            });
        }
    },// end _setText


};
