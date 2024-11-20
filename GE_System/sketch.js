let gameEngine;


function setup() {
    // GameSetup

    gameEngine = new GameEngine();

    let mainPlayer = new Entity({x: 200, y: 100});
    mainPlayer.addComponent(new Rigidbody(mainPlayer, 25, 1, {x:50, y:0}), -1);

    let secondPlayer = new Entity({x: 600, y: 100});
    secondPlayer.addComponent(new Rigidbody(secondPlayer, 25, 1, {x:-50, y:0}), -1);


    gameEngine.addEntity(mainPlayer);
    gameEngine.addEntity(secondPlayer);


}

function draw() {
    background(220);

    gameEngine.update();
}


class Entity{
    constructor(position = {x, y}){
        this.engine = null;
        this.id = null;

        this.components = {};
        this.priorityMap = new Map();
        
        const transform = new Transform(this, position, 0, 1);
        this.addComponent(transform, 0);

        const circleRenderer = new CircleRenderer(this, 25, color(255, 0, 0), {x: 0, y: 0});
        this.addComponent(circleRenderer, 1);
    }

    #orderComponents(){
        this.priorityMap = new Map([...this.priorityMap.entries()].sort((a, b) => a[0] - b[0]));
    }

    bind(engine, uuid){
        this.engine = engine;
        this.id = uuid;
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
            return this.components[component.prototype.constructor.name];
        }
        else{
            throw new Error("Component type not supported");
        }
    }

    start(){
        if(!this.engine instanceof GameEngine)
            throw new Error("Engine not bound");

        for(let componentName in this.components){
            this.components[componentName].start();
        } 
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
        this.idCounter = 0;

        // p5js setup
        createCanvas(windowWidth, windowHeight);
        noStroke();

        // debugging
        this.debugMode = true;


        this.systems = [
            new PhysicsSystem(this),

        ];

        for (const system of this.systems)
        {
            system.start();
        }

        for (let entity of this.entities)
        {
            entity.start();
        }
    }

    addEntity(entityInstance){
        this.entities.push(entityInstance); 
        entityInstance.bind(this, this.idCounter);

        this.idCounter++;
    }
    

    update(){
        for (const system of this.systems)
        {
            system.update();
        }

        for (let entity of this.entities){
            entity.update();
        } 
    }
}