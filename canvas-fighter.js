$(function () {

    var CanvasFighter = function () {

        // Default options

        var   width    = 800
            , height   = 600
            , floorY   = 50
            , c        = document.getElementById("stage")
            , ctx      = c.getContext("2d")
            , gLoop
            , self     = this
        ;


        // Let's set canvas dimensions

        c.width  = width;
        c.height = height;


        // Clearing of the canvas, will be called on each frame

        var clear = function () {
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.rect(0, 0, width, height);
            ctx.closePath();
            ctx.fill();
        };


        var GameLoop = function () {
            clear();
            animator.loop();
            gLoop = setTimeout(GameLoop, 1000 / 60);
        };


        this.start = function () {
            clear();
            $("#stage").fadeIn(300, function() {
                GameLoop();
            })
        }


        /** Fighter Class ****************************/

        // ATM, the only fighter is Ryu

        var Fighter = function () {

            var fighter = this;

            fighter.sprite        = new Image();
            fighter.sprite.src    = "sprites/Ryu.gif";              // This sprite has to be redesigned in order to be efficient

            fighter.name          = "Ryu";
            fighter.width         = 76;
            fighter.height        = 120;

            fighter.x             = 0;
            fighter.y             = 0;

            fighter.state         = "entering-stage";              // Default state / Associated animation should always be "repeat"

            fighter.animations    = {

                // The names of animations are associated
                // with the fighter's states

                "entering-stage"  : {

                    keyframes  : [
                          { x : fighter.width * 0 +10, y : 0 }
                        , { x : fighter.width * 1 +10, y : 0 }
                        , { x : fighter.width * 2 +10, y : 0 }
                        , { x : fighter.width * 3 +10, y : 0 }
                        , { x : fighter.width * 4 +10, y : 0 }
                        , { x : fighter.width * 5 +10, y : 0 }
                        , { x : fighter.width * 6 +10, y : 0 }
                    ]
                    , repeat      : false
                    , callback    : "ready-to-fight"

                }

                , "ready-to-fight"  : {

                    keyframes  : [
                        { x : 32, y : fighter.height - 6 }
                    ]
                    , repeat: true

                }

                , "standing" : {

                }

                , "crouching" : {

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
            };


            fighter.setState = function (state) {
                fighter.state = state;
            }

            fighter.setPosition = function ( x, y ) {
                fighter.x = x;
                fighter.y = y;
            }

        };


        /** Animator Class ******************************/

        // Animates the fighter depending on its state...

        var Animator = function (fighter) {

            var animator = this;

            animator.speed             = 3;
            animator.frameCounter      = 0;
            animator.currentFrame      = 0;

            animator.resetFrames = function () {
                this.frameCounter = this.currentFrame = 0;
            }

            animator.drawFrame = function (frame) {
                ctx.drawImage (
                    fighter.sprite,
                    frame.x,
                    frame.y,
                    fighter.width,
                    fighter.height,
                    fighter.x,
                    fighter.y,
                    fighter.width,
                    fighter.height
                );
            }

            animator.play = function (animation) {

                animator.drawFrame(animation.keyframes[animator.currentFrame]);

                if ( animator.frameCounter == animator.speed ) {

                    animator.frameCounter = 0;
                    animator.currentFrame++;

                } else {

                    animator.frameCounter++;

                }

            }

            animator.loop = function () {

                if ( animator.currentFrame >= fighter.animations[fighter.state].keyframes.length ) {
                    // Animation is finish, callback please !!
                    fighter.setState(fighter.animations[fighter.state].callback);
                    animator.resetFrames();

                } else if (fighter.animations[fighter.state].repeat) {
                    animator.resetFrames();
                }

                animator.play(fighter.animations[fighter.state]);

            }

        }

        var ryu         = new Fighter();
        var animator    = new Animator(ryu);

        ryu.setPosition( 100, height - ryu.height - floorY );

    }


    // Let's init our CanvasFighter instance
    var canvasFighter = new CanvasFighter();
    canvasFighter.start();

});