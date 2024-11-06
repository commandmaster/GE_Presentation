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
    constructor(){
        this.components = [];
    }

    render(){
        this.components.forEach(component => component.render());
    }
}

