class ComponentBase{
    constructor(entity){ this.entity = entity; }
    start(){}
    update(){}
    render(){}
}
 
class Transform extends ComponentBase{
  constructor(entity, position = {x, y}, rotation = 0, scale){
    super(entity);

    this.position = position;
    this.rotation = rotation;
    this.scale = scale;
  }    
}

class CircleRenderer extends ComponentBase {
    constructor(entity, radius, p5Color, posititonialOffset = {x: 0, y: 0}){
        super(entity);
        this.radius = radius;
        this.p5Color = p5Color;
        this.posititonialOffset = posititonialOffset;
    }

    render(){
       circle(this.entity.components.Transform.position.x + this.posititonialOffset.x, this.entity.components.Transform.position.y + this.posititonialOffset.y, this.radius * 2); 
    }
}

class Rigidbody extends ComponentBase{
    constructor(entity, radius, mass, velocity = {x: 0, y:0}){
        super(entity);

        this.radius = radius;
        this.mass = mass;

        this.velocity = velocity;
        this.acceleration = {x: 0, y:0};

    }

    move(dt){
        this.velocity.x += this.acceleration.x * dt; 
        this.velocity.y += this.acceleration.y * dt; 

        this.entity.getComponent(Transform).position.x += this.velocity.x * dt;
        this.entity.getComponent(Transform).position.y += this.velocity.y * dt;
    }

    isColliding(otherRb){
        return (otherRb.radius + this.radius) > dist(otherRb.entity.getComponent(Transform).position.x, otherRb.entity.getComponent(Transform).position.y, this.entity.getComponent(Transform).position.x, this.entity.getComponent(Transform).position.y);
    }

    start(){
        this.type = "dynamic";

        if (this.entity.getComponent(CircleRenderer)){
            this.entity.getComponent(CircleRenderer).radius = this.radius;
        }

    }

    update(){
        const dt = deltaTime / 1000;
        this.move(dt);
    }

    render(){
        if (!this.entity.engine.debugMode) return;

        stroke("Green");
        strokeWeight(1);
        circle(this.entity.getComponent(Transform).position.x, this.entity.getComponent(Transform).position.y, this.radius*2);
        noStroke();
    }
}