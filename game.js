var canvasBg = document.getElementById("canvasBg"),
    ctxBg = canvasBg.getContext("2d"), //to define the context of the canvas
    canvasEntities = document.getElementById("canvasEntities"),
    ctxEntities = canvasEntities.getContext("2d"), //to define the context of the second canvas
    canvasWidth = canvasBg.width,
    canvasHeight = canvasBg.height,
    player1 = new Player(),
    enemies = [],
    numEnemies = 5,
    obstacles = [],
    isPlaying = false,
    requestAnimFrame = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        },
    imgSprite = new Image();

imgSprite.src = "images/sprite.png";
imgSprite.addEventListener("load", init, false); //loading the image, initialize it 

function init() {
    document.addEventListener("keydown", function (e) { checkKey(e, true); }, false);
    /*it checks when the key is pressed
    e is the event parameter passed to the function
    true is passed as the second parameter*/

    document.addEventListener("keyup", function (e) { checkKey(e, false); }, false);
    defineObstacles();
    initEnemies();
    begin();    // it is used to begin the game and run it
}

function begin() {
    //draw the background
    ctxBg.drawImage(imgSprite, 0, 0, canvasWidth, canvasHeight, 0, 0, canvasWidth, canvasHeight);
    //it draws the background
    //sets the coordinate of the background (change it to the centre after completion), and give the height and width along with the corner points 0, 0 to remove the margin or padding 
    isPlaying = true; // the game is now begin
    requestAnimFrame(loop);
}

function update() {
    clearCtx(ctxEntities);
    updateAllEnemies();
    player1.update();
}

function draw() {
    drawAllEnemies();
    player1.draw();
}

function loop() { //updates, draws the game every single frame
    if (isPlaying) {
        update();
        draw();
        requestAnimFrame(loop);
    }
}

function clearCtx(ctx) {  // to clear the canvas every time we need a diiferent frame
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
}

function randomRange(min, max) { // returns a random number between the min and max
    return Math.floor(Math.random() * (max + 1 - min)) + min;
}

function Player() {
    this.srcX = 0; //this belongs to the Player object, srcX is just like the background
    this.srcY = 600;
    this.width = 35;
    this.height = 54;
    this.drawX = 400;
    this.drawY = 300; //to draw the player on the canvas
    this.centerX = this.drawX + (this.width / 2);
    this.centerY = this.drawY + (this.height / 2); //where the center of the player is terms of the collisions
    this.speed = 2;//how fast the player will move
    this.isUpKey = false;
    this.isRightKey = false;
    this.IsDownKey = false;
    this.isLeftKey = false;
    this.isSpaceBar = false;
    this.isShooting = false;
    var numBullets = 10;
    this.bullets = [];
    this.currentBullet = 0; //keep a track of the current bullet fired
    for (var i = 0; i < numBullets; i++) {
        this.bullets[this.bullets.length] = new Bullet(); //adding a new bullet
    }
}

Player.prototype.update = function () { //adding a method to the object
    this.centerX = this.drawX + (this.width / 2);
    this.centerY = this.drawY + (this.height / 2);
    //calculating the new centerX and centerY
    this.checkDirection();
    this.checkShooting();
    this.updateAllBullets();
};

Player.prototype.draw = function () {
    this.drawAllBullets();
    ctxEntities.drawImage(imgSprite, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);
};

Player.prototype.checkDirection = function () {
    var newDrawX = this.drawX,
        newDrawY = this.drawY,
        obstacleCollision = false;
    if (this.isUpKey) {  //player upKey variable
        newDrawY -= this.speed;
        this.srcX = 35; //Facing North player
    }
    else if (this.isDownKey) {
        newDrawY += this.speed;
        this.srcX = 0; //Facing South
    }
    else if (this.isRightKey) {
        newDrawX += this.speed;
        this.srcX = 105; //Facing East
    }
    else if (this.isLeftKey) {
        newDrawX -= this.speed;
        this.srcX = 70; //Facing West
    }
    //NOTE: Here if we use if instead of else if, then we can move even indiagonal direction
    obstacleCollision = this.checkObstacleCollide(newDrawX, newDrawY);
    if (!obstacleCollision && !outOfBounds(this, newDrawX, newDrawY)) {
        this.drawX = newDrawX;
        this.drawY = newDrawY;
    }
};

