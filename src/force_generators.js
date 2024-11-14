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
import { PhysicsSystem } from "./physics_system.js";
import { Units } from "./utils/units.js";
import { Render } from "./utils/render.js";
import { User } from "./user.js";

export class Gravity {
    apply(bodies) {
        const g = Vector2.scale(PhysicsSystem.GRAVITY, Vector2.down);
        for (let i = 0; i < bodies.length; i++) {
            // bodies[i].force.add(Vector2.scale(bodies[i].mass, g));
            bodies[i].force = Vector2.add(bodies[i].force, Vector2.scale(bodies[i].mass, g));
        }
    }

    getWorkStored(bodies) {
        let E = 0;
        for (let i = 0; i < bodies.length; i++) {
            E += bodies[i].pos.y * bodies[i].mass * PhysicsSystem.GRAVITY;
        }
        return E;
    }

    render(bodies) {

    }

}

export class EnergyDamping {
    apply(bodies) {
        for (let i = 0; i < bodies.length; i++) {
            bodies[i].force = Vector2.sub(bodies[i].force, Vector2.scale(PhysicsSystem.ENERGY_DAMP_MU, bodies[i].vel));
            bodies[i].tau -= 0.01 * PhysicsSystem.ENERGY_DAMP_MU * bodies[i].omega;
        }
    }

    getWorkStored(bodies) {
        return 0;
    }

    render(bodies) {
        return;
    }
}

export class SpringJoint {
    /**
     * 
     * @param {number} id1 
     * @param {Vector2} r1 
     * @param {number} id2 
     * @param {Vector2} r2 
     */
    constructor(id1, r1, id2, r2) {
        this.id1 = id1;
        this.r1 = r1;
        this.id2 = id2;
        this.r2 = r2;

        this.l0 = 0.05;
    }

    apply(bodies) {
        const b1 = bodies[this.id1];
        const b2 = bodies[this.id2];

        const a1 = b1.localToWorld(this.r1);
        const a2 = b2.localToWorld(this.r2);

        const dist = Vector2.distance(a1, a2);
        const hookes = dist - this.l0;
        const force_value = PhysicsSystem.SPRING_JOINT_STIFFNESS * hookes;

        const force = Vector2.scale(force_value * 1 / dist, Vector2.sub(a2, a1));

        // linear force
        b1.force.set(Vector2.add(b1.force, force));
        b2.force.set(Vector2.sub(b2.force, force));

        b1.tau += Vector2.cross(Vector2.sub(a1, b1.pos), force);
        b2.tau += Vector2.cross(Vector2.sub(a2, b2.pos), Vector2.negate(force));

    }

    getWorkStored(bodies) {
        const b1 = bodies[this.id1];
        const b2 = bodies[this.id2];

        const a1 = b1.localToWorld(this.r1);
        const a2 = b2.localToWorld(this.r2);

        const dist = Vector2.distance(a1, a2);
        const hookes = dist - this.l0;
        return 1 / 2 * PhysicsSystem.SPRING_JOINT_STIFFNESS * hookes * hookes;
    }

    render(bodies) {
        const b1 = bodies[this.id1];
        const b2 = bodies[this.id2];

        const a1 = b1.localToWorld(this.r1);
        const a2 = b2.localToWorld(this.r2);

        Render.c.strokeStyle = "#ffffff";
        Render.c.lineWidth = 0.08 * Units.mult_s2c;
        Render.line(a1, a2);
    }

}

export class MouseSpring {
    constructor() {
        this.active = false;
        this.id = -1;
        this.r = Vector2.zero.clone();
        this.l0 = 0.05;
    }

    /**
     * 
     * @param {RigidBody} body 
     */
    bodyIsValid(body, body_index) {
        if (body.insideBoundingBox(User.mouse.sim_pos)) {
            this.id = body_index;
            this.r = body.worldToLocal(User.mouse.sim_pos);
            return true;
        }
        return false;
    }

    apply(bodies) {
        const b = bodies[this.id];

        const a = b.localToWorld(this.r);

        const dist = Vector2.distance(User.mouse.sim_pos, a);
        if (dist == 0) return;
        const hookes = dist - this.l0;
        const force_value = PhysicsSystem.MOUSESPRING_JOINT_STIFFNESS * hookes;

        const n = Vector2.scale(1 / dist, Vector2.sub(User.mouse.sim_pos, a));
        const force = Vector2.scale(force_value, n);

        // apply forces
        b.force.set(Vector2.add(b.force, force));
        b.tau += Vector2.cross(Vector2.sub(a, b.pos), force);
    }

    render(bodies) {
        const b = bodies[this.id];
        const a = b.localToWorld(this.r);

        Render.c.strokeStyle = "#ff0000";
        Render.c.lineWidth = 0.08 * Units.mult_s2c;
        Render.line(a, User.mouse.sim_pos);

    }

}