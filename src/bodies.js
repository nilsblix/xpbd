/*
    All bodies should have these things:
    Properties:
        Position
        Velocity
        Force (accumulated through the frame)
        Mass

        Theta (angle)
        Omega (angle vel)
        Tau (accumulated through the frame)
        Inertia
    Methods:
        render
*/

import { Render } from "./utils/render.js";
import { Colors, LineWidths } from "./settings/render_settings.js";
import { Units } from "./utils/units.js";
import { Vector2 } from "./utils/math.js";

export class DiscBody {
    /**
     * @param {Vector2} pos SIM
     * @param {number} radius SIM
     * @param {number} mass 
     */
    constructor(pos, radius, mass) {
        this.pos = pos;
        this.prev_pos = pos;
        this.vel = Vector2.zero;
        this.force = Vector2.zero;
        this.mass = mass;

        this.theta = 0;
        this.prev_theta = 0;
        this.omega = 0;
        this.tau = 0;
        this.I = 1/2 * mass * radius ** 2;

        this.radius = radius;
    }

    /**
     * From offset around COM to world-space (sim-space)
     * @param {Vector2} r Offset in local-space
     * @returns {Vector2}
     */
    localToWorld(r) {
        const rotated_local = Vector2.rotateByAngle(r, this.theta);
        const w = Vector2.add(rotated_local, this.pos);
        return w;
    }

    /**
     * From world-space (sim-space) to offset around COM.
     * @param {*} Point in world-space (sim-space)
     * @returns {Vector2}
     */
    worldToLocal(w) {
        const rotated_local = Vector2.sub(w, this.pos);
        const r = Vector2.rotateByAngle(rotated_local, -this.theta);
        return r;
    }

    /**
     * @param {Vector2} r 
     * @returns {Vector2} The velocity the offset vector r is experiencing
     */
    getLocalVel(r) {
        // |v| = r * omega
        const mag = r.magnitude();
        const n = Vector2.scale(1 / mag, r);
        const dir = new Vector2(-n.x, n.x);
        return Vector2.scale(dir, mag * this.omega);
    }

    /**
     * Returns body's linear vel + point r angular vel around body's COM
     * @param {Vector2} r 
     * @returns {Vector2} body linear vel + point r angular vel around body COM
     */
    getWorldVel(r) {
        return Vector2.add(this.vel, this.getLocalVel(r));
    }

    render() {
        Render.c.fillStyle = Colors.disc_body;
        Render.c.strokeStyle = Colors.outlines;
        Render.c.lineWidth = Units.mult_s2c * LineWidths.bodies;
        Render.arc(this.pos, this.radius, true, true);

        const rot_radius = this.radius / 8;
        const r = Vector2.right.clone().rotateByAngle(this.theta);
        r.scale(this.radius / 2);
        r.add(this.pos);
        Render.arc(r, rot_radius, true, false);
    }

}