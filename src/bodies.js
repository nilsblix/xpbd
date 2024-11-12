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
        this.vel = Vector2.zero;
        this.force = Vector2.zero;
        this.mass = mass;

        this.theta = 0;
        this.omega = 0;
        this.tau = 0;
        this.I = 1/2 * mass * radius ** 2;

        this.radius = radius;
    }

    render() {
        Render.c.fillStyle = Colors.disc_body;
        Render.c.strokeStyle = Colors.outlines;
        Render.c.lineWidth = Units.mult_s2c * LineWidths.bodies;
        Render.arc(this.pos, this.radius, true, true);

        const rot_radius = this.radius / 8;
        const r = Vector2.right.clone().rotateByAngle(this.theta);
        r.scale(1/2);
        r.add(this.pos);
        Render.arc(r, rot_radius, true, false);
    }

}