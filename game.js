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
                            window.setTimeout(callback, )
                        }

