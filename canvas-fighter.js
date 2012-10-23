/*jslint browser: true*/
/*global $, animator*/

$(function () {

  var CanvasFighter = function () {

    // Default options

    var
      width    = 800,
      height   = 400,
      floorY   = 50,
      padding  = 10,
      c        = document.getElementById("stage"),
      ctx      = c.getContext("2d"),
      gLoop,
      self     = this;


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
      gLoop = setTimeout(GameLoop, 0);
    };


    self.start = function () {
      clear();
      $("#stage").fadeIn(300, function () {
        var gameLoop = new GameLoop();
      });

      setInterval(function () {
        $("#framerate-counter").text(animator.globalFrameCounter);
        animator.globalFrameCounter = 0;
      }, 1000);

    };

    /** Parent Fighter class *********************/

    var Fighter = function () {

      var fighter = this;

      fighter.sprite = new Image();

      fighter.x      = 0;
      fighter.y      = 0;


      // Default state / Associated animation should always be "repeat"

      fighter.state  = "entering-stage";


      // Methods

      fighter.initCharacter = function (fighterHeight, fighterWidth) {
        fighter.height = fighterHeight;
        fighter.width = fighterWidth;
        fighter.setPosition(100, height - fighter.height - floorY);
      };

      fighter.initKeyBindings = function (keyBindings) {
        var eventHandler;
        for (eventHandler in keyBindings) {
          $(document).on(eventHandler, function (e) {
            $.each(keyBindings[eventHandler], function (index) {
              var keyBinding = keyBindings[eventHandler][index];
              if (keyBinding.key === e.which) {
                keyBinding.action.call();
              }
            });
          });
        }
        $(document).on("keyup", function () {
          fighter.setState("ready-to-fight");
        });
      };

      fighter.setState = function (state) {
        fighter.state = state;
      };

      fighter.setPosition = function (x, y) {
        fighter.x = x;
        fighter.y = y;
      };

      fighter.move = function (direction) {
        if (fighter.state !== "entering-stage") {
          switch (direction) {
          case "right":
            fighter.setState("walking-forward");
            if (fighter.x + fighter.width <= width - padding) {
              fighter.x += 8;
            }
            break;
          case "left":
            fighter.setState("walking-backward");
            if (fighter.x >= padding) {
              fighter.x -= 8;
            }
            break;
          }
        }
      };
    };


    /** Fighters ***************************************/

    // ATM, the only fighter is Ryu

    var Ryu = function () {

      var ryu = this;

      ryu.sprite.src    = "sprites/ryu/resources/ryu.png";

      ryu.name          = "Ryu";
      ryu.width         = 75;
      ryu.height        = 105;

      ryu.animations    = {

        // The names of animations are associated
        // with the fighter's states

        "entering-stage"  : {

          // This is the introductory "dance" when the fighter enters the stage

          keyframes  : [
            { x : 0,              y : 0 },
            { x : ryu.width,      y : 0 },
            { x : ryu.width * 2,  y : 0 },
            { x : ryu.width * 3,  y : 0 },
            { x : ryu.width * 4,  y : 0 },
            { x : ryu.width * 5,  y : 0 },
            { x : ryu.width * 6,  y : 0 },
            { x : ryu.width * 5,  y : 0 },
            { x : ryu.width * 6,  y : 0 },
            { x : ryu.width * 7,  y : 0 },
            { x : ryu.width * 8,  y : 0 },
            { x : ryu.width * 7,  y : 0 },
            { x : ryu.width * 8,  y : 0 },
            // Just a transition frame, to effectively notice the state has changed :)
            { x : 0,                  y : ryu.height }
          ],

          repeat      : false,
          callback    : "ready-to-fight"

        },

        "ready-to-fight"  : {

          // Main default animation

          keyframes  : [
            { x : ryu.width,      y : ryu.height },
            { x : ryu.width * 2,  y : ryu.height },
            { x : ryu.width * 3,  y : ryu.height },
            { x : ryu.width * 4,  y : ryu.height },
            { x : ryu.width * 5,  y : ryu.height }
          ],

          repeat: true

        },

        "walking-forward" : {

          // Walking towards the ooponent

          keyframes : [
            { x : 0,              y : ryu.height * 2 },
            { x : ryu.width,      y : ryu.height * 2 },
            { x : ryu.width * 2,  y : ryu.height * 2 },
            { x : ryu.width * 3,  y : ryu.height * 2 },
            { x : ryu.width * 4,  y : ryu.height * 2 },
            { x : ryu.width * 5,  y : ryu.height * 2 }
          ],

          repeat: true

        },

        "walking-backward" : {

          // Walking towards the ooponent

          keyframes : [
            { x : 0,              y : ryu.height * 3 },
            { x : ryu.width,      y : ryu.height * 3 },
            { x : ryu.width * 2,  y : ryu.height * 3 },
            { x : ryu.width * 3,  y : ryu.height * 3 },
            { x : ryu.width * 4,  y : ryu.height * 3 },
            { x : ryu.width * 5,  y : ryu.height * 3 }
          ],

          repeat: true

        },

        "standing" : {

        },

        "crouching" : {

        },

        "jumping" : {

        },

        "falling" : {

        },

        "walking" : {

        },

        "hadoken" : {

        },

        "shoryuken" : {

        }
      };

      ryu.keyBindings = {
        "keydown" : [
          { key:    37, action: function () { ryu.move("left");   } },  // Left arrow   (MAC)
          { key:    39, action: function () { ryu.move("right");  } }   // Right arrow  (MAC)
        ]
      };

    };

    Ryu.prototype = new Fighter();


    /** Animator Class ******************************/

    // Animates the fighter depending on its state...

    var Animator = function (fighter) {

      var animator = this;

      animator.speed              = 15;
      animator.globalFrameCounter = 0;
      animator.frameCounter       = 0;
      animator.currentFrame       = 0;

      animator.resetFrames = function () {
        this.frameCounter = this.currentFrame = 0;
      };

      animator.drawFrame = function (frame) {
        ctx.drawImage(
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
      };

      animator.play = function (animation) {
        animator.drawFrame(animation.keyframes[animator.currentFrame]);
        if (animator.frameCounter === animator.speed) {
          animator.frameCounter = 0;
          animator.currentFrame++;
        } else {
          animator.frameCounter++;
        }
      };

      animator.loop = function () {
        if (animator.currentFrame >= fighter.animations[fighter.state].keyframes.length) {
          // Animation is finish, should we call a callback animation ?
          if (!fighter.animations[fighter.state].repeat) {
            fighter.setState(fighter.animations[fighter.state].callback);
          }
          animator.resetFrames();
        }
        animator.play(fighter.animations[fighter.state]);
        animator.globalFrameCounter++;
      };
    };


    /** Fighter init *******************************/

    var ryu = new Ryu();
    ryu.initCharacter(ryu.height, ryu.width);
    ryu.initKeyBindings(ryu.keyBindings);

    var animator = new Animator(ryu);

  };


  // Let's init our CanvasFighter instance
  var canvasFighter = new CanvasFighter();
  canvasFighter.start();

});