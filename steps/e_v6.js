
let gameEngineInstance;

function preload(){
  imageSystem = new ImageSystem(); 
}

function setup(){
  gameEngineInstance = new GameEngine(60, 800, 600);
}

function draw(){
  gameEngineInstance.update();
}

class GameObject {
  constructor(gameEngine, initPos=createVector(0,0), name=null) {
    this.Transform = {Position:initPos, Rotation:0, Scale:createVector(0,0)};
    this.gameEngine = gameEngine;
    
    const length = Object.keys(this.gameEngine.gameObjects).length;
    
    const objectName = String(length)
    this.name = objectName
    
    
    
    this.gameEngine.gameObjects.push({objectName:this});
    
    
    this.tags = []
    
    this.collidingWith = []
    
    // List of possible Components
    this.spriteRenderer = null;
    this.rigidBody = null; 
    this.animator = null;
    this.boxCollider = null;
    this.circleCollider = null;
    this.platformerPlayerController = null;
    this.topDownPlayerController = null;
    
    this.components = [this.platformerPlayerController, this.topDownPlayerController, this.rigidBody, 
                      this.animator, this.boxCollider, this.circleCollider, this.spriteRenderer];
    
    this.colliders = []
  }
  
  delete() {
    for (let i = this.gameEngine.gameObjects.length-1; i >= 0; i--){
      if (Object.values(this.gameEngine.gameObjects[i])[0].name === this.name){
        this.gameEngine.gameObjects.splice(i, 1)
      }
    }
  }
  

  rotateObject(angleInDegrees){
    push();
    translate(this.Transform.Position.x, this.Transform.Position.y)
    rotate(angleInDegrees)
    rectMode(CENTER)
    pop()
  }
  
  
  addTag(tag){
    this.tags.push(tag)
  }
  
  hasTag(tag){
    return this.tags.includes(tag);
  }
  
  
  addSpriteRenderer(img, imgSize=null, spriteColor=null){
    this.spriteRenderer = new SpriteRenderer(this, img, imgSize, spriteColor);
  }
  
  addRigidBody(mass, bounce, drag=0.02){
    this.rigidBody = new RigidBody(this, mass, bounce, drag);
  }
  
  addAnimator(){
    this.animator = new Animator(this);
  }
  
  addBoxCollider(colliderSize, isTrigger=false, isContinuous=false, colliderOffset=createVector(0,0), tag=null){
    const boxCollider = new BoxCollider(this, colliderSize, isTrigger, isContinuous, colliderOffset);
    
    if (tag !== null){
      boxCollider.addTag(tag);  
    }
    
    this.colliders.push(boxCollider);
  }
  
  addCircleCollider(colliderRadius, isTrigger=false, isContinuous=false, colliderOffset=createVector(0,0), tag=null){
    const circleCollider = new CircleCollider(this, colliderRadius, isTrigger, isContinuous, colliderOffset);
    
    if (tag !== null){
      circleCollider.addTag(tag);  
    }
    
    this.colliders.push(circleCollider)
  }
  
  addPlatformerPlayerController(accelerationScale, deccelerationScale, maxSpeed, jumpPower, airControl=1){
    this.platformerPlayerController = new PlatformerPlayerController(this.rigidBody, accelerationScale, deccelerationScale, maxSpeed, jumpPower, airControl);
  }
  
  addTopDownPlayerController(accelerationScale, deccelerationScale, maxSpeed, horizontalBias=1){
    this.topDownPlayerController = new TopDownPlayerController(this.rigidBody, accelerationScale, deccelerationScale, maxSpeed, horizontalBias)
    console.log(this.topDownPlayerController)
  }
  
  
  
  updateComponents(){
    this.components = [this.platformerPlayerController, this.topDownPlayerController, this.rigidBody];
    
    for (const component of this.components) {
      if (component !== null){
        component.update();    
      }
      
      for (const collider of this.colliders){
        collider.update()
      }
        
    }
  
  }
  
  renderComponents(){
    if (this.spriteRenderer !== null){
        this.spriteRenderer.update()
    }
    
    if (this.animator !== null){
        this.animator.update()
    }
    
    for (const collider of this.colliders){
      collider.collidingWith = []
      if (this.gameEngine.debug){
        collider.showCollider()  
      }
    
    }
  }
}

//#region Systems

class InputSystem{
  // For the gameEngine class
  
  constructor(){
    this.keycodes = {
      'a': 65,
      'b': 66,
      'c': 67,
      'd': 68,
      'e': 69,
      'f': 70,
      'g': 71,
      'h': 72,
      'i': 73,
      'j': 74,
      'k': 75,
      'l': 76,
      'm': 77,
      'n': 78,
      'o': 79,
      'p': 80,
      'q': 81,
      'r': 82,
      's': 83,
      't': 84,
      'u': 85,
      'v': 86,
      'w': 87,
      'x': 88,
      'y': 89,
      'z': 90,
      'space': 32, 
      'ctrl': 17
    };
    
    this.inputs = {}
    
    
  }

  addMouseInput(inputName, mouseButton){
      this.inputs[inputName] = {"inputFormat":"mouse", "inputKey": mouseButton, "inputType": "bool"};
  }

