import { Render } from "./utils/render.js";
import { Colors, LineWidths } from "./settings/render_settings.js";
import { Units } from "./utils/units.js";
import { Vector2 } from "./utils/math.js";

import { Gravity } from "./force_generators.js";

export class PhysicsSystem {
    constructor() {
        this.bodies = [];
        this.force_generators = [];
        this.constraints = [];

        this.simulating = false;
        this.dt = 1/120;

        this.force_generators.push(new Gravity());
    }

    process() {

        for (let i = 0; i < this.force_generators.length; i++) {
            this.force_generators[i].apply(this.bodies);
        }

        for (let i = 0; i < this.bodies.length; i++) {
            const a = this.bodies[i];

            // Positional integration
            const acc = Vector2.scale(1 / a.mass, a.force);
            a.vel = Vector2.add(a.vel, Vector2.scale(this.dt, acc));
            a.pos = Vector2.add(a.pos, Vector2.scale(this.dt, a.vel));
            a.force.set(new Vector2(0,0));

            console.log("vel", a.vel.magnitude());

            // Rotational integration
            const alpha = a.tau / a.I;
            a.omega += alpha * this.dt;
            a.theta += a.omega * this.dt;
            a.tau = 0;
        }
    }

    render() {
        for (let i = 0; i < this.bodies.length; i++) {
            this.bodies[i].render();
        }
    }

}