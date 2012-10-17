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

            self.animation =  {

                  interval          : 4
                , frameCounter      : 0
                , currentFrame      : 0
                , currentAnimation  : ""

                , resetState        : function () {
                    this.frameCounter = this.currentFrame = 0;
                }

                , "entering-stage"  : {
                    frames  : 7
                    , play  : function () {

                        // This animation is played only once, before the beginning of the fight

                        if ( self.animation.currentFrame < this.frames ) {

                            // Animation is running, go on Baby
                            if ( self.animation.frameCounter == self.animation.interval ) {

                                self.animation.currentFrame++;
                                self.animation.frameCounter = 0;
                                ctx.drawImage(sprite, self.width * self.animation.currentFrame +10, 0, self.width, self.height, self.x, self.y, self.width, self.height);

                            } else {

                                self.animation.frameCounter++;
                                ctx.drawImage(sprite, self.width * self.animation.currentFrame +10, 0, self.width, self.height, self.x, self.y, self.width, self.height);

                            }

                        } else {

                            // Ryu has finished his pre-fight dance, get ready to fight, Challenger !
                            self.setState("ready-to-fight");

                        }
                    }
                }

                , "ready-to-fight"  : {
                    frames  : 7
                    , play  : function () {
                        ctx.drawImage(sprite, 32, self.height - 6, self.width, self.height, self.x, self.y, self.width, self.height);
                    }
                }
            };

            self.loopAnimation = function () {
                console.log(self.state);
                self.animation[self.state].play();
            }


            self.setState = function (state) {
                self.state = state;
                self.animation.resetState();
                self.animation[state].play();  // Initial play to avoid blank states

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
            gLoop = setTimeout(GameLoop, 1000 / 50);  // Global animation speed is set here
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