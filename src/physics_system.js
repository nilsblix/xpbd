import { Render } from "./utils/render.js";
import { Colors, LineWidths } from "./settings/render_settings.js";
import { Units } from "./utils/units.js";
import { Vector2 } from "./utils/math.js";

import { Gravity } from "./force_generators.js";

export class PhysicsSystem {

    static dt = 1 / 120;
    static pdt = -1;
    static rdt = -1;
    static sub_steps = 5;

    static simulating = false;

    constructor() {
        this.bodies = [];
        this.force_generators = [];
        this.constraints = [];

        this.force_generators.push(new Gravity());
    }

    process() {

        if (!PhysicsSystem.simulating) return;

        const sub_dt = PhysicsSystem.dt / PhysicsSystem.sub_steps;

        for (let s = 0; s < PhysicsSystem.sub_steps; s++) {

            // forces
            for (let i = 0; i < this.force_generators.length; i++) {
                this.force_generators[i].apply(this.bodies);
            }

            // integrate
            for (let i = 0; i < this.bodies.length; i++) {
                const a = this.bodies[i];

                a.prev_pos.set(a.pos);
                a.prev_theta = a.theta;

                // linear integration
                const acc = Vector2.scale(1 / a.mass, a.force);
                a.vel = Vector2.add(a.vel, Vector2.scale(sub_dt, acc));
                a.pos = Vector2.add(a.pos, Vector2.scale(sub_dt, a.vel));
                a.force.set(new Vector2(0, 0));

                // angular integration
                const alpha = a.tau / a.I;
                a.omega += alpha * sub_dt;
                a.theta += a.omega * sub_dt;
                a.tau = 0;
            }

            // solve constraints
            for (let i = 0; i < this.constraints.length; i++) {
                this.constraints[i].solve(this.bodies);
            }

            // update velocities
            for (let i = 0; i < this.bodies.length; i++) {
                const a = this.bodies[i];

                a.vel.set(Vector2.scale(1 / sub_dt, Vector2.sub(a.pos, a.prev_pos)));
                a.omega = (a.theta - a.prev_theta) / sub_dt;
            }

        }

    }

    render() {
        for (let i = 0; i < this.bodies.length; i++) {
            this.bodies[i].render();
        }

        for (let i = 0; i < this.constraints.length; i++) {
            this.constraints[i].render(this.bodies);
        }
    }

}