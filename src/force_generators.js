/*
    Each force generators has to have these methods
    --> apply(bodies)
        Applies the force to some or all bodies
    --> getWorkStored(bodies)
        Returns the work stored in the transforms of the bodies
    --> render(bodies)
        Doesn't need to do anything.
*/

import { Vector2 } from "./utils/math.js";

export class Gravity {
    static gravity = 9.82;

    apply(bodies) {
        const g = Vector2.scale(Gravity.gravity, Vector2.down);
        for (let i = 0; i < bodies.length; i++) {
            // bodies[i].force.add(Vector2.scale(bodies[i].mass, g));
            bodies[i].force = Vector2.add(bodies[i].force, Vector2.scale(bodies[i].mass, g));
        }
    }

    getWorkStored(bodies) {
        let E = 0;
        for (let i = 0; i < bodies.length; i++) {
            E += bodies[i].pos.y * bodies[i].mass * Gravity.gravity;
        }
        return E;
    }

    render(bodies) {

    }

}

export class LinearDamping {
    constructor() {
        this.MU = 0;
    }

    apply(bodies) {
        for (let i = 0; i < bodies.length; i++) {
            bodies[i].force = Vector2.sub(bodies[i].force, Vector2.scale(this.MU, bodies[i].vel));
            bodies[i].tau -= bodies[i].omega * 0.1 * this.MU;
        }
    }

    getWorkStored(bodies) {
        return 0;
    }

    render(bodies) {

    }

}