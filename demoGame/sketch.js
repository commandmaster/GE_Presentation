// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"


let player1;


let game = function(p5){
  p5.preload = function(){
    
  };

  p5.setup = function(){
    
  }
  
  p5.draw = function(){
    
  }

}

function preload(){
  imageSystem = new ImageSystem(); 
  
  imageSystem.addImage("defaultKnight", "assets/knightSpriteSheet.png");
  imageSystem.addImage("fireKnight", "assets/fireKnightSheet.png");
  imageSystem.addImage("badPistol", "assets/weapons/badPistol.png");
  imageSystem.addImage("yellowBullet", "assets/weapons/projectiles/yellowBullet.png");
  imageSystem.addImage("yellowBullet2", "assets/weapons/projectiles/yellowBullet2.png");
  imageSystem.addImage("ak47", "assets/weapons/AK-47.png")
}

function setup() {
  myGameEngine = new GameEngine(60, 1300, 900);
  //myGameEngine.debug = true;
  
  
  
  
  floor1 = new GameObject(myGameEngine, createVector(1500,0));
  floor1.addRigidBody(1000000000, 0.8);
  floor1.rigidBody.gravityScale = 0;
  floor1.addBoxCollider(createVector(1000,400), false, false, createVector(0,0));  
  floor1.addTag('Ground');
  floor1.addSpriteRenderer("rect", createVector(1000, 400), createVector(0, 25, 70));
  
  //testCircle = new GameObject(myGameEngine, createVector(0, 0));
  //testCircle.addRigidBody(1000000000, 0.8);
  //testCircle.addCircleCollider(25, false, false, createVector(0,0))
  //testCircle.rigidBody.gravityScale = 0;

  player1 = new Player(myGameEngine, createVector(100, 0));
  player1.addRigidBody(2, 0.01)
  player1.rigidBody.gravityScale = 0;
  
  player1.addBoxCollider(createVector(58, 25), false, true, createVector(15, 7), "player")
  player1.addCircleCollider(25, false, true, createVector(44,50), "player")
  

  
  
  player1.addTopDownPlayerController(0.1, 0.5, 10);
  
  //player1.addSpriteRenderer(myGameEngine.imageSystem.getImage("knight"), createVector(82, 82))
  player1.addAnimator();

  player1.animator.createAnimation("fire", imageSystem.getImage("fireKnight"), 8, 0.5);
  player1.animator.animations.fire.animationOffset = createVector(40, 40)
  player1.animator.animations.fire.flipAxisOffset = 10

  player1.animator.createAnimation("default", imageSystem.getImage("defaultKnight"), 8, 0.5);
  player1.animator.animations.default.animationOffset = createVector(30, 40)
  player1.animator.animations.default.flipAxisOffset = 30
  
  player1.animator.transition("fire")
  
  myGameEngine.addCamera(player1)
  
  //box1 = new GameObject(myGameEngine, createVector(700, 800));
  //box1.addRigidBody(1000000000, 1)
  //box1.rigidBody.gravityScale = 0;
  //box1.addBoxCollider(createVector(100, 100), false)
  //box1.addTag('Ground')
  //box1.addSpriteRenderer("rect", createVector(100, 100), 'red');
  

  
  
  //createWall(myGameEngine, createVector(15,300), createVector(468,480))
  
  
  
  myGameEngine.projectileSystem.createProjectile("yellowBullet", imageSystem.getImage("yellowBullet2"), 1, 0.75, 1, 30, 5, createVector(0,0));
  myGameEngine.projectileSystem.createProjectile("akBullet", imageSystem.getImage("yellowBullet2"), 1, 0.75, 1, 30, 5, createVector(0,0));
  
  myGameEngine.weaponSystem.createGun("badPistol", imageSystem.getImage("badPistol"), 1, 0.5, createVector(0,0), createVector(0,0), "yellowBullet", createVector(3,4), 0, 2, true, createVector(80,60), createVector(-40,-30), createVector(80, 50), createVector(35, -3));
  myGameEngine.weaponSystem.createGun("ak47", imageSystem.getImage("ak47"), 1, 0.5, createVector(0,0), createVector(0,0), "akBullet", createVector(3,4), 0, 5, true, createVector(110,80), createVector(-55,-40), createVector(80, 50), createVector(50, -7));
  
  //myGameEngine.enemySystem.createEnemy("goblinGuard", spriteSheet, frames, enemySize, animationOffset, rotationPoint, weapon, colliderRadius, colliderOffset, damageMultiplier, health)

  myGameEngine.weaponSystem.summonGun("badPistol", createVector(400, 0), player1);
  myGameEngine.weaponSystem.summonGun("ak47", createVector(550, 0), player1);

  

  
  //myGameEngine.projectileSystem.spawnProjectile("yellowBullet", createVector(50, 550), createVector(0,1))
 
}