  addKeyboardInput(inputName, inputKey, inputType="bool"){
    if (typeof inputKey === 'string'){
      this.inputs[inputName] = {"inputFormat":"key", "inputKey": this.keycodes[inputKey], "inputType": inputType};

    } else{
      this.inputs[inputName] = {"inputFormat":"key", "inputKey": inputKey, "inputType": inputType, "alreadyPressed": false};
    }
     
  }
  
  
  getInput(inputName){
    if (keyIsPressed ){
      
      if (this.inputs.hasOwnProperty(inputName) && this.inputs[inputName].inputFormat === "key") {
        
            const keycode = this.inputs[inputName].inputKey;
            if (keyIsDown(keycode)){
                
                return true;

                
                }
 
        }
      
    }
    
    if (mouseIsPressed){
      if (this.inputs.hasOwnProperty(inputName) && this.inputs[inputName].inputFormat === "mouse") {
        if (mouseButton === this.inputs[inputName].inputKey){
          return true;
        }
    }
    
    
      return false;
    
  }}
  
  
  getInputDown(inputName){
    
      if (this.inputs.hasOwnProperty(inputName)) {
            const keycode = this.inputs[inputName].inputKey;
            if (keyIsDown(keycode) ){
              if (this.inputs[inputName].alreadyPressed === false){
                this.inputs[inputName].alreadyPressed = true;
                return true; 
                  }
                
                } else {this.inputs[inputName].alreadyPressed = false;}
 
        }
      
    
    return false;
    
  }
  
  
}



class Camera {
  constructor(objectToFollow, screenWidth, screenHeight) {
    this.objectToFollow = objectToFollow;
    this.screenWidth = screenWidth;
    this.screenHeight = screenHeight;
    
    this.cameraOffset = createVector(0, 150);
  }

  update() {
    // Calculate the camera's position based on the object position
    this.targetX = this.objectToFollow.Transform.Position.x - this.screenWidth / 2;
    this.targetY = this.objectToFollow.Transform.Position.y - this.screenHeight / 2;
    
    translate(-this.targetX + this.cameraOffset.x, -this.targetY + this.cameraOffset.y);
    
    
  }
}





class SpriteRenderer {
  constructor(gameObject, img, imgSize=null, spriteColor=null){
    this.gameObject = gameObject;
    this.imgSize = imgSize;
    this.img = img;
    this.spriteColor = spriteColor;
    this.imageOffset = createVector(0, 0)
    this.flip = true
  }
  
  
  update(){ 
    const angleInDegrees = this.gameObject.Transform.Rotation 
    push();
    
    if (typeof this.img !== "string"){
       translate(this.gameObject.Transform.Position.x + this.imageOffset.x + this.imgSize.x /2, this.gameObject.Transform.Position.y + this.imageOffset.y + this.imgSize.y /2 )
        }
    
    else{
        translate(this.gameObject.Transform.Position.x + this.imageOffset.x, this.gameObject.Transform.Position.y + this.imageOffset.y)
        }
    
    
    rotate(angleInDegrees)
    rectMode(CORNER)
    
    
    noStroke()
    if (typeof this.img !== "string"){
      
       if (this.flip){
           push()
           scale(-1, 1)
           }
        
       if (this.imgSize !== null){
        image(this.img, 0 , 0, this.imgSize.x, this.imgSize.y)
        } else{
          image(this.img, 0, 0)
        } 
      
      if (this.flip){
           pop();
           }
        
      } else {
        
        if (this.img === "circle"){
          if (typeof this.spriteColor === typeof "string"){
            fill(this.spriteColor);
              }
          else if (typeof this.spriteColor === typeof createVector(0,0,0)){
            fill(this.spriteColor.x, this.spriteColor.y, this.spriteColor.z);
              }
          
          circle(0, 0, this.imgSize)
        }
        
        else if (this.img === "rect" || this.img === "rectangle"){
          if (typeof this.spriteColor === typeof "string"){
            fill(this.spriteColor);
              }
          else if (typeof this.spriteColor === typeof createVector(0,0,0)){
            fill(this.spriteColor.x, this.spriteColor.y, this.spriteColor.z);
              }
          
          rect(0, 0, this.imgSize.x, this.imgSize.y)
        }
              
      }
    
    
    
    pop();
  }
}

class RigidBody {
  constructor(gameObject, mass, bounce, drag){
    this.gameObject = gameObject;
    this.Velocity = createVector(0,0)
    
    this.mass = mass;
    this.inverseMass = 1/mass;
    this.bounce = bounce;
    this.drag = drag;
    
    this.gravityScale = 0.02;
    
    this.maxSpeed = 10000000000;
  }
  
  addForce(directionVector, Magnitude){
    this.acceleration = directionVector.mult(Magnitude).div(this.mass)
    
    if (abs(this.Velocity.mag()) < this.maxSpeed){
        this.Velocity.add(this.acceleration.copy())
      } 
    
  }
  
  applyDrag(){
    const dragMagnitude = this.Velocity.copy().mag() * this.drag;

    // Calculate the direction of the drag force (opposite to velocity)
    const dragDirection = this.Velocity.copy().normalize().mult(-1);

    // Apply the drag force to the velocity
    this.addForce(dragDirection, dragMagnitude);
  }
  
  applyGravity(){
    this.addForce(createVector(0, 1), 9.8 * this.mass * this.gravityScale);
  }
  
  update() {
   
    

    
    this.applyDrag();
    this.applyGravity();
    this.gameObject.Transform.Position.add(this.Velocity.copy());
    
    
      
    }
}


class TopDownPlayerController{
  constructor(rigidBody, accelerationScale, deccelerationScale, maxSpeed, horizontalBias=1){
    this.rigidBody = rigidBody;
    this.accelerationScale = accelerationScale;
    this.deccelerationScale = deccelerationScale;
    
    this.horizontalBias = horizontalBias;
    
    this.maxSpeed = maxSpeed;
    
    this.rigidBody.gameObject.gameEngine.inputSystem.addKeyboardInput('Up', 'w', 'bool')
    this.rigidBody.gameObject.gameEngine.inputSystem.addKeyboardInput('Down', 's', 'bool')
    this.rigidBody.gameObject.gameEngine.inputSystem.addKeyboardInput('Right', 'd', 'bool')
    this.rigidBody.gameObject.gameEngine.inputSystem.addKeyboardInput('Left', 'a', 'bool')
    
  }
  
