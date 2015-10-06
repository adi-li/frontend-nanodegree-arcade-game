// use strict mode
'use strict';

// Tile rectangle constants
var TILE_WIDTH = 101,
    TILE_HEIGHT = 83;

// frame object for storing rect data and manipulating collision checking
var Frame = function(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
};

Frame.prototype.left = function() {
    return this.x + this.width;
};

Frame.prototype.bottom = function() {
    return this.y + this.height;
};

Frame.prototype.isIntersectWithFrame = function(frame) {
    return !(
        this.left() < frame.x ||
        this.x > frame.left() ||
        this.bottom() < frame.y ||
        this.y > frame.bottom()
    );
};

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    this.speed = 0;
    this.frame = new Frame(0, 0, TILE_WIDTH, 80);

    this.init();
};

// Class constants, an array of valid speed
Enemy.SPEEDS = [200, 300, 400, 500, 600];

// Init funciton of Enemy, should be invoked after assigning properties.
Enemy.prototype.init = function() {
    this.randomSpeed();
    this.randomPosition();
};

// Get a random speed from Enemy.SPEEDS array
Enemy.prototype.randomSpeed = function() {
    this.speed = this.constructor.SPEEDS[Math.round(Math.random() * (Enemy.SPEEDS.length - 1))];
};

// Get a random y position
Enemy.prototype.randomPosition = function() {
    var row = Math.round(Math.random() * 2 + 1);
    this.frame.x = -TILE_WIDTH;
    this.frame.y = row * TILE_HEIGHT + 50;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (this.frame.x > 600) {
        this.frame.x = Math.round(Math.random() * 10) * -TILE_WIDTH;
        this.randomSpeed();
        this.randomPosition();
    }
    this.frame.x += dt * this.speed;
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.frame.x, this.frame.y - 20 - 50);
};

// Player object, user can control this object to avoid enemies
var Player = function() {
    this.col = 0;
    this.row = 0;
    this.sprite = 'images/char-boy.png';
    this.shouldDie = false;
    this.init();
};

Player.prototype.init = function() {
    this.resetPosition();
};

Player.prototype.resetPosition = function() {
    this.col = 2;
    this.row = 5;
};

Player.prototype.update = function() {
    // moved the reset position on next frame update
    // to notify that the user is collided with enemy
    // and avoid weird reset
    // (sometimes pressed up and suddenly reset position
    // because of  collision of enemy, but didn't render
    // to show the reason)
    if (this.shouldDie) {
        this.resetPosition();
        this.shouldDie = false;
    }

    // check if player is collided with any enemy
    var myFrame = this.frame();
    this.shouldDie = allEnemies.some(function(enemy){
        return enemy.frame.isIntersectWithFrame(myFrame);
    });

    // check if player is dropping on water
    if (!this.shouldDie) {
        this.shouldDie = (this.row == 0);
    }
};

Player.prototype.render = function() {
    var frame = player.frame();
    ctx.drawImage(Resources.get(this.sprite), frame.x - 18, frame.y - 10 - 50);
};

Player.prototype.frame = function() {
    return new Frame(
        this.col * TILE_WIDTH + 18,
        this.row * TILE_HEIGHT + 50,
        66,
        80
    );
};

Player.prototype.handleInput = function(input) {
    switch (input) {
        case 'left':
            this.col = Math.max(0, this.col - 1);
            break;
        case 'right':
            this.col = Math.min(4, this.col + 1);
            break;
        case 'up':
            this.row = Math.max(0, this.row - 1);
            break;
        case 'down':
            this.row = Math.min(5 , this.row + 1);
            break;
        default:
            break;
    }
};


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [],
    player = new Player();

for (var i = 0; i < 3; i++) {
    allEnemies.push(new Enemy());
}


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keydown', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