function draw() {
  myGameEngine.update();
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
    if (this.tags.includes(tag)){
        return true;
        } return false;
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

class Player extends GameObject{
  constructor(gameEngine, initPos=createVector(0,0)){
    super(gameEngine, initPos)

    this.maxEnergy = 200
    this.maxHealth = 5
    this.maxSheild = 5

    this.energy = 200
    this.health = 5
    this.sheild = 5

    this.shieldRegenerationSpeed = 0.1
    this.timeSinceRegeneration = 0
    this.gameEngine.playerObjects.push(this)
  }

  updatePlayer(){
    
    if (this.sheild < this.maxSheild){
      this.timeSinceRegeneration += deltaTime / 1000;

      if (this.timeSinceRegeneration >= 1 / this.shieldRegenerationSpeed){
        this.timeSinceRegeneration = 0;
        this.sheild += 1;
      }
    }
    
    else{
      this.timeSinceRegeneration = 0;
    }

  }

  takeDamage(damage){
    
    this.sheild -= damage;


    if (this.sheild < 0){
      this.health += this.sheild;

      this.sheild = 0;
    }
    
    if (this.health <= 0){
      this.health = 0
      this.die();
    }

    
  }

  die(){
    console.log('dead')
  }
}

class Enemy extends GameObject{
  constructor(gameEngine, initPos, spriteSheet, frames, enemySize, animationOffset, rotationPoint, weapon, colliderRadius, colliderOffset, damageMultiplier, health){
    super(gameEngine, initPos)

    this.spriteSheet = spriteSheet;
    this.frames = frames;
    this.enemySize = enemySize;
    this.animationOffset = animationOffset;
    this.rotationPoint = rotationPoint;
    this.weapon = weapon;
    this.colliderRadius = colliderRadius;
    this.colliderOffset = colliderOffset;

    this.damageMultiplier = damageMultiplier;
    this.health = health;

    this.addRigidBody(1, 0.5)

    this.addAnimator();
    
    this.animator.createAnimation("default", this.spriteSheet, this.frames, this.enemySize);
    this.animator.animations.default.animationOffset = this.animationOffset;
    this.animator.animations.default.flipAxisOffset = 0

    this.addCircleCollider(colliderRadius, false, true, "enemy")
  }

  takeDamage(damage){
    this.health -= damage;
    
    if (this.health <= 0){
      this.health = 0;
      this.die();
    }
  }

  updateEnemy(){

  }

  die(){
    console.log('dead');
  }

}

class EnemySystem{
  constructor(gameEngine){
    this.gameEngine = gameEngine;

    this.enemys = {};
    this.enemyInstances = [];
  }

  createEnemy(enemyName, spriteSheet, frames, enemySize, animationOffset, rotationPoint, weapon, colliderRadius, colliderOffset, damageMultiplier, health){
    this.enemys[enemyName] = {"gameEngine":this.gameEngine, "spriteSheet":spriteSheet, "frames":frames, 
                              "enemySize":enemySize, "animationOffset":animationOffset, "rotationPoint":rotationPoint, 
                              "weapon":weapon, "colliderRadius":colliderRadius, "colliderOffset":colliderOffset, "damageMultiplier": damageMultiplier, "health":health}
  }

  spawnEnemy(enemyName, spawnLocation){
    this.enemyInstances.push({enemyName: new Enemy(this.enemys[enemyName].gameEngine, spawnLocation, this.enemys[enemyName].spriteSheet, this.enemys[enemyName].frames, 
                              this.enemys[enemyName].enemySize, this.enemys[enemyName].animationOffset, this.enemys[enemyName].rotationPoint, this.enemys[enemyName].weapon, 
                              this.enemys[enemyName].colliderRadius, this.enemys[enemyName].colliderOffset, this.enemys[enemyName].damageMultiplier, this.enemys[enemyName].health)})
  }

  update(){
    
    this.enemyInstances.forEach(enemy => {
      enemy.enemyName.updateEnemy()
    });
  }

}

class ProjectileSystem{
  constructor(gameEngine){
    this.gameEngine = gameEngine;

    this.projectiles = {}
    this.projectileInstances = []
      
  }

  createProjectile(name, spriteSheet, frames, size, animSpeed, travelSpeed, colliderRadius, colliderOffset){
    this.projectiles[name] = {"spriteSheet":spriteSheet, "frames":frames, "size":size, "animSpeed": animSpeed, "travelSpeed":travelSpeed, "colliderRadius": colliderRadius, "colliderOffset":colliderOffset}
  }

  spawnProjectile(name, location, velocity, rotation){
    this.projectileInstances.push({name:new Projectile(this.gameEngine, location, velocity, rotation, this.projectiles[name].spriteSheet, this.projectiles[name].frames, this.projectiles[name].size, this.projectiles[name].animSpeed, this.projectiles[name].travelSpeed, name, this.projectiles[name].colliderRadius, this.projectiles[name].colliderOffset)});

  }

  update(){
    
      this.projectileInstances.forEach(element => {
        element.name.update()
      });
  }
}

class Projectile extends GameObject{
  constructor(gameEngine, location, velocity, rotation, spriteSheet, frames, size, animSpeed, travelSpeed, name, colliderRadius, colliderOffset){
    super(gameEngine, location)
    this.gameEngine = gameEngine;
    this.spriteSheet = spriteSheet;
    this.frames = frames;
    this.size = size;
    this.animSpeed = animSpeed;
    this.travelSpeed = travelSpeed;
    this.projectileName = name;
    
    this.addCircleCollider(colliderRadius, true, true, colliderOffset, "projectile");
    
    this.addAnimator()

    this.animator.createAnimation("default", this.spriteSheet, this.frames, this.size);
    //this.animator.animations.default.animationOffset = this.animationOffset;
    //this.animator.animations.default.flipAxisOffset = this.Transform.Position.x - attachPoint.x * 1.5

    this.animator.transition("default");

    this.lifeSpan = 10;

    this.animator.animations.default.rotation = rotation
    
    this.addRigidBody(0.5, 1)
    this.rigidBody.drag = 0
    this.rigidBody.gravityScale = 0;
    this.rigidBody.Velocity = p5.Vector.normalize(velocity.copy()).mult(this.travelSpeed);

    this.timeAlive = 0
  }

  update() {
    this.timeAlive += deltaTime / 1000;
    
    this.animator.animations.default.rotation = Math.atan2(this.rigidBody.Velocity.y, this.rigidBody.Velocity.x) * 180 / Math.PI


    for (const collider of this.colliders[0].collidingWith){
      
      if(collider.hasTag("enemy")){
        collider.gameObject.takeDamage(1);
        this.deleteProjectile()
      }
    }

        const currentObject = this.gameEngine.gameObjects[this.name];
        if (this.timeAlive >= this.lifeSpan) {
            this.deleteProjectile()
        }

    
  }

  deleteProjectile(){
    

    for (let i = this.gameEngine.projectileSystem.projectileInstances.length-1; i >= 0; i--){
      
      if (Object.values(this.gameEngine.projectileSystem.projectileInstances[i])[0].name === this.name){
        this.gameEngine.projectileSystem.projectileInstances.splice(i, 1)
        
      }
    }
    
    this.delete();
  }


}


class WeaponBase extends GameObject{
  constructor(gameEngine, spriteSheet, frames, weaponSize, animationOffset, rotationPoint, location, playerObject, colliderSize, colliderOffset){
    super(gameEngine, location);

    this.playerObject = playerObject;

    this.gameEngine = gameEngine;
    this.spriteSheet = spriteSheet;
    
    this.frames = frames;
    this.weaponSize = weaponSize;
    this.animationOffset = animationOffset;
    this.rotationPoint = rotationPoint;
    this.flipPoint = rotationPoint

    this.location = location

    
    this.addBoxCollider(colliderSize, true, false, colliderOffset, "weapon");

    this.addAnimator();
    
    this.animator.createAnimation("default", this.spriteSheet, this.frames, this.weaponSize);
    this.animator.animations.default.animationOffset = this.animationOffset;
    this.animator.animations.default.flipAxisOffset = 0

    this.animator.transition("default");
  }
}


class GunBase extends WeaponBase{
  constructor(gameEngine, spriteSheet, frames, weaponSize, animationOffset, rotationPoint, projectile, damageRange, energyCost, roundsPerSecond, isAutomatic, location, playerObject, colliderSize, colliderOffset, attachPoint, bulletToBarrelOffset){
    super(gameEngine, spriteSheet, frames, weaponSize, animationOffset, rotationPoint, location, playerObject, colliderSize, colliderOffset)

    this.projectile = projectile;

    this.damageRange = damageRange;
    this.energyCost = energyCost;
    this.roundsPerSecond = roundsPerSecond;
    this.isAutomatic = isAutomatic;


    this.attachPoint = attachPoint;
    this.bulletToBarrelOffset = bulletToBarrelOffset;

    this.isAttached = false;

    this.projectileSpawnPoint = createVector(0,0)

    this.animator.transition("default");

    this.directionNormal = createVector(0,0)
    
    this.timeSinceLastShot = 0
  }

  

  shoot(){
    this.timeSinceLastShot = 0;
    this.gameEngine.projectileSystem.spawnProjectile(this.projectile, this.projectileSpawnPoint, this.directionNormal, this.projectileRotation)
  }

  updateWeapon(){
    this.timeSinceLastShot += deltaTime / 1000


    for (const collider of this.colliders[0].collidingWith){
      if(collider.hasTag("player") && this.gameEngine.inputSystem.getInputDown("pickup")){
        this.isAttached = true;
      }
    }
    
    
    angleMode(DEGREES)

    if (this.isAttached){
      
      let directionVector = p5.Vector.sub(createVector(mouseX, mouseY), createVector(this.gameEngine.screenWidth / 2 + this.gameEngine.mainCamera.cameraOffset.x + this.attachPoint.x, this.gameEngine.screenHeight / 2 + this.gameEngine.mainCamera.cameraOffset.y + + this.attachPoint.y));
      let directionNormal = p5.Vector.normalize(directionVector)
      this.directionNormal = directionNormal;
      const gunToMouseAngle = Math.atan2(directionNormal.y, directionNormal.x) * 180 / Math.PI


      if (gunToMouseAngle > -90 && gunToMouseAngle < 90){
        this.projectileRotation = this.animator.currentAnimation.rotation;

        this.Transform.Position = this.playerObject.Transform.Position.copy().add(this.attachPoint)

        this.animator.flip = false;

        let directionVector = p5.Vector.sub(createVector(mouseX, mouseY), createVector(this.gameEngine.screenWidth / 2 + this.gameEngine.mainCamera.cameraOffset.x + this.attachPoint.x, this.gameEngine.screenHeight / 2 + this.gameEngine.mainCamera.cameraOffset.y + + this.attachPoint.y));
        let directionNormal = p5.Vector.normalize(directionVector)
        this.directionNormal = directionNormal;
        
        const angle = Math.atan2(directionNormal.y, directionNormal.x) * 180 / Math.PI
        this.animator.currentAnimation.rotation = angle

        const unRotatedprojectileSpawnPoint = this.Transform.Position.copy().add(this.bulletToBarrelOffset);
        
        this.projectileSpawnPoint = createVector(
              (unRotatedprojectileSpawnPoint.x - this.Transform.Position.x) * cos(angle) - (unRotatedprojectileSpawnPoint.y - this.Transform.Position.y) * sin(angle) + this.Transform.Position.x,
              (unRotatedprojectileSpawnPoint.y - this.Transform.Position.y) * cos(angle) + (unRotatedprojectileSpawnPoint.x - this.Transform.Position.x) * sin(angle) + this.Transform.Position.y
              );


        this.playerObject.rigidBody.gameObject.animator.flip = false;

        
      }

      else{
        this.animator.flip = true;
        this.projectileRotation = -this.animator.currentAnimation.rotation + 180;

        this.Transform.Position = this.playerObject.Transform.Position.copy().sub(createVector(0, -this.attachPoint.y))

        let directionVector = p5.Vector.sub(createVector(mouseX, mouseY), createVector(this.gameEngine.screenWidth / 2 + this.gameEngine.mainCamera.cameraOffset.x, this.gameEngine.screenHeight / 2 + this.gameEngine.mainCamera.cameraOffset.y + this.attachPoint.y));
        let directionNormal = p5.Vector.normalize(directionVector)
        this.directionNormal = directionNormal;

        const angle = (-Math.atan2(directionNormal.y, directionNormal.x) + 1 * Math.PI) * 180 / Math.PI

        const unRotatedprojectileSpawnPoint = (this.Transform.Position.copy().sub(createVector(this.bulletToBarrelOffset.x, -this.bulletToBarrelOffset.y))).copy();
        this.projectileSpawnPoint = createVector(
          (unRotatedprojectileSpawnPoint.x - this.Transform.Position.x) * cos(-angle) - (unRotatedprojectileSpawnPoint.y - this.Transform.Position.y) * sin(-angle) + this.Transform.Position.x,
          (unRotatedprojectileSpawnPoint.y - this.Transform.Position.y) * cos(-angle) + (unRotatedprojectileSpawnPoint.x - this.Transform.Position.x) * sin(-angle) + this.Transform.Position.y
          );
        
        
        
        
        this.animator.currentAnimation.rotation = angle

        this.playerObject.rigidBody.gameObject.animator.flip = true; 
      }



      if (this.gameEngine.inputSystem.getInput("shoot") && this.isAttached && this.timeSinceLastShot >= (1 / this.roundsPerSecond)){
        this.shoot()
      }

      if (this.gameEngine.inputSystem.getInputDown("drop")){
        this.animator.currentAnimation.rotation = 0;
        this.isAttached = false;
      }
      
    }
   
  }


}

class Melee extends GameObject{
  constructor(){

  }
}

class CustomWeapon extends GameObject{
  constructor(){

  }
}




class WeaponSystem {
  constructor(gameEngine){
    this.gameEngine = gameEngine
    this.weapons = {}

    this.weaponInstances = []

    this.gameEngine.inputSystem.addMouseInput("shoot", LEFT)
    this.gameEngine.inputSystem.addKeyboardInput("pickup", "e")
    this.gameEngine.inputSystem.addKeyboardInput("drop", "e")
  }

  createGun(name, spriteSheet, frames, weaponSize, animationOffset, rotationPoint, projectile, damageRange, energyCost, roundsPerSecond, isAutomatic, colliderSize, colliderOffset, attachPoint, bulletToBarrelOffset){
    this.weapons[name] = {"gameEngine":this.gameEngine, "spriteSheet":spriteSheet, "frames":frames, "weaponSize":weaponSize, "animationOffset":animationOffset, "rotationPoint":rotationPoint, 
                          "projectile":projectile, "damageRange":damageRange, "energyCost":energyCost, "roundsPerSecond":roundsPerSecond, "isAutomatic":isAutomatic, "colliderSize":colliderSize, 
                          "colliderOffset":colliderOffset, "attachPoint":attachPoint , "bulletToBarrelOffset":bulletToBarrelOffset};
  }

  createMelee(){
    
  }

  summonGun(weaponName, location, playerObject){
    this.weaponInstances.push({weaponName: new GunBase(this.weapons[weaponName].gameEngine, this.weapons[weaponName].spriteSheet, this.weapons[weaponName].frames, this.weapons[weaponName].weaponSize, 
                              this.weapons[weaponName].animationOffset, this.weapons[weaponName].rotationPoint, this.weapons[weaponName].projectile, this.weapons[weaponName].damageRange, 
                              this.weapons[weaponName].energyCost, this.weapons[weaponName].roundsPerSecond, this.weapons[weaponName].isAutomatic, location, playerObject, this.weapons[weaponName].colliderSize, 
                              this.weapons[weaponName].colliderOffset, this.weapons[weaponName].attachPoint, this.weapons[weaponName].bulletToBarrelOffset)})

    
  }

  update(){
    
    this.weaponInstances.forEach(weapon => {
      weapon.weaponName.updateWeapon()
    });
  }

}




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

class GameEngine {
  constructor(fps=60, screenWidth=400, screenHeight=400){
    createCanvas(screenWidth, screenHeight);
    
    this.rays = [];
    this.toDebug = [];
    
    imageMode(CENTER)
    rectMode(CORNER)

    this.inputSystem = new InputSystem();
    this.weaponSystem = new WeaponSystem(this);
    this.projectileSystem = new ProjectileSystem(this);
    this.enemySystem = new EnemySystem(this);
      
    this.screenWidth = screenWidth;
    this.screenHeight = screenHeight;
      
    this.gameObjects = [];
    this.playerObjects = [];
    this.debug = false;
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
  
  
  
  
  drawBackground(img=null, pos=createVector(0,0), size=null){
    if (img !== null && size !== null){
        image(img, pos.x, pos.y)
        }
    else if (img !== null){
         image(img, pos.x, pos.y, size.x, size.y)    
             }
    
  }
  

   



  checkAllCollisions(){
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
  
  
  update(){
    background(210);
    
    this.rays = []
    this.toDebug = []

    this.drawBackground(this.backgroundImage, this.backgroundPos, this.backgroundSize)
    frameRate(this.FPS)
    
    this.gameObjectValues = this.gameObjects.map(obj => obj.objectName);
    // Original array
    

    // Extract the inner objects using map
    

     
    

    
    this.checkAllCollisions()
    
    for(let i = 0; i <= this.playerObjects.length - 1; i++){
        this.playerObjects[i].updatePlayer();
    }

    this.enemySystem.update()

    for (const name in this.gameObjectValues) {
    if (this.gameObjectValues.hasOwnProperty(name)) {
      const gameObject = this.gameObjectValues[name];
      
      gameObject.updateComponents();
      gameObject.collidingWith = [];
      
      }}


   
    
    

    this.weaponSystem.update();
    this.projectileSystem.update();

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