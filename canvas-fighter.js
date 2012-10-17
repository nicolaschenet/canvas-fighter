$(function () {

	var CanvasFighter = function () {

        // Default options

        var   width         = 800
            , height        = 600
            , floorY        = 50
            , c             = document.getElementById("stage")
            , ctx           = c.getContext("2d")
            , gLoop
            , self          = this
        ;


        // Let's set canvas dimensions

        c.width     = width;
        c.height    = height;


        // Clearing of the canvas, will be called on each frame

        var clear = function () {
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.rect(0, 0, width, height);
            ctx.closePath();
            ctx.fill();
        };

        var Fighter = function () {

            var   sprite        = new Image()
                , self          = this
            ;

            // ATM, the only fighter provided is Ryu

            // This sprite has to be redesigned in order to be efficient
            sprite.src          = "sprites/Ryu.gif";

            self.name           = "Ryu";
            self.width          = 76;
            self.height         = 120;

            self.x              = 0;
            self.y              = 0;

            self.state          = "idle";

            var Animator = function () {

                this.speed             = 3;
                this.frameCounter      = 0;
                this.currentFrame      = 0;
                this.currentAnimation  = "";

                this.resetState = function () {
                    this.frameCounter = this.currentFrame = 0;
                }

                this.drawFrame = function (frame) {
                    ctx.drawImage (
                        sprite,
                        frame.x,
                        frame.y,
                        self.width,
                        self.height,
                        self.x,
                        self.y,
                        self.width,
                        self.height
                    );
                }

                this.animations = {

                    "entering-stage"  : {

                        keyframes  : [
                              { x : self.width * 0 +10, y : 0 }
                            , { x : self.width * 1 +10, y : 0 }
                            , { x : self.width * 2 +10, y : 0 }
                            , { x : self.width * 3 +10, y : 0 }
                            , { x : self.width * 4 +10, y : 0 }
                            , { x : self.width * 5 +10, y : 0 }
                            , { x : self.width * 6 +10, y : 0 }
                        ]

                        , play  : function () {
                            console.log(self.animator.currentFrame);
                            // This animation is played only once, before the beginning of the fight

                            if ( self.animator.currentFrame < this.keyframes.length ) {

                                // animation is running, go on Baby
                                self.animator.drawFrame(this.keyframes[self.animator.currentFrame]);

                                if ( self.animator.frameCounter == self.animator.speed ) {
                                    self.animator.frameCounter = 0;
                                    self.animator.currentFrame++;

                                } else {
                                    self.animator.frameCounter++;
                                }

                            } else {
                                // Ryu has finished his pre-fight dance, get ready to fight, Challenger !
                                self.setState("ready-to-fight");
                            }
                        }
                    }

                    , "ready-to-fight"  : {

                        keyframes  : [
                        ]

                        , play  : function () {
                            ctx.drawImage(sprite, 32, self.height - 6, self.width, self.height, self.x, self.y, self.width, self.height);
                        }
                    }

                    , "jumping" : {

                    }

                    , "falling" : {

                    }

                    , "walking" : {

                    }

                    , "hadoken" : {

                    }

                    , "shoryuken" : {

                    }
                }
            }

            self.animator = new Animator();

            self.loopAnimation = function () {
                self.animator.animations[self.state].play();
            }


            self.setState = function (state) {
                self.state = state;

                self.animator.resetState();
                self.animator.animations[self.state].play(); // Initial play to avoid blank states

            }

            self.setPosition = function ( x, y ) {
                self.x = x;
                self.y = y;
            }

        };

        var fighter = new Fighter();

        fighter.setPosition( 100, height - fighter.height - floorY );
        fighter.setState("entering-stage");


        var GameLoop = function () {
            clear();
            fighter.loopAnimation();
            gLoop = setTimeout(GameLoop, 1000 / 60);  // Global animation speed is set here
        };


        this.start = function () {
            clear();
            $("#stage").fadeIn(300, function() {
                GameLoop();
            })
        }

	}


    // Let's init our CanvasFighter instance
    var canvasFighter = new CanvasFighter();
    canvasFighter.start();

});