function preload(){

}

function setup(){

}

function draw(){
    
}



class GameObject{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }

    render(){
        console.log("Rendering GameObject at", this.x, this.y);
    }
}



class GameEngine{
    #drawBackground(img=null, pos=createVector(0,0), size=null){
        if (img !== null && size !== null){
            image(img, pos.x, pos.y)
        }
        else if (img !== null){
            image(img, pos.x, pos.y, size.x, size.y)    
        }
    }

    constructor(fps=60, screenWidth=400, screenHeight=400){
        createCanvas(screenWidth, screenHeight);
            
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
            
        imageMode(CENTER);
        rectMode(CORNER);

        this.gameObjects = [];

        this.debug = false;
        this.toDebug = [];
        this.rays = [];

        this.FPS = fps;
        frameRate(this.FPS)
            
        this.backgroundImage = null;
        this.backgroundSize = null;
        this.backgroundPos = null;
            
        this.mainCamera = null;

        angleMode(DEGREES)
    }

    addCamera(object){
        this.mainCamera = new Camera(object, this.screenWidth, this.screenHeight);
    }

    update(){
        background(210);
    
        this.rays = []
        this.toDebug = []

        this.#drawBackground(this.backgroundImage, this.backgroundPos, this.backgroundSize)
        frameRate(this.FPS)
        
        this.gameObjectValues = this.gameObjects.map(obj => obj.objectName);
   
        
        this.checkAllCollisions(); // To come
        

        for (const name in this.gameObjectValues) {
            if (this.gameObjectValues.hasOwnProperty(name)) {
                const gameObject = this.gameObjectValues[name];
            
                gameObject.updateComponents();
                gameObject.collidingWith = [];
            }
        }


        if (this.mainCamera !== null){
            this.mainCamera.update()    
        }
        
        for (const name in this.gameObjectValues) {
            if (this.gameObjectValues.hasOwnProperty(name)) {
                const gameObject = this.gameObjectValues[name];
                
                gameObject.renderComponents();

                if (this.debug){
                    for (let i = 0; i <= this.rays.length - 1; i++) {
                        stroke("green");
                        line(this.rays[i][0].x, this.rays[i][0].y, this.rays[i][1].x, this.rays[i][1].y);
                    }
                }
            }
        }

        if (this.debug){
            for (let i = 0; i <= this.toDebug.length -1; i++){
                noFill()
                stroke(0, 255, 255)
                
                drawingContext.setLineDash([1, 5]);
                circle(this.toDebug[i].position.x, this.toDebug[i].position.y, this.toDebug[i].radius*2)
                fill("white")
                drawingContext.setLineDash([0,0]);
            }
        }
    }
}

