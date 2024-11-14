import { Render } from "./utils/render.js";
import { Colors, LineWidths } from "./settings/render_settings.js";
import { Units } from "./utils/units.js";
import { Vector2 } from "./utils/math.js";

import {Gravity, EnergyDamping, MouseSpring} from "./force_generators.js";

import { User } from "./user.js";

export class PhysicsSystem {

    static EPS = 1E-8;

    static dt = 1 / 120;
    static pdt = -1;
    static rdt = -1;
    static sub_steps = 1;

    static energy = 0;

    static simulating = false;

    // constants
    static GRAVITY = 9.82;
    static ENERGY_DAMP_MU = 0E-1;
    static SPRING_JOINT_STIFFNESS = 20;
    static MOUSESPRING_JOINT_STIFFNESS = 20;

    // static objects
    static mouse_spring = new MouseSpring();


    constructor() {
        this.bodies = [];
        this.force_generators = [];
        this.constraints = [];

        this.force_generators.push(new Gravity());
        this.force_generators.push(new EnergyDamping());

    }

    handleMouseSpring() {
        if (User.mouse.left_down && !PhysicsSystem.mouse_spring.active) {
            for (let i = 0; i < this.bodies.length; i++) {
                if (PhysicsSystem.mouse_spring.bodyIsValid(this.bodies[i], i)) {
                    PhysicsSystem.mouse_spring.active = true;
                }
            }
        }

        if (!User.mouse.left_down && PhysicsSystem.mouse_spring.active) {
            PhysicsSystem.mouse_spring.active = false;
        }

        if (PhysicsSystem.mouse_spring.id == -1) {
            PhysicsSystem.mouse_spring.active = false;
        }
    }

    process() {

        this.handleMouseSpring();

        if (!PhysicsSystem.simulating) return;

        const sub_dt = PhysicsSystem.dt / PhysicsSystem.sub_steps;

        for (let s = 0; s < PhysicsSystem.sub_steps; s++) {

            // forces
            for (let i = 0; i < this.force_generators.length; i++) {
                this.force_generators[i].apply(this.bodies);
            }

            if (PhysicsSystem.mouse_spring.active) 
                PhysicsSystem.mouse_spring.apply(this.bodies);

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

            // collide with floor:
            for (let i = 0; i < this.bodies.length; i++) {
                const b = this.bodies[i];
                if (b.pos.y < b.radius)
                    b.pos.y = b.radius
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
            this.bodies[i].render(false);
        }

        for (let i = 0; i < this.constraints.length; i++) {
            this.constraints[i].render(this.bodies);
        }

        for (let i = 0; i < this.force_generators.length; i++) {
            this.force_generators[i].render(this.bodies);
        }

        if (PhysicsSystem.mouse_spring.active)
            PhysicsSystem.mouse_spring.render(this.bodies);

    }

    getSystemEnergy() {
        let E = 0;
        for (let i = 0; i < this.force_generators.length; i++) {
            E += this.force_generators[i].getWorkStored(this.bodies);
        }

        for (let i = 0; i < this.bodies.length; i++) {
            E += this.bodies[i].getKineticEnergy();
        }

        return E;

    }

}