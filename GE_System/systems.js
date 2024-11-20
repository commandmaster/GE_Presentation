class BaseSystem{
    constructor(engine){ this.engine = engine; }
    start(){}
    update(){}
}

class PhysicsSystem extends BaseSystem{
    constructor(engine){
        super(engine);
    }

    resolveCollision(body1, body2) {
        // Step 1: Calculate the relative velocity
        const pos1 = body1.entity.getComponent(Transform).position;
        const pos2 = body2.entity.getComponent(Transform).position;

        const relativeVelocity = {
            x: body2.velocity.x - body1.velocity.x,
            y: body2.velocity.y - body1.velocity.y,
        };

        // Step 2: Calculate the normal vector
        const normal = {
            x: pos2.x - pos1.x,
            y: pos2.y - pos1.y,
        };

        // Calculate the magnitude of the normal vector
        const distance = Math.sqrt(normal.x ** 2 + normal.y ** 2);

        // Prevent division by zero in case of overlapping bodies
        if (distance === 0) return;

        const normalUnit = {
            x: normal.x / distance,
            y: normal.y / distance,
        };

        // Step 3: Calculate the velocity along the normal
        const velocityAlongNormal = 
            relativeVelocity.x * normalUnit.x +
            relativeVelocity.y * normalUnit.y;

        // If velocities are separating, no collision resolution is needed
        if (velocityAlongNormal > 0) return;

        // Step 4: Calculate restitution (elasticity, assuming 1 for perfect elastic collision)
        const restitution = 1; // Modify this if you want inelastic collisions

        // Step 5: Calculate the impulse scalar
        const impulseScalar = 
            -(1 + restitution) * velocityAlongNormal /
            (1 / body1.mass + 1 / body2.mass);

        // Step 6: Calculate impulse vector
        const impulse = {
            x: impulseScalar * normalUnit.x,
            y: impulseScalar * normalUnit.y,
        };

        // Step 7: Apply impulse to both bodies
        body1.velocity.x -= impulse.x / body1.mass;
        body1.velocity.y -= impulse.y / body1.mass;

        body2.velocity.x += impulse.x / body2.mass;
        body2.velocity.y += impulse.y / body2.mass;
    }


    start(){

    }

    update(){
        for (let entity1 of this.engine.entities) {
            const rigidbody1 = entity1.getComponent(Rigidbody);
            if (!rigidbody1) continue;

            for (let entity2 of this.engine.entities) {
                const rigidbody2 = entity2.getComponent(Rigidbody);
                if (!rigidbody2 || !rigidbody2.isColliding(rigidbody1) || entity1.id === entity2.id) continue;

                this.resolveCollision(rigidbody2, rigidbody1);
                console.log("resolving")
            }
        }
    }
}