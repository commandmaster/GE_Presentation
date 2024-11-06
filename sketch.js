class Runtime{
    constructor(){
        this.components = [];
    }

    render(){
        this.components.forEach(component => component.render());
    }
}

class API{
  constructor(runtime){
    this.runtime = runtime;
  }

  addComponent(component){
    this.runtime.components.push(component);
  }

  updateComponents(){
    this.runtime.components.forEach(component => component.update());
  }
}

class Circle{
    constructor(x, y, radius){
        this.x = x;
        this.y = y;
        this.radius = radius;
    }

    render(){
        ellipse(this.x, this.y, this.radius);
    }

    update(){
        this.x += 1;
    }
}


let runtime = new Runtime();
let api = new API(runtime);

function setup() {
  createCanvas(windowWidth, windowHeight);
  api.addComponent(new Circle(100, 100, 50));

}

function draw() {
  background(220);

  api.updateComponents();
  runtime.render();
}


class Player{
  constructor(x, y, radius){
    this.x = x;
    this.y = y;

    this.radius = radius;
  }

}