Player.prototype.checkObstacleCollide = function (newDrawX, newDrawY) {
    var obstacleCounter = 0,
        newCenterX = newDrawX + (this.width / 2),
        newCenterY = newDrawY + (this.height / 2);
    for (var i = 0; i < obstacles.length; i++) {
        if (obstacles[i].leftX < newCenterX && newCenterX < obstacles[i].rightX && obstacles[i].topY - 20 < newCenterY && newCenterY < obstacles[i].bottomY - 20) {
            obstacleCounter = 0;
        } else {
            obstacleCounter++;
        }
    }
    if (obstacleCounter === obstacles.length) {
        return false;
    } else {
        return true;
    }
}

Player.prototype.checkShooting = function () {
    if (this.isSpaceBar && !this.isShooting) {
        this.isShooting = true;
        this.bullets[this.currentBullet].fire(this.centerX, this.centerY);
        this.currentBullet++;
        if (this.currentBullet >= this.bullets.length) {
            this.currentBullet = 0;
        }
    } else if (!this.isSpaceBar) {
        this.isShooting = false;
    }
};

Player.prototype.updateAllBullets = function () {
    for (var i = 0; i < this.bullets.length; i++) {
        if (this.bullets[i].isFlying) {
            this.bullets[i].update();
        }
    }
}

Player.prototype.drawAllBullets = function () {
    for (var i = 0; i < this.bullets.length; i++) {
        if (this.bullets[i].isFlying) {
            this.bullets[i].draw();
        }
    }
};


//Bullet Object
function Bullet() {
    this.radius = 2;
    this.width = this.radius * 2;
    this.height = this.radius * 2;
    this.drawX = 0;
    this.drawY = 0;
    this.isFlying = false;
    this.xVel = 0;
    this.yVel = 0;
    this.speed = 6;
}

Bullet.prototype.update = function () {
    this.drawX += this.xVel;
    this.drawY += this.yVel;
    this.checkHitEnemy();
    this.checkHitObstacle();
    this.checkOutOfBounds();
};

Bullet.prototype.draw = function () {
    ctxEntities.fillStyle = "white";
    ctxEntities.beginPath();
    ctxEntities.arc(this.drawX, this.drawY, this.radius, 0, Math.PI * 2, false);
    ctxEntities.closePath();
    ctxEntities.fill();
};

Bullet.prototype.fire = function (startX, startY) {
    var soundEffect = new Audio("audio/shooting.wav");
    soundEffect.play();
    this.drawX = startX;
    this.drawY = startY;
    if (player1.srcX === 0) {
        this.xVel = 0;
        this.yVel = this.speed;
    } else if (player1.srcX === 35) {
        this.xVel = 0;
        this.yVel = -this.speed;
    } else if (player1.srcX === 70) {
        this.xVel = -this.speed;
        this.yVel = 0;
    } else if (player1.srcX === 105) {
        this.xVel = this.speed;
        this.yVel = 0;
    }
    this.isFlying = true;
};

Bullet.prototype.recycle = function () {
    this.isFlying = false;
};

Bullet.prototype.checkHitEnemy = function () {
    for (var i = 0; i < enemies.length; i++) {
        if (collision(this, enemies[i]) && !enemies[i].isDead) {
            this.recycle();
            enemies[i].die();
        }
    }
};

Bullet.prototype.checkHitObstacle = function () {
    for (var i = 0; i < obstacles.length; i++) {
        if (collision(this, obstacles[i])) {
            this.recycle();
        }
    }
};

Bullet.prototype.checkOutOfBounds = function () {
    if (outOfBounds(this, this.drawX, this.drawY)) {
        this.recycle();
    }
};

//Obstacles Object
function Obstacle(x, y, w, h) { //basically we are drawing a box around the obstacle
    this.drawX = x;
    this.drawY = y;
    this.width = w;
    this.height = h;
    this.leftX = this.drawX;
    this.rightX = this.drawX + this.width;
    this.topY = this.drawY;
    this.bottomY = this.drawY + this.height;
}

function defineObstacles() {
    var treeWidth = 65,
        treeHeight = 90,
        rockDimensions = 30, //as height and width are same
        bushHeight = 28;  // width of the bushes vary

    obstacles = [new Obstacle(78, 360, treeWidth, treeHeight),
    new Obstacle(390, 395, treeWidth, treeHeight),
    new Obstacle(415, 102, treeWidth, treeHeight),
    new Obstacle(619, 184, treeWidth, treeHeight),
    new Obstacle(97, 63, rockDimensions, rockDimensions),
    new Obstacle(296, 379, rockDimensions, rockDimensions),
    new Obstacle(295, 25, 150, bushHeight),
    new Obstacle(570, 138, 150, bushHeight),
    new Obstacle(605, 492, 90, bushHeight)
    ];
}