  update(){
    
    
    
    let accelerationScale = this.accelerationScale;
    let deccelerationScale = this.deccelerationScale;
    
    
    
    
    if (this.rigidBody.Velocity.x < this.maxSpeed && this.rigidBody.gameObject.gameEngine.inputSystem.getInput('Right')){
      this.rigidBody.addForce(createVector(1,0), this.maxSpeed * accelerationScale);
    }
    
    else if (this.rigidBody.Velocity.x > -1 * this.maxSpeed && this.rigidBody.gameObject.gameEngine.inputSystem.getInput('Left')){
      this.rigidBody.addForce(createVector(-1,0), this.maxSpeed * accelerationScale);
    } else{
      // Stopping speed / horizontal drag
      if (!this.rigidBody.gameObject.gameEngine.inputSystem.getInput('Left') && !this.rigidBody.gameObject.gameEngine.inputSystem.getInput('Right')){
         this.rigidBody.addForce(createVector(this.rigidBody.Velocity.x * -1, 0), deccelerationScale * this.rigidBody.mass); 
          }
      
    }
    
    
    if (this.rigidBody.Velocity.y > -1 * this.maxSpeed && this.rigidBody.gameObject.gameEngine.inputSystem.getInput('Up')){
      this.rigidBody.addForce(createVector(0,-1), this.maxSpeed * accelerationScale);
    }
    
    else if (this.rigidBody.Velocity.y < this.maxSpeed && this.rigidBody.gameObject.gameEngine.inputSystem.getInput('Down')){
      this.rigidBody.addForce(createVector(0,1), this.maxSpeed * accelerationScale);
    } else{
      // Stopping speed / vertical drag
      if (!this.rigidBody.gameObject.gameEngine.inputSystem.getInput('Up') && !this.rigidBody.gameObject.gameEngine.inputSystem.getInput('Down')){
         this.rigidBody.addForce(createVector(0, this.rigidBody.Velocity.y * -1), deccelerationScale * this.rigidBody.mass); 
          }
    }
    
    
    // flip the sprite depening on which direction on the x-axis they are moving in
    if(this.rigidBody.gameObject.gameEngine.inputSystem.getInput('Right')){
      if (this.rigidBody.gameObject.spriteRenderer !== null){
        //this.rigidBody.gameObject.spriteRenderer.flip = false;
          }
      
      else if (this.rigidBody.gameObject.animator !== null){
        //this.rigidBody.gameObject.animator.flip = false;         
               }
       
       }
    else if (this.rigidBody.gameObject.gameEngine.inputSystem.getInput('Left')){
      if (this.rigidBody.gameObject.spriteRenderer !== null){
        //this.rigidBody.gameObject.spriteRenderer.flip = true;
      }
      
      
      else if (this.rigidBody.gameObject.animator !== null){
        //this.rigidBody.gameObject.animator.flip = true;
               }
      }
    
  }
}


class PlatformerPlayerController{
  constructor(rigidBody, accelerationScale, deccelerationScale, maxSpeed, jumpPower, airControl=1){
    this.rigidBody = rigidBody;
    this.accelerationScale = accelerationScale;
    this.deccelerationScale = deccelerationScale;
    
    
    
    this.maxSpeed = maxSpeed;
    this.jumpPower = jumpPower;
    this.airControl = airControl;
    
    this.timeWarpLocation = null;
    
    this.canJump = true;
    this.jumps = 1
    
    this.rigidBody.gameObject.gameEngine.inputSystem.addKeyboardInput('Jump', 'space', 'bool')
    this.rigidBody.gameObject.gameEngine.inputSystem.addKeyboardInput('Right', 'd', 'bool')
    this.rigidBody.gameObject.gameEngine.inputSystem.addKeyboardInput('Left', 'a', 'bool')
    this.rigidBody.gameObject.gameEngine.inputSystem.addKeyboardInput('TimeWarp', 'f', 'bool')
  }
  
  update(){
    
    this.isGrounded = false;
    
    
    for (const collider of this.rigidBody.gameObject.colliders[2].collidingWith){
      
      const object = collider.gameObject;
      if (object.hasTag('Ground')){
          this.isGrounded = true;
          this.jumps = 1;
          }
    }
    
    let accelerationScale;
    let deccelerationScale;
    if (!this.isGrounded){
        accelerationScale = this.accelerationScale * this.airControl;
        deccelerationScale = this.deccelerationScale * this.airControl / 5;
        } else{
          accelerationScale = this.accelerationScale;
          deccelerationScale = this.deccelerationScale
        }
    
    
    if (this.rigidBody.gameObject.gameEngine.inputSystem.getInputDown('TimeWarp')){
      
      if (this.timeWarpLocation === null){
        this.timeWarpLocation = this.rigidBody.gameObject.Transform.Position.copy()
          } 
      
      else{
        this.rigidBody.gameObject.Transform.Position = this.timeWarpLocation
        this.timeWarpLocation = null;
      }
        
        }
    
    
    if (this.rigidBody.Velocity.x < this.maxSpeed && this.rigidBody.gameObject.gameEngine.inputSystem.getInput('Right')){
      this.rigidBody.addForce(createVector(1,0), this.maxSpeed * accelerationScale);
    }
    
    else if (this.rigidBody.Velocity.x > -1 * this.maxSpeed && this.rigidBody.gameObject.gameEngine.inputSystem.getInput('Left')){
      this.rigidBody.addForce(createVector(-1,0), this.maxSpeed * accelerationScale);
    } else{
      // Stopping speed / horizontal drag
      if (!this.rigidBody.gameObject.gameEngine.inputSystem.getInput('Left') && !this.rigidBody.gameObject.gameEngine.inputSystem.getInput('Right')){
         this.rigidBody.addForce(createVector(this.rigidBody.Velocity.x * -1, 0), deccelerationScale * this.rigidBody.mass); 
          }
      
    }
    
    
    if (this.rigidBody.gameObject.gameEngine.inputSystem.getInput('Jump') && this.jumps > 0 && this.canJump){
        this.rigidBody.Velocity.y = 0;
        this.rigidBody.addForce(createVector(0, -1), this.jumpPower);
        this.jumps -= 1;
        this.canJump = false;
        }
    else if (this.rigidBody.gameObject.gameEngine.inputSystem.getInput('Jump') === false){
        this.canJump = true;     
        }
    
    // flip the sprite depening on which direction on the x-axis they are moving in
    if(this.rigidBody.Velocity.x > 0.5){
       this.rigidBody.gameObject.spriteRenderer.flip = false
       }
    else if (this.rigidBody.Velocity.x < -0.5){
       this.rigidBody.gameObject.spriteRenderer.flip = true
       }
    
  }
}

