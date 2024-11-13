import { Render } from "./utils/render.js";
import { Colors, LineWidths } from "./settings/render_settings.js";
import { Units } from "./utils/units.js";
import { Vector2 } from "./utils/math.js";
import { PhysicsSystem } from "./physics_system.js";
import { body_helper } from "./bodies.js";

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

        const world_1 = body_helper.localToWorld(b1, this.r1);
        const world_2 = body_helper.localToWorld(b2, this.r2);
        const dist = Vector2.distance(world_1, world_2);

        const C = dist - this.l0;
        this.n = Vector2.scale(1 / dist, Vector2.sub(world_2, world_1));

        const cross_1 = Vector2.cross(this.r1, this.n);
        const cross_2 = Vector2.cross(this.r2, this.n);

        const w_1 = 1 / b1.mass + (cross_1 ** 2) / b1.I;
        const w_2 = 1 / b2.mass + (cross_2 ** 2) / b2.I;

        this.lambda = -C / (w_1 + w_2 + k);

        b1.pos = Vector2.sub(b1.pos, Vector2.scale(w_1 * this.lambda, this.n));
        b2.pos = Vector2.add(b2.pos, Vector2.scale(w_2 * this.lambda, this.n));

        b1.theta -= this.lambda * cross_1 / b1.I;
        b2.theta += this.lambda * cross_2 / b2.I;

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

        const a1 = body_helper.localToWorld(b1, this.r1);
        const a2 = body_helper.localToWorld(b2, this.r2);

        Render.c.lineCap = "round";

        Render.c.strokeStyle = Colors.outlines;
        Render.c.lineWidth = (LineWidths.link_constraint + LineWidths.lines_outlines) * Units.mult_s2c;
        Render.line(a1, a2);

        Render.c.strokeStyle = Colors.link_constraint;
        Render.c.lineWidth = LineWidths.link_constraint * Units.mult_s2c;
        Render.line(a1, a2);

        const rad = LineWidths.link_constraint / 4;
        Render.c.fillStyle = Colors.outlines;
        Render.arc(a1, rad, false, true);
        Render.arc(a2, rad, false, true);
    }

}

export class FixedYConstraint {
    /**
     * @param {number} alpha Compliancy
     * @param {*} id 
     * @param {*} r Offset LOCAL-SPACE
     * @param {*} y0 Target y-value
     */
    constructor(alpha, id, r, y0) {
        this.alpha = alpha; 

        this.id = id;
        this.r = r;
        this.y0 = y0;

        this.lambda = null;
        this.n = null;
    }

    solve(bodies) {
        // world = pos.y + rx sin theta + ry cos theta
        // C = pos.y + rx sin theta + ry cos theta - y0

        // dC dx = 0
        // dC dy = 1
        // ==> Vector2.up
        // dC dtheta = rx cos theta - ry sin theta

        const sub_dt = PhysicsSystem.dt / PhysicsSystem.sub_steps;
        const k = this.alpha / (sub_dt * sub_dt)

        const b = bodies[this.id];

        const world_r = b.pos.y + this.r.x * Math.sin(b.theta) + this.r.y * Math.cos(b.theta);

        const C = world_r - this.y0;
        this.n = Vector2.up;

        const dC_dtheta = this.r.x * Math.cos(b.theta) - this.r.y * Math.sin(b.theta);

        const w = 1 / b.mass + dC_dtheta * dC_dtheta / b.I;

        this.lambda = - C / (w + k);

        b.pos = Vector2.add(b.pos, Vector2.scale(w * this.lambda, this.n));
        b.theta += this.lambda * dC_dtheta / b.I;

    }

    getConstraintForce() {
        const sub_dt = PhysicsSystem.dt / PhysicsSystem.sub_steps;
        return Vector2.scale(this.lambda / (sub_dt * sub_dt), this.n);
    }

    render(bodies) {
        const b = bodies[this.id];

        const rad = LineWidths.fixed_y_constraint_rad;
        const world = body_helper.localToWorld(b, this.r);

        Render.c.fillStyle = Colors.fixed_y_constraint;
        Render.arc(world, rad, false, true);
    }

}