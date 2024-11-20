let gameEngine;

function setup() {
  createCanvas(windowWidth, windowHeight);

  gameEngine = new GameEngine();

  let mainPlayer = new Entity({x: 200, y: 100});
  console.log(mainPlayer.getComponent(Transform));


  gameEngine.addEntity(mainPlayer);
}

function draw() {
  background(220);

  gameEngine.update();
}


class Entity{
  constructor(position = {x, y}){
    this.components = {};
    this.priorityMap = new Map();
    
    const transform = new Transform(this, position, 0, 1);
    this.addComponent(transform, 0);

    const circleRenderer = new CircleRenderer(this, 50, color(255, 0, 0), {x: 0, y: 0});
    this.addComponent(circleRenderer, 1);
  }

  #orderComponents(){
    this.priorityMap = new Map([...this.priorityMap.entries()].sort((a, b) => a[0] - b[0]));
  }

  bind(engine){
    this.engine = engine;
  }

  addComponent(component, priority){
    this.components[component.constructor.name] = component;
    this.priorityMap.set(priority, component.constructor.name); 

    this.#orderComponents();
  }

  getComponent(component){
    if (typeof component === "string"){
      return this.components[component];
    }
    else if (component.constructor){
      console.log(component.prototype.constructor);
      return this.components[component.prototype.constructor.name];
    }
    else{
      throw new Error("Component type not supported");
    }
  }

  start(){
    if(!this.engine instanceof GameEngine)
      throw new Error("Engine not bound");
  }

  update(){
    for(let componentName in this.components){
      this.components[componentName].update();
    }

    for(let componentName in this.components){
      this.components[componentName].render();
    }
  }
}

class GameEngine {
  constructor() {
    this.entities = [];

    // p5js setup
    noStroke();

    // debugging
    this.debugMode = false;

    for (let entity of this.entities)
    {
      entity.start();
    }
  }


  addEntity(entityInstance){
    this.entities.push(entityInstance); 
    entityInstance.bind(this);
  }
  

  update(){
    for (let entity of this.entities)
    {
      entity.update();
    } 
  }
}