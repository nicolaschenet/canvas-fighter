# Canvas Fighter ~ the (not so) next generation fighting game

> The main goal is to experiment with HTML5 / Canvas / Javascript, not really to make an actual game :)

---

### Goal

#### Overall character's control and animation:
 - Pre-fight animation
 - Moving left, right (depending on challenger's position)
 - Jumping
 - Crouching
 - Blocking attacks
 - Special moves
 - Win / Lose animation

#### Including sounds
 - Moves sounds
 - Stage sounds

#### How to run it ?
Just open canvas-fighter.html in a modern browser...
(An internet connexion is required to load jQuery stuff ^^)

### Changelog


#### 2012/10/17

Super light start, you really shouldn't take a look at it right now.

 - Only one character, buggy sprite, resulting in buggy animation.
 - The stage and the fighter are rendered in canvas, that's a nice start \o/

#### 2012/10/18

 - Fighter and Animator classes are now separated from each other.
 - Animations are based on keyframes: it's easier to compose the animation from the sprite (repeat some frames, go back and forth...).
 - Animations can be repeated forever.
 - Animations can be chained: once an animation is finished, the callback animation is played, and so on.
 - Animator loop has lost some weight \o/

#### Next step...

Yeahhh the sprite is still buggy... I have to recompose the sprite so that each frame has the same width and height. Will be the next step, with the creation of all animations (keyframes sequences).