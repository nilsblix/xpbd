import { Render } from "./utils/render.js";
import { Colors, LineWidths } from "./settings/render_settings.js";
import { Units } from "./utils/units.js";
import { Vector2 } from "./utils/math.js";
import { PhysicsSystem } from "./physics_system.js";

/*
    All constraints must have these methods:
        solve(bodies)
            Solves the constraint
        getConstraintForce()
            Returns the force the constraint is applying
        render(bodies)
            Renders the constraint
*/

export class OffsetLinkConstraint {
    /**
     * @param {number} alpha Compliancy
     * @param {number} id1 
     * @param {number} id2 
     * @param {number} r1 Local space to body 1
     * @param {number} r2 Local space to body 2
     * @param {number} l0 rest length
     */
    constructor(alpha, id1, id2, r1, r2, l0) {
        this.alpha = alpha; 

        this.id1 = id1;
        this.r1 = r1;
        this.id2 = id2;
        this.r2 = r2;
        this.l0 = l0;

        this.lambda = null;
        this.n = null;
    }

    /**
     * @param {[]} bodies 
     * @returns {void}
     */
    solve(bodies) {

        const sub_dt = PhysicsSystem.dt / PhysicsSystem.sub_steps;
        const k = this.alpha / (sub_dt * sub_dt)

        const b1 = bodies[this.id1];
        const b2 = bodies[this.id2];

        const world_1 = b1.localToWorld(this.r1);
        const world_2 = b2.localToWorld(this.r2);
        const dist = Vector2.distance(world_1, world_2);

        const C = dist - this.l0;
        this.n = Vector2.scale(1 / dist, Vector2.sub(world_2, world_1));

        const cross_1 = Vector2.cross(this.r1, this.n);
        const cross_2 = Vector2.cross(this.r2, this.n);

        const w_1 = 1 / b1.mass + (cross_1 ** 2) / b1.I;
        const w_2 = 1 / b2.mass + (cross_2 ** 2) / b2.I;

        this.lambda = -C / (w_1 + w_2 + k);

        b1.pos = Vector2.add(b1.pos, Vector2.scale(w_1 * this.lambda, this.n));
        b2.pos = Vector2.sub(b2.pos, Vector2.scale(w_2 * this.lambda, this.n));

        b1.theta += this.lambda * cross_1 / b1.I;
        b2.theta -= this.lambda * cross_2 / b2.I;

    }

    /**
     * n is from body 1 to body 2
     * @returns {Vector2} the force the constraint is applying.
     */
    getConstraintForce() {
        const sub_dt = PhysicsSystem.dt / PhysicsSystem.sub_steps;
        return Vector2.scale(this.lambda / (sub_dt * sub_dt), this.n);
    }

    render(bodies) {
        const b1 = bodies[this.id1];
        const b2 = bodies[this.id2];

        const a1 = b1.localToWorld(this.r1);
        const a2 = b2.localToWorld(this.r2);

        Render.c.strokeStyle = Colors.link_constraint;
        Render.c.lineWidth = LineWidths.link_constraint * Units.mult_s2c;
        Render.line(a1, a2);
    }

}