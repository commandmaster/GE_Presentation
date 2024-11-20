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
       circle(this.entity.components.Transform.position.x + this.posititonialOffset.x, this.entity.components.Transform.position.y + this.posititonialOffset.y, this.radius); 
    }
}
