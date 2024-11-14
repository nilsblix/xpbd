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

export class RigidBody {
    /**
     * @param {Vector2} pos SIM
     * @param {number} mass 
     * @param {{type: "disc" || "rect} etc, radius?, vertices?}
     */
    constructor(pos, mass, geometry) {
        this.pos = pos;
        this.prev_pos = pos;
        this.vel = Vector2.zero;
        this.force = Vector2.zero;
        this.mass = mass;

        this.theta = 0;
        this.prev_theta = 0;
        this.omega = 0;
        this.tau = 0;
        this.I;

        this.geometry = {
            type: geometry.type, 
            radius: geometry.radius, 
            width: geometry.width, 
            height: geometry.height,
            local_vertices: [],
            world_vertices: [], // gets updated in render
            bounding_box: {min: Vector2.zero.clone(), max: Units.DIMS.clone()}, // gets updated in render.
        };

        if (geometry.type == "disc") {
            this.I = 1/2 * mass * geometry.radius * geometry.radius;
        } else if (geometry.type == "rect") {
            this.I = 1/12 * mass * (geometry.width ** 2 + geometry.height ** 2);

            this.geometry.local_vertices = [
                new Vector2(-geometry.width/2, -geometry.height/2),
                new Vector2(-geometry.width/2,  geometry.height/2),
                new Vector2( geometry.width/2,  geometry.height/2),
                new Vector2( geometry.width/2, -geometry.height/2),
            ];  

        }

    }

    getKineticEnergy() {
        return 1/2 * this.mass * this.vel.sqr_magnitude() + 1/2 * this.I * Math.abs(this.omega * this.omega);
    }

    /**
     * @param {Vector2} p Point one is testing is inside or not
     * @returns {boolean}
     */
    insideBoundingBox(p) {
        const max = this.geometry.bounding_box.max;
        const min = this.geometry.bounding_box.min;
        switch (this.geometry.type) {
            case "disc":
                return  (p.x > this.pos.x - this.geometry.radius) &&
                        (p.x < this.pos.x + this.geometry.radius) && 
                        (p.y > this.pos.y - this.geometry.radius) &&
                        (p.y < this.pos.y + this.geometry.radius);
            case "rect":
                return  (p.x > min.x) &&
                        (p.x < max.x) && 
                        (p.y > min.y) &&
                        (p.y < max.y);
        }
    }

    render() {

        this.geometry.bounding_box.max = this.pos.clone();
        this.geometry.bounding_box.min = this.pos.clone();

        if (this.geometry.type == "disc") {

            this.geometry.bounding_box.max = new Vector2(this.pos.x + this.geometry.radius, this.pos.y + this.geometry.radius);
            this.geometry.bounding_box.min = new Vector2(this.pos.x - this.geometry.radius, this.pos.y - this.geometry.radius);

            Render.c.fillStyle = Colors.disc_body;
            Render.c.strokeStyle = Colors.outlines;
            Render.c.lineWidth = Units.mult_s2c * LineWidths.bodies;
            Render.arc(this.pos, this.geometry.radius, true, true);

            const rot_radius = this.geometry.radius / 8;
            const r_world = this.localToWorld(new Vector2(3 * this.geometry.radius / 4, 0))
            Render.c.fillStyle = Colors.outlines;
            Render.arc(r_world, rot_radius, true, true);
        } else if (this.geometry.type == "rect") {
            this.geometry.world_vertices = [];
            for (let i = 0; i < this.geometry.local_vertices.length; i++) {
                this.geometry.world_vertices.push(this.localToWorld(this.geometry.local_vertices[i]));
            }

            const max = this.geometry.bounding_box.max;
            const min = this.geometry.bounding_box.min;

            for (let i = 0; i < this.geometry.world_vertices.length; i++) {
                const p = this.geometry.world_vertices[i];
                if (p.x > max.x) max.x = p.x;
                if (p.y > max.y) max.y = p.y;
                if (p.x < min.x) min.x = p.x;
                if (p.y < min.y) min.y = p.y;
            }

            Render.c.fillStyle = Colors.rect_body;
            Render.c.strokeStyle = Colors.outlines;
            Render.c.lineWidth = Units.mult_s2c * LineWidths.bodies;
            Render.polygon(this.geometry.world_vertices, true, true);
        }

        Render.c.strokeStyle = Colors.bodies_bounding_box;
        Render.rect(this.geometry.bounding_box.min, new Vector2(this.geometry.bounding_box.max.x - this.geometry.bounding_box.min.x, 
                                                                this.geometry.bounding_box.max.y - this.geometry.bounding_box.min.y), true, false);

    }

    /**
     * From offset around COM to world-space (sim-space)
     * @param {Body} body
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
     * @param {Body} body
     * @param {*} Point in world-space (sim-space)
     * @returns {Vector2}
     */
    worldToLocal(w) {
        const rotated_local = Vector2.sub(w, this.pos);
        const r = Vector2.rotateByAngle(rotated_local, -this.theta);
        return r;
    }

    /**
     * @param {Body} body
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

}

// export class DiscBody {
//     /**
//      * @param {Vector2} pos SIM
//      * @param {number} radius SIM
//      * @param {number} mass 
//      */
//     constructor(pos, radius, mass) {
//         this.pos = pos;
//         this.prev_pos = pos;
//         this.vel = Vector2.zero;
//         this.force = Vector2.zero;
//         this.mass = mass;

//         this.theta = 0;
//         this.prev_theta = 0;
//         this.omega = 0;
//         this.tau = 0;
//         this.I = 1/2 * mass * radius ** 2;

//         this.radius = radius;
//     }

//     render() {
//         Render.c.fillStyle = Colors.disc_body;
//         Render.c.strokeStyle = Colors.outlines;
//         Render.c.lineWidth = Units.mult_s2c * LineWidths.bodies;
//         Render.arc(this.pos, this.radius, true, true);

//         const rot_radius = this.radius / 8;
//         const r = Vector2.right.clone().rotateByAngle(this.theta);
//         r.scale(this.radius / 2);
//         r.add(this.pos);
//         Render.c.fillStyle = Colors.outlines;
//         Render.arc(r, rot_radius, true, true);
//     }

// }

// export class RectBody {
//     /**
//      * 
//      * @param {Vector2} pos 
//      * @param {number} mass 
//      * @param {[Vector2]} vertices 
//      */
//     constructor(pos, mass, width, height) {
//         this.pos = pos;
//         this.prev_pos = pos;
//         this.vel = Vector2.zero;
//         this.force = Vector2.zero;
//         this.mass = mass;

//         this.theta = 0;
//         this.prev_theta = 0;
//         this.omega = 0;
//         this.tau = 0;
//         // this.I = 1/2 * mass * radius ** 2;
//         this.I = 1 / 12 * mass * (width * width + height * height);

//         this.vertices = [
//             new Vector2(-width/2, -height/2),
//             new Vector2(-width/2,  height/2),
//             new Vector2( width/2,  height/2),
//             new Vector2( width/2, -height/2),
//         ];
//     }

//     render() {
        

//     }
// }