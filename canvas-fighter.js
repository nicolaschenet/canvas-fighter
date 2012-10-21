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


    /** Fighter Class ****************************/

    // ATM, the only fighter is Ryu

    var Fighter = function () {

      var fighter = this;

      fighter.sprite        = new Image();
      fighter.sprite.src    = "sprites/ryu/resources/ryu.png";

      fighter.name          = "Ryu";
      fighter.width         = 75;
      fighter.height        = 105;

      fighter.x             = 0;
      fighter.y             = 0;

      // Default state / Associated animation should always be "repeat"
      fighter.state         = "entering-stage";

      fighter.animations    = {

        // The names of animations are associated
        // with the fighter's states

        "entering-stage"  : {

          // This is the introductory "dance" when the fighter enters the stage

          keyframes  : [
            { x : 0,                  y : 0 },
            { x : fighter.width,      y : 0 },
            { x : fighter.width * 2,  y : 0 },
            { x : fighter.width * 3,  y : 0 },
            { x : fighter.width * 4,  y : 0 },
            { x : fighter.width * 5,  y : 0 },
            { x : fighter.width * 6,  y : 0 },
            { x : fighter.width * 5,  y : 0 },
            { x : fighter.width * 6,  y : 0 },
            { x : fighter.width * 7,  y : 0 },
            { x : fighter.width * 8,  y : 0 },
            { x : fighter.width * 7,  y : 0 },
            { x : fighter.width * 8,  y : 0 },
            // Just a transition frame, to effectively notice the state has changed :)
            { x : 0,                  y : fighter.height }
          ],

          repeat      : false,
          callback    : "ready-to-fight"

        },

        "ready-to-fight"  : {

          // Main default animation

          keyframes  : [
            { x : fighter.width,      y : fighter.height },
            { x : fighter.width * 2,  y : fighter.height },
            { x : fighter.width * 3,  y : fighter.height },
            { x : fighter.width * 4,  y : fighter.height },
            { x : fighter.width * 5,  y : fighter.height }
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

      fighter.keyBindings = {
        "keydown" : [
          { key:    37, action: function () { fighter.move("left");   } },  // Left arrow   (MAC)
          { key:    39, action: function () { fighter.move("right");  } }   // Right arrow  (MAC)
        ]
      };

      fighter.initKeyBindings = function () {
        var eventHandler;
        for (eventHandler in fighter.keyBindings) {
          $(document).on(eventHandler, function (e) {
            $.each(fighter.keyBindings[eventHandler], function (index) {
              var keyBinding = fighter.keyBindings[eventHandler][index];
              if (keyBinding.key === e.which) {
                keyBinding.action.call();
              }
            });
          });
        }
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
            if (fighter.x + fighter.width <= width - padding) {
              fighter.x += 4;
            }
            break;
          case "left":
            if (fighter.x >= padding) {
              fighter.x -= 4;
            }
            break;
          }
        }
      };

    };


    /** Animator Class ******************************/

    // Animates the fighter depending on its state...

    var Animator = function (fighter) {

      var animator = this;

      animator.speed              = 13;
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

    var ryu = new Fighter();
    ryu.setPosition(100, height - ryu.height - floorY);
    ryu.initKeyBindings();

    var animator    = new Animator(ryu);

  };


  // Let's init our CanvasFighter instance
  var canvasFighter = new CanvasFighter();
  canvasFighter.start();

});