import { User } from "./user.js";
import { Vector2 } from "./utils/math.js";
import { RigidBody } from "./rigid_body.js";
import { PhysicsSystem } from "./physics_system.js";
import { Render } from "./utils/render.js";
import { Colors, LineWidths, RenderConstants } from "./settings/render_settings.js";
import { Units } from "./utils/units.js";

export const editor = {
    active: false,
    snap_to_grid: false,
    standard: {
        mass: 1,
        radius: 0.1, // disc
        width: 0.5, // rect
        height: 0.25, // rect
    },
    spawning_rigidbody: false,
    spawning_joint: false,
    spawner: {
        typeof_rigidbody: "disc", // also "rect"
        typeof_joint: "link", // also nothing
        constraint_alpha: 0.0,
    },
    preliminary: { // the entity that is being spawned
        disc: {
            pos: Vector2.zero.clone(),
            radius: 0,
        },
        rect: {
            origin_pos: Vector2.zero.clone(),
            width: 0,
            height: 0,
        },
        link_joint: {
            id1: -1,
            r1: Vector2.zero.clone(),
        }
    },

    /**
     * @param {PhysicsSystem} psystem 
     * @param {Vector2} pos
     * @param {number} mass OPTIONAL
     * @param {number} radius OPTIONAL
     * @param {number} width OPTIONAL
     * @param {number} height OPTIONAL
     */
    spawnRigidBody(psystem, pos, mass, radius, width, height) {
        let body;

        switch (this.spawner.typeof_rigidbody) {
            case "disc":
                body = new RigidBody(pos.clone(), mass ? mass : this.standard.mass, {type: "disc", radius: radius ? radius : this.standard.radius});
                break;
            case "rect":
                body = new RigidBody(pos.clone(), mass ? mass : this.standard.mass, {type: "rect", width: width ? width : this.standard.width, height: height ? height : this.standard.height});
                break;
        
        }

        psystem.bodies.push(body);

    },

    /**
     * @param {PhysicsSystem} psystem 
     * @param {string} type Type of prismatic constraint
     */
    spawnPrismaticConstraint(psystem, type) {
        const info = psystem.getRigidBodyInfoContainingPoint(User.mouse.sim_pos);
        if (body) {
            psystem.addPrismaticJoint(this.spawner.constraint_alpha, type, info.id, info.body.worldToLocal(User.mouse.sim_pos));
        }
    },

    spawnJoint(psystem, type, id1, id2, r1, r2) {
        switch (type) {
            case "link":
                psystem.addLinkJoint(this.spawner.constraint_alpha, id1, id2, r1, r2);
                break;
        }
    },

    update() {
        const pos = this.snap_to_grid ? User.mouse.grid_sim_pos : User.mouse.sim_pos;
        if (this.spawning_rigidbody) {
            switch (this.spawner.typeof_rigidbody) {
                case "disc":
                    this.preliminary.disc.radius = Vector2.distance(this.preliminary.disc.pos, pos);
                    break;
                case "rect":
                    this.preliminary.rect.width = pos.x - this.preliminary.rect.origin_pos.x;
                    this.preliminary.rect.height = pos.y - this.preliminary.rect.origin_pos.y;
                    break;
            }
        }
    },

    render(psystem) {
        Render.c.lineWidth = LineWidths.hologramic_outline * Units.mult_s2c;
        Render.c.fillStyle = Colors.hologramic_spawning;
        Render.c.strokeStyle = Colors.hologramic_spawning_outline;
        if (this.spawning_rigidbody) {
            switch (this.spawner.typeof_rigidbody) {
                case "disc":
                    const disc_pos = this.preliminary.disc.pos;
                    const rad = this.preliminary.disc.radius;
                    Render.arc(disc_pos, rad, true, true);
                    break;
                case "rect":
                    const rect_pos = this.preliminary.rect.origin_pos;
                    const width = this.preliminary.rect.width;
                    const height = this.preliminary.rect.height;
                    Render.rect(rect_pos, new Vector2(width, height), true, true);
                    break;
            }
        }
        if (this.spawning_joint) {
            switch (this.spawner.typeof_joint) {
                case "link":
                    const pos_1 = psystem.bodies[this.preliminary.link_joint.id1].localToWorld(this.preliminary.link_joint.r1);
                    Render.line(pos_1, User.mouse.sim_pos);
            }
        }
    }

}