function Enemy() {
    this.srcX = 140;
    this.srcY = 600;
    this.width = 45;
    this.height = 54;
    this.drawX = randomRange(0, canvasWidth - this.width);
    this.drawY = randomRange(0, canvasHeight - this.height); //to draw the enemies on the canvas
    this.centerX = this.drawX + (this.width / 2);
    this.centerY = this.drawY + (this.height / 2);
    this.targetX = this.centerX;
    this.targeyY = this.centerY;
    this.randomMoveTime = randomRange(1000, 5000);
    this.speed = 1;
    var that = this;
    this.moveInterval = setInterval(function () { that.setTargetLocation(); }, that.randomMoveTime); //that is equal to this enemy
    this.isDead = false;
}

Enemy.prototype.update = function () {
    this.centerX = this.drawX + (this.width / 2);
    this.centerY = this.drawY + (this.height / 2);
    this.checkDirection();
};

Enemy.prototype.draw = function () {
    ctxEntities.drawImage(imgSprite, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);
};

Enemy.prototype.setTargetLocation = function () {
    this.randomMoveTime = randomRange(1000, 5000);
    var minX = this.centerX - 50,
        maxX = this.centerX + 50,
        minY = this.centerY - 50,
        maxY = this.centerY + 50;//enemy can't overlap and will be 50px away from the player
    if (minX < 0) {
        minX = 0;
    }
    if (maxX > canvasWidth) {
        maxX = canvasWidth;
    }
    if (minY < 0) {
        minY = 0;
    }
    if (maxY > canvasHeight) {
        maxY = canvasHeight;
    }
    this.targetX = randomRange(minX, maxX);
    this.targetY = randomRange(minY, maxY);
};

Enemy.prototype.checkDirection = function () {
    if (this.centerX < this.targetX) {
        this.drawX += this.speed;
    } else if (this.centerX > this.targetX) {
        this.drawX -= this.speed;
    }
    if (this.centerY < this.targetY) {
        this.drawY += this.speed;
    } else if (this.centerY > this.targetY) {
        this.drawY -= this.speed;
    }
};

Enemy.prototype.die = function () {
    var soundEffect = new Audio("audio/dying.wav");
    soundEffect.play();
    clearInterval(this.moveInterval);
    this.srcX = 185;
    this.isDead = true;
};


function initEnemies() { //create an enemy
    for (var i = 0; i < numEnemies; i++) {
        enemies[enemies.length] = new Enemy();
    }
}

function updateAllEnemies() {
    for (var i = 0; i < enemies.length; i++) {
        enemies[i].update();
    }
}

function drawAllEnemies() {
    for (var i = 0; i < enemies.length; i++) {
        enemies[i].draw();
    }
}

function checkKey(e, value) {
    var keyID = e.keyCode || e.which; //check keyCode and if the browser doesnt support than we will check e.which
    if (keyID === 38) { //38 is the key for Up Arrow 
        player1.isUpKey = value;
        e.preventDefault(); //it prevents the use of arrow keys to be used to scroll the page
    }
    if (keyID === 39) { //Right Arrow 
        player1.isRightKey = value;
        e.preventDefault();
    }
    if (keyID === 40) { //Down Arrow 
        player1.isDownKey = value;
        e.preventDefault();
    }
    if (keyID === 37) { //Left Arrow 
        player1.isLeftKey = value;
        e.preventDefault();
    }
    if (keyID === 32) { //Space Bar 
        player1.isSpaceBar = value;
        e.preventDefault();
    }
}

function outOfBounds(a, x, y) {  //takes in object a, its position x and y as parameters
    var newBottomY = y + a.height,
        newTopY = y,
        newRightX = x + a.width,
        newLeftX = x,
        treeLineTop = 5,
        treeLineBottom = 570,
        treeLineRight = 750,
        treeLineLeft = 65 //tree variables are the constraints that player cant go beyond that i.e. the boundary variables

    return newBottomY > treeLineBottom ||
        newTopY < treeLineTop ||
        newRightX > treeLineRight ||
        newLeftX < treeLineLeft;
}

function collision(a, b) { //takes two objects a, b as parameters{
    return a.drawX <= b.drawX + b.width &&
        a.drawX >= b.drawX &&
        a.drawY <= b.drawY + b.height &&
        a.drawY >= b.drawY;
    //checks if two objects are not colliding i.e. one is not inside the other
}       