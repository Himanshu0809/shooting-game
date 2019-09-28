var canvasBg=document.getElementById("canvasBg"),
    ctxBg=canvasBg.getContext("2d"), //to define the context of the canvas
    canvasEntities=document.getElementById("canvasEntities"),
    ctxEntities=canvasEntities.getContext("2d"), //to define the context of the second canvas
    canvasWidth=canvasBg.width,
    canvasHeight=canvasBg.clientHeight,
    //player1 = new player(),
    //enemies=[],
    //numEnemies=5,
    //obstacles=[],
    isPlaying=false,
    requestAnimFrame =  window.requestAnimationFrame||
                        window.webkitRequestAnimationFrame||
                        window.mozRequestAnimationFrame||
                        window.oRequestAnimationFrame||
                        msRequestAnimationFrame||
                        function(callback){
                            window.setTimeout(callback, 1000/60 );
                        },
    imgSprite = new Image();

imgSprite.src="images/sprite.png";
imgSprite.addEventListener("load",init ,false); //loading the image, initialize it 

function init(){
    //document.addEventListener("keydown", checkKeyDown, false);
    //document.addEventListener("keyup", checkKeyUp, false);
    //defineObstacles();
    //initEnemies();
    begin();    // it is used to begin the game and run it
}

function begin(){
    //draw the background
    ctxBg.drawImage(imgSprite, 0, 0, canvasWidth, canvasHeight, 0,0, canvasWidth, canvasHeight);       
    //it draws the background
    //sets the coordinate of the background (change it to the centre after completion), and give the height and width along with the corner points 0, 0 to remove the margin or padding 
    isPlaying=true; // the game is now begin
    requestAnimFrame(loop);
}

function loop(){ //updates, draws the game every single frame
    
}