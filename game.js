var canvasBg = document.getElementById("canvasBg"),
    ctxBg = canvasBg.getContext("2d"), //to define the context of the canvas
    canvasEntities = document.getElementById("canvasEntities"),
    ctxEntities = canvasEntities.getContext("2d"), //to define the context of the second canvas
    canvasWidth = canvasBg.width,
    canvasHeight = canvasBg.height,
    player1 = new Player(),
    //enemies=[],
    //numEnemies=5,
    //obstacles=[],
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
    document.addEventListener("keydown", function(e){ checkKey(e, true);}, false); 
    /*it checks the up key to move the player up
    e is the event parameter passed to the function
    true is passed as the second parameter*/
   
    document.addEventListener("keyup", function(e){ checkKey(e, false);} , false);
    //defineObstacles();
    //initEnemies();
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
    //updateAllEnemies();
    player1.update();
}

function draw() {
    //drawAllEnemies();
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
    this.isUpKey=false;
    this.isRightKey=false;
    this.IsDownKey=false;
    this.isLeftKey=false;
    this.isSpaceBar=false;
    //this.isShooting=false;
    //var numBullets=10;
    //this.bullets=[];
    //this.currentBullet = 0; //keep a track of the current bullet fired
    // for(var i=0; i<numBullets; i++){
    //     this.bullets[this.bullets.length]=new Bullet(); //adding a new bullet
    // }
}

Player.prototype.update = function () { //adding a method to the object
    this.centerX = this.drawX + (this.width / 2);
    this.centerY = this.drawY + (this.height / 2);
    //calculating the new centerX and centerY
    this.checkDirection();
    //this.checkShooting();
    //this.updateAllBullets();
};

Player.prototype.draw = function () { 
    //this.drawAllBullets();
    ctxEntities.drawImage(imgSprite, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);
};

Player.prototype.checkDirection = function () { 
    var newDrawX=this.drawX,    
        newDrawY=this.drawY,
        obstacleCollision=false;
        if(this.isUpKey){  //player upKey variable
            newDrawY-=this.speed;
            this.srcX=35; //Facing North player
        }
        else if(this.isDownKey){ 
            newDrawY+=this.speed;
            this.srcX=0; //Facing South
        }
        else if(this.isRightKey){ 
            newDrawX+=this.speed;
            this.srcX=105; //Facing East
        }
        else if(this.isLeftKey){  
            newDrawX-=this.speed;
            this.srcX=70; //Facing West
        }
        //NOTE: Here if we use if instead of else if, then we can move even indiagonal direction
        //obstacleCollision =this.checkObstacleCollide(newDrawX, newDrawY);
        if(!obstacleCollision&&!outOfBounds(this,newDrawX, newDrawY)){
            this.drawX=newDrawX;
            this.drawY=newDrawY;
        }
};

function checkKey(e, value){
    var keyID=e.keyCode || e.which; //check keyCode and if the browser doesnt support than we will check e.which
    if(keyID===38){ //38 is the key for Up Arrow 
        player1.isUpKey=value; 
        e.preventDefault(); //it prevents the use of arrow keys to be used to scroll the page
    }
    if(keyID===39){ //Right Arrow 
        player1.isRightKey=value; 
        e.preventDefault(); 
    }
    if(keyID===40){ //Down Arrow 
        player1.isDownKey=value; 
        e.preventDefault(); 
    }
    if(keyID===37){ //Left Arrow 
        player1.isLeftKey=value; 
        e.preventDefault(); 
    }
    if(keyID===32){ //Space Bar 
        player1.isSpaceBar =value; 
        e.preventDefault(); 
    }
} 

function outOfBounds(a,x,y){  //takes in object a, its position x and y as parameters
    var newBottomY=y+a.height,
        newTopY=y,
        newRightX=x+a.width,
        newLeftX=x,
        treeLineTop=5,
        treeLineBottom=570, 
        treeLineRight=750,
        treeLineLeft=65 //tree variables are the constraints that player cant go beyond that i.e. the boundary variables
    
    return newBottomY>treeLineBottom || 
        newTopY<treeLineTop||
        newRightX>treeLineRight||
        newLeftX<treeLineLeft;
}