class Animation{
  constructor(spriteSheetImg, numOfFrames, size=1, speed=10, rotation=0){
    
    this.spriteSheet = spriteSheetImg;
    
    this.frameHeight =  spriteSheetImg.height;
    this.frameWidth = spriteSheetImg.width / numOfFrames;
    
    this.rotation = rotation;
    
    this.numOfFrames = numOfFrames;
    
    this.size = size;
    
    this.frames = [];
    this.speed = speed;
    
    this.flipAxisOffset = 0;
    
    this.generateFrameData();
    
    this.animationOffset = createVector(0,0);
  }
  
  generateFrameData(){
    for (let i = 0; i < this.numOfFrames; i++){
      this.frames.push({"img": this.spriteSheet, "sWidth": this.frameWidth, "sHeight": this.frameHeight, "sx": (i) * this.spriteSheet.width / this.numOfFrames, "sy": 0, "size": this.size})
      //console.log((i) * this.spriteSheet.width / this.numOfFrames)
      //console.log(this.frameWidth)
    }
    
  }
  
  
  
}

class Animator {
  constructor(gameObject){
    this.gameObject = gameObject;
    this.animations = {}
    this.currentAnimation = null
    this.finishCurrentAnim = false;
    this.transiton = false;
    this.currentFrame = 0;
    this.flip = false;
    this.flipVertical = false;
    this.frameTime = 0;
    
    this.animationOffset = createVector(0,0)
  }
  
  createAnimation(name, spriteSheetImg, numOfFrames, size=1, speed=10, rotation=0){
    
    this.animations[name] = new Animation(spriteSheetImg, numOfFrames, size, speed, rotation);
  }
  
  transition(animToShow, shouldFinish=false){
    this.transiton = true;
    if (shouldFinish){
        this.finishCurrentAnim = true;
        this.nextAnimation = this.animations[animToShow]
        }
    
    else{
      this.nextAnimation = this.animations[animToShow]
    }
    
  }
  
  update(){
    this.frameTime += deltaTime / 1000
    
    if (this.transiton){
      if (this.finishCurrentAnim){
        if (this.currentAnimation.frames.indexOf(this.currentAnimation.frames[this.currentFrame]) >= this.currentAnimation.frames.length){
            this.currentAnimation = this.nextAnimation
            this.transiton = false;
            }
        } 
      else{
        this.currentAnimation = this.nextAnimation
        this.transiton = false;
          }
    }
    
    if (this.currentAnimation !== null) {
    
    const frameInfo = this.currentAnimation.frames[this.currentFrame];
    push();
      
    this.animationOffset = this.currentAnimation.animationOffset;
      
    translate(this.gameObject.Transform.Position.x + this.animationOffset.x, this.gameObject.Transform.Position.y + this.animationOffset.y)
      
    if (this.flip && this.flipVertical){
      push();
      translate(this.currentAnimation.flipAxisOffset,0)
      scale(-1, -1);
    }

    else if (this.flip){
      push();
      translate(this.currentAnimation.flipAxisOffset,0)
      scale(-1, 1);
    }

    else if (this.flipVertical){
      push();
      translate(this.currentAnimation.flipAxisOffset,0)
      scale(1, -1);
    }

    if (this.flipVertical){
      
      translate(this.currentAnimation.flipAxisOffset,0)
      
    }
    
    push();
    rotate(this.currentAnimation.rotation)
    image(frameInfo.img, 0, 0, frameInfo.sWidth*frameInfo.size, frameInfo.img.height*frameInfo.size, frameInfo.sx, 0, frameInfo.sWidth, frameInfo.img.height)
    
    pop();

    if (this.flip || this.flipVertical){
        pop();
      }

  
      
    if (this.frameTime > 1 / this.currentAnimation.speed){
      this.frameTime = 0
      
      if (this.currentFrame < this.currentAnimation.frames.length - 1){
      this.currentFrame += 1;
    }
    else{
      this.currentFrame = 0;
    }  
        }
    
    pop();
    }
  }
}


class BoxCollider {
  constructor(gameObject, colliderSize, isTrigger=false, isContinuous=false, colliderOffset=createVector(0,0)){
    this.colliderType = "rect";
    this.gameObject = gameObject;
    this.colliderSize = colliderSize;
    this.colliderOffset = colliderOffset;

    this.isTrigger = isTrigger;
    this.isContinuous = isContinuous
    
    this.colliderTags = []
    
    this.collidingWith =[]
    
    this.Transform = {};
    this.Transform.Position = this.gameObject.Transform.Position.copy().add(this.colliderOffset);
    
    this.topLeft = this.Transform.Position;
    this.topRight = createVector(this.Transform.Position.x + colliderSize.x, this.Transform.Position.y);
    this.bottomLeft = createVector(this.Transform.Position.x, this.Transform.Position.y  + colliderSize.y);
    this.bottomRight = createVector(this.Transform.Position.x + colliderSize.x, this.Transform.Position.y + colliderSize.y);
    
    this.midLeft = createVector(this.Transform.Position.x, this.Transform.Position.y  + colliderSize.y / 2);
    this.midRight = createVector(this.Transform.Position.x + colliderSize.x, this.Transform.Position.y + colliderSize.y /2);
    this.midTop = createVector(this.Transform.Position.x + colliderSize.x / 2, this.Transform.Position.y);
    this.midBottom = createVector(this.Transform.Position.x + colliderSize.x / 2, this.Transform.Position.y + colliderSize.y);
    
    
    
    
  }
  
  addTag(tag){
    this.colliderTags.push(tag)
  }
  
  hasTag(tag){
    if (this.colliderTags.includes(tag)){
      return true;
    } 
    
    return false;
      
  }
  
  showCollider(){
    noFill()
    strokeWeight(2);
    stroke(0, 0, 255);
    rect(this.Transform.Position.x, this.Transform.Position.y, this.colliderSize.x, this.colliderSize.y)
    fill("white")
    noStroke()
  }
  
  update(){
    this.Transform.Position = this.gameObject.Transform.Position.copy().add(this.colliderOffset)
    
    this.topLeft = this.Transform.Position;
    this.topRight = createVector(this.Transform.Position.x + this.colliderSize.x, this.Transform.Position.y);
    this.bottomLeft = createVector(this.Transform.Position.x, this.Transform.Position.y  + this.colliderSize.y);
    this.bottomRight = createVector(this.Transform.Position.x + this.colliderSize.x, this.Transform.Position.y + this.colliderSize.y);
    
    this.midLeft = createVector(this.Transform.Position.x, this.Transform.Position.y  + this.colliderSize.y / 2);
    this.midRight = createVector(this.Transform.Position.x + this.colliderSize.x, this.Transform.Position.y + this.colliderSize.y /2);
    this.midTop = createVector(this.Transform.Position.x + this.colliderSize.x / 2, this.Transform.Position.y);
    this.midBottom = createVector(this.Transform.Position.x + this.colliderSize.x / 2, this.Transform.Position.y + this.colliderSize.y);
    
    
  }
}

class CircleCollider {
  constructor(gameObject, colliderRadius, isTrigger=false, isContinuous=false, colliderOffset=createVector(0,0)){
    this.colliderType = "circle";
    this.gameObject = gameObject;
    this.colliderRadius = colliderRadius;
    this.colliderOffset = colliderOffset;

    this.isTrigger = isTrigger;
    this.isContinuous = isContinuous; 
    
    this.colliderTags = []
    
    this.Transform = {};
    this.collidingWith = []
    
    this.Transform.Position = this.gameObject.Transform.Position.copy().add(this.colliderOffset)
  }
  
   addTag(tag){
    this.colliderTags.push(tag)
  }
  
  hasTag(tag){
    if (this.colliderTags.includes(tag)){
      return true;
    } 
    
    return false;
      
  }
  
  
  showCollider(){
    strokeWeight(2);
    stroke(255, 0, 0);
    noFill()
    circle(this.gameObject.Transform.Position.x + this.colliderOffset.x, this.gameObject.Transform.Position.y + this.colliderOffset.y, this.colliderRadius*2)
    fill("white")
    noStroke()
  }
  
  update(){
    this.Transform.Position = this.gameObject.Transform.Position.copy().add(this.colliderOffset)
    
    
    
  }

}


class ImageSystem{
  constructor(){
    this.Images = {}
    
  }
  
  addImage(name, imagePath){
    const img = loadImage(imagePath)
    this.Images[name] = img
    
    console.log(this.Images)
  }
  
  getImage(name){
    return this.Images[name];
  }
}

//#endregion

class GameEngine{
    #drawBackground(img=null, pos=createVector(0,0), size=null){
        if (img !== null && size !== null){
            image(img, pos.x, pos.y)
        }
        else if (img !== null){
            image(img, pos.x, pos.y, size.x, size.y)    
        }
    }

    //#region Physics Stuff

    detectCollision(collider1, collider2){
      
      if(collider1.gameObject === collider2.gameObject){
        
         return;
        
     }
      
      if (collider1.colliderType === "circle" && collider2.colliderType === "circle"){

        let continuousCheckCircle1;
        if (collider1.gameObject.rigidBody !== null && collider1.isContinuous){
          continuousCheckCircle1 = this.intersectSphere(p5.Vector.add(collider1.Transform.Position, p5.Vector.normalize((collider2.Transform.Position.copy().sub(collider1.Transform.Position))).mult(collider1.colliderRadius)), collider1.gameObject.rigidBody.Velocity, collider2.Transform.Position, collider2.colliderRadius)
        }

        let continuousCheckCircle2;
        if (collider2.gameObject.rigidBody !== null && collider2.isContinuous){
          continuousCheckCircle2 = this.intersectSphere(p5.Vector.add(collider2.Transform.Position, p5.Vector.normalize((collider1.Transform.Position.copy().sub(collider2.Transform.Position))).mult(collider2.colliderRadius)), collider2.gameObject.rigidBody.Velocity, collider1.Transform.Position, collider1.colliderRadius)
        }



        const minDistance = collider1.colliderRadius + collider2.colliderRadius;
        const distanceBetweenCenters = dist(
                collider1.Transform.Position.x,
                collider1.Transform.Position.y,
                collider2.Transform.Position.x,
                collider2.Transform.Position.y
              );
        
        

        if (distanceBetweenCenters <= minDistance || continuousCheckCircle1 || continuousCheckCircle2){
          collider1.gameObject.collidingWith.push(collider2)
          collider2.gameObject.collidingWith.push(collider1)
          collider1.collidingWith.push(collider2)
          collider2.collidingWith.push(collider1)  
            if (collider1.isTrigger === false && collider2.isTrigger === false){
                const collisionNormal = p5.Vector.sub(collider1.Transform.Position.copy(), collider2.Transform.Position.copy()).normalize();
                this.resolveCircleToCircleCollision(collider1.gameObject.rigidBody, collider2.gameObject.rigidBody, collisionNormal, distanceBetweenCenters, minDistance);
                 
                
              
                
                }
            }
        
      }
    
      else if (collider1.colliderType === "circle" && collider2.colliderType === "rect"){

          let nearestX = constrain(collider1.Transform.Position.x, collider2.Transform.Position.x, collider2.bottomRight.x)
          let nearestY = constrain(collider1.Transform.Position.y, collider2.Transform.Position.y, collider2.bottomRight.y)
          let closestPoint = createVector(nearestX, nearestY)

          
          let continuousCheckRect;
          let continuousCheckCircle;
          
          
          

          

          if (collider1.gameObject.rigidBody !== null && collider1.isContinuous){
            let direction = createVector(closestPoint.x - collider1.Transform.Position.x ,  closestPoint.y - collider1.Transform.Position.y).normalize();
            let closestPointOnCircle = collider1.Transform.Position.copy().add(direction.mult(collider1.colliderRadius));

            continuousCheckRect = this.intersectRect(closestPointOnCircle, collider1.gameObject.rigidBody.Velocity, collider2.Transform.Position, collider2.Transform.Position.copy().add(collider2.colliderSize))
          }
          
          
          if (collider2.gameObject.rigidBody !== null && collider2.isContinuous){
            continuousCheckCircle = this.intersectSphere(closestPoint, collider2.gameObject.rigidBody.Velocity, collider1.Transform.Position, collider1.colliderRadius)
          }
          
          const distance = p5.Vector.sub(collider1.Transform.Position.copy(), closestPoint.copy())
          
          
          const collisionNormal = distance.copy().normalize()
          
          if (collider1.colliderRadius >= distance.mag() || continuousCheckCircle || continuousCheckRect){
              const overlap = collider1.colliderRadius - distance.mag();
              
              collider1.gameObject.collidingWith.push(collider2)
              collider2.gameObject.collidingWith.push(collider1)
              collider1.collidingWith.push(collider2)
              collider2.collidingWith.push(collider1)  
              
            if (collider1.isTrigger === false && collider2.isTrigger === false){
              this.resolveOtherCollision(collider1.gameObject.rigidBody, collider2.gameObject.rigidBody, collisionNormal, overlap)
            }
              
              }
          
          
          
          }
    
      else if (collider1.colliderType === "rect" && collider2.colliderType === "circle"){

          let nearestX = constrain(collider2.Transform.Position.x, collider1.Transform.Position.x, collider1.bottomRight.x)
          let nearestY = constrain(collider2.Transform.Position.y, collider1.Transform.Position.y, collider1.bottomRight.y)
          let closestPoint = createVector(nearestX, nearestY)

          let continuousCheckRect;
          let continuousCheckCircle;

       
        

          if (collider2.gameObject.rigidBody !== null && collider2.isContinuous){
            let direction = createVector(closestPoint.x - collider2.Transform.Position.x, closestPoint.y - collider2.Transform.Position.y ).normalize();
            let closestPointOnCircle = collider2.Transform.Position.copy().add(direction.mult(collider2.colliderRadius));

            continuousCheckRect = this.intersectRect(closestPointOnCircle, collider2.gameObject.rigidBody.Velocity, collider1.Transform.Position, collider1.Transform.Position.copy().add(collider1.colliderSize))
            
          }

          if (collider1.gameObject.rigidBody !== null && collider1.isContinuous){
            continuousCheckCircle = this.intersectSphere(closestPoint, collider1.gameObject.rigidBody.Velocity, collider2.Transform.Position, collider2.colliderRadius)
          }
          
          const distance = p5.Vector.sub(collider2.Transform.Position.copy(), closestPoint.copy())
          
          
          const collisionNormal = distance.copy().normalize()
          
    
          if (collider2.colliderRadius >= distance.mag() || continuousCheckCircle || continuousCheckRect){
              
              

              const overlap = collider2.colliderRadius - distance.mag();
              

              collider1.gameObject.collidingWith.push(collider2)
              collider2.gameObject.collidingWith.push(collider1)
              collider1.collidingWith.push(collider2)
              collider2.collidingWith.push(collider1)  

              
            
              if (collider1.isTrigger === false && collider2.isTrigger === false){
                this.resolveOtherCollision(collider2.gameObject.rigidBody, collider1.gameObject.rigidBody, collisionNormal, overlap)
              }
              
              
              }
          
          
          
          
        }
    
      else{
        let continuousCheckRect1;
        let continuousCheckRect2;
        
        let closestX1 = constrain(collider2.Transform.Position.x + collider2.colliderSize.x / 2, collider1.Transform.Position.x, collider1.Transform.Position.x + collider1.colliderSize.x);
        let closestY1 = constrain(collider2.Transform.Position.y + collider2.colliderSize.y / 2, collider1.Transform.Position.y, collider1.Transform.Position.y + collider1.colliderSize.y);
        
        let closestX2 = constrain(collider1.Transform.Position.x + collider1.colliderSize.x / 2, collider2.Transform.Position.x, collider2.Transform.Position.x + collider2.colliderSize.x);
        let closestY2 = constrain(collider1.Transform.Position.y + collider1.colliderSize.y / 2, collider2.Transform.Position.y, collider2.Transform.Position.y + collider2.colliderSize.y);
       
       
        if (collider1.gameObject.rigidBody !== null && collider1.isContinuous){
          continuousCheckRect1 = this.intersectRect(createVector(closestX1, closestY1), collider1.gameObject.rigidBody.Velocity, collider2.Transform.Position, collider2.Transform.Position.copy().add(collider2.colliderSize))
        }

        if (collider2.gameObject.rigidBody !== null && collider2.isContinuous){
          continuousCheckRect2 = this.intersectRect(createVector(closestX2, closestY2), collider2.gameObject.rigidBody.Velocity, collider1.Transform.Position, collider1.Transform.Position.copy().add(collider1.colliderSize))

        }

        //AABB Collision Detection
       if (
          collider1.Transform.Position.x < collider2.Transform.Position.x + collider2.colliderSize.x &&
          collider1.Transform.Position.x + collider1.colliderSize.x > collider2.Transform.Position.x &&
          collider1.Transform.Position.y < collider2.Transform.Position.y + collider2.colliderSize.y &&
          collider1.Transform.Position.y + collider1.colliderSize.y > collider2.Transform.Position.y 
          || continuousCheckRect1 || continuousCheckRect2
        ) {

        const overlapX = min(collider1.Transform.Position.x + collider1.colliderSize.x, collider2.Transform.Position.x + collider2.colliderSize.x) - max(collider1.Transform.Position.x, collider2.Transform.Position.x);

        const overlapY = min(collider1.Transform.Position.y + collider1.colliderSize.y,collider2.Transform.Position.y + collider2.colliderSize.y) - max(collider1.Transform.Position.y, collider2.Transform.Position.y);

        let collisionNormal = createVector(0, 0);
        let overlap = 0

        
        if (overlapX < overlapY) {
          // X-axis collision
          collisionNormal.x = (collider1.Transform.Position.x < collider2.Transform.Position.x) ? 1 : -1;
          overlap = overlapX;
        } else {
          // Y-axis collision
          collisionNormal.y = (collider1.Transform.Position.y < collider2.Transform.Position.y) ? 1 : -1;
          overlap = overlapY;
        }

        collider1.gameObject.collidingWith.push(collider2)
        collider2.gameObject.collidingWith.push(collider1)
        collider1.collidingWith.push(collider2)
        collider2.collidingWith.push(collider1) 

        if (collider1.isTrigger === false && collider2.isTrigger === false){
          this.resolveOtherCollision(collider2.gameObject.rigidBody, collider1.gameObject.rigidBody, collisionNormal, overlap);
        }
        
            
        }
      }
    
    
  }



  intersectRect(startPoint, dir, minBounds, maxBounds) {
    // code pulled from https://www.scratchapixel.com/lessons/3d-basic-rendering/minimal-ray-tracer-rendering-simple-shapes/ray-box-intersection.html 
    // Code Translated from c# and commented by chat-gpt 3.5 (slightly adapted by me)
    // chat gpt code stats here:

    // Check if the direction magnitude is zero
    if (dir.mag() === 0) {
        // Handle or skip the intersection calculation for zero magnitude
        return false;
    }

    // Calculate intersection with AABB
    let framesToView = 2;
    let endPoint = startPoint.copy().add(dir.copy().mult(framesToView));

    this.rays.push([startPoint, endPoint]);

    let tmin = (minBounds.x - startPoint.x) / dir.x;
    let tmax = (maxBounds.x - startPoint.x) / dir.x;

    if (tmin > tmax) {
        let temp = tmin;
        tmin = tmax;
        tmax = temp;
    }

    let tymin = (minBounds.y - startPoint.y) / dir.y;
    let tymax = (maxBounds.y - startPoint.y) / dir.y;

    if (tymin > tymax) {
        let temp = tymin;
        tymin = tymax;
        tymax = temp;
    }

    if ((tmin > tymax) || (tymin > tmax)) {
        return false;
    }

    tmin = max(tmin, tymin);
    tmax = min(tmax, tymax);

    if (tmax < 0) {
        return false;
    }

    // Check if intersection point is within the bounds of the segment
    let hitX = startPoint.x + tmin * dir.x;
    let hitY = startPoint.y + tmin * dir.y;

   

    if (
        hitX < min(startPoint.x, endPoint.x) ||
        hitX > max(startPoint.x, endPoint.x) ||
        hitY < min(startPoint.y, endPoint.y) ||
        hitY > max(startPoint.y, endPoint.y)
    ) {
        return false;
    }

    // If all checks pass, return true
    return true;
  

    // chatgpt code ends here
}




  intersectSphere(orig, dir, center, radius) {
    // https://stackoverflow.com/questions/1073336/circle-line-segment-collision-detection-algorithm
    // Code Translated from c# and commented by chat-gpt 3.5 (slightly adapted by me)
    // chat gpt code stats here:

    let framesToView = 2;
    let E, L, C, r;
    // Set the starting point of the ray (E)
    E = orig;

    // Set the end point of the ray (L)
 
    L = p5.Vector.add(orig, (p5.Vector.mult(dir, framesToView)));
 
    
    // Set the center of the sphere (C)
    C = center;
    // Set the radius of the sphere (r)
    r = radius;

    

    this.rays.push([E,L])
    
    
    // Compute direction vector of the ray (d)
    let d = p5.Vector.sub(L, E);
    // Compute vector from center sphere to ray start (f)
    let f = p5.Vector.sub(E, C);

    
    
   

    // Solve the quadratic equation for t
    let a = d.dot(d);
    let b = 2 * f.dot(d);
    let c = f.dot(f) - r * r;
    let discriminant = b * b - 4 * a * c;
    
    if (discriminant >= 0 && b !== 0) {
      // Calculate solutions for t
      let t1 = (-b - sqrt(discriminant)) / (2 * a);
      let t2 = (-b + sqrt(discriminant)) / (2 * a);
      

      

      // Calculate intersection points
      let intersection1 = p5.Vector.add(E, p5.Vector.mult(d, t1));
      let intersection2 = p5.Vector.add(E, p5.Vector.mult(d, t2));
      


    
    if (min(t1, t2) >= 0 && min(t1, t2) <= 1){
      //console.log(true)
      return true;
    }
    
    }

    return false;

    // chatgpt code ends here
  }
  
  circleCheck(radius, position){
    let physCheckObject = new GameObject(this, position)
    physCheckObject.addCircleCollider(radius, true, false, createVector(0,0))
    
    this.toDebug.push({"radius":radius, "position":position})

    let circleCheckCollider = physCheckObject.colliders[0];
    circleCheckCollider.collidingWith = []



    const objects = Object.values(this.gameObjectValues);
      for (let i = 0; i < objects.length - 1; i++) {
        for (const collider of objects[i].colliders){
      
            this.detectCollision(circleCheckCollider, collider)
          }
  
    }

    const collidingWith = circleCheckCollider.collidingWith;
  
    physCheckObject.delete()
    
    return collidingWith
  }

  
  resolveCircleToCircleCollision(rigidBody1, rigidBody2, collisionNormal, distanceBetweenCenters, minDistance){
    // Calculate relative velocity
      const coefficientOfRestitution = Math.min(rigidBody1.bounce, rigidBody2.bounce);
      const e = coefficientOfRestitution;
    
      
      
      const impulseDirection = collisionNormal.normalize();
      
      
      
      const RelativeVelocity = p5.Vector.sub(rigidBody1.Velocity, rigidBody2.Velocity);
      
      const impulseMagnitude = (-(1 + e) * p5.Vector.dot(RelativeVelocity, impulseDirection.copy())) / (rigidBody1.inverseMass + rigidBody2.inverseMass);
      
      
    
      const MassToMassRatio = rigidBody2.mass / rigidBody1.mass;

      const moveRatioRigidbody1 = MassToMassRatio / (1 + MassToMassRatio);
      const moveRatioRigidbody2 = 1 / (1 + MassToMassRatio);

    
      rigidBody1.gameObject.Transform.Position.add(impulseDirection.copy().normalize().mult((minDistance - distanceBetweenCenters) * moveRatioRigidbody1 )); 
      rigidBody2.gameObject.Transform.Position.sub(impulseDirection.copy().normalize().mult((minDistance - distanceBetweenCenters) * moveRatioRigidbody2) );
      
    
      rigidBody1.addForce(impulseDirection.copy(), impulseMagnitude);
      rigidBody2.addForce(impulseDirection.copy(), -impulseMagnitude);
  }
  
  resolveOtherCollision(rigidBody1, rigidBody2, collisionNormal, overlap){
    // Calculate relative velocity
      const coefficientOfRestitution = Math.min(rigidBody1.bounce, rigidBody2.bounce);
      const e = coefficientOfRestitution;
      
      
      
      const impulseDirection = collisionNormal.normalize();
      
      
      
      const RelativeVelocity = p5.Vector.sub(rigidBody1.Velocity, rigidBody2.Velocity);
      
      
    
      const impulseMagnitude = (-(1 + e) * p5.Vector.dot(RelativeVelocity, impulseDirection.copy())) / (rigidBody1.inverseMass + rigidBody2.inverseMass);
      
    
    
      const MassToMassRatio = rigidBody2.mass / rigidBody1.mass;
      

      const moveRatioRigidbody1 = MassToMassRatio / (1 + MassToMassRatio);
      const moveRatioRigidbody2 = 1 / (1 + MassToMassRatio);
      
      
      
    
    // Update the positions with the adjusted values
    rigidBody1.gameObject.Transform.Position.add(p5.Vector.mult(impulseDirection.copy().normalize(), overlap * moveRatioRigidbody1));
    rigidBody2.gameObject.Transform.Position.sub(p5.Vector.mult(impulseDirection.copy().normalize(), overlap * moveRatioRigidbody2));

    
      
    
    rigidBody1.addForce(impulseDirection.copy(), impulseMagnitude);
    rigidBody2.addForce(impulseDirection.copy(), -impulseMagnitude);
  }

    //#endregion


    #checkAllCollisions(){
        const objects = Object.values(this.gameObjectValues);
        for (let i = 0; i < objects.length - 1; i++) {
            for (let j = i + 1; j < objects.length; j++) {
                for (const collider1 of objects[i].colliders){
                    for (const collider2 of objects[j].colliders)
                        this.detectCollision(collider1, collider2)
                }
            }
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
        frameRate(this.FPS);
            
        this.backgroundImage = null;
        this.backgroundSize = null;
        this.backgroundPos = null;
            
        this.mainCamera = null;

        angleMode(DEGREES);
    }

    addCamera(object){
        this.mainCamera = new Camera(object, this.screenWidth, this.screenHeight);
    }

    update(){
        background(210);
    
        this.rays = [];
        this.toDebug = [];

        this.#drawBackground(this.backgroundImage, this.backgroundPos, this.backgroundSize);
        frameRate(this.FPS);
        
        this.gameObjectValues = this.gameObjects.map(obj => obj.objectName);
   
        
        this.#checkAllCollisions(); 
        

        for (const name in this.gameObjectValues) {
            if (this.gameObjectValues.hasOwnProperty(name)) {
                const gameObject = this.gameObjectValues[name];
            
                gameObject.updateComponents();
                gameObject.collidingWith = [];
            }
        }


        if (this.mainCamera !== null){
            this.mainCamera.update();    
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
                noFill();
                stroke(0, 255, 255);
                
                drawingContext.setLineDash([1, 5]);
                circle(this.toDebug[i].position.x, this.toDebug[i].position.y, this.toDebug[i].radius*2);
                fill("white");
                drawingContext.setLineDash([0,0]);
            }
        }
    }
}

