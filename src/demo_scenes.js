import { Render } from "./utils/render.js";
import { Colors, LineWidths } from "./settings/render_settings.js";
import { Units } from "./utils/units.js";
import { Vector2 } from "./utils/math.js";

import { PhysicsSystem } from "./physics_system.js";
import { RigidBody } from "./rigid_body.js";
import { OffsetLinkConstraint, PrismaticConstraint } from "./constraints.js";
import { SpringJoint } from "./force_generators.js";

/**
 * Setups up a scene. Make sure prev-scene is the nothing scene.
 * @param {string} ver 
 * @returns {void}
 */
export function setupScene(ver, psystem) {
    switch (ver) {
        case "test 1":
            // 3 1 2 4
            const body1 = new RigidBody(new Vector2(5, 4), 5, {type: "rect", width: 1.7, height: 1.2});
            const body2 = new RigidBody(new Vector2(7, 4), 1, {type: "rect", width: 2, height: 0.4});
            const body3 = new RigidBody(new Vector2(3, 4), 1, {type: "rect", width: 2, height: 0.4});
            const body4 = new RigidBody(new Vector2(8.5, 4), 3, {type: "disc", radius: 0.5});

            psystem.bodies.push(body1);
            psystem.bodies.push(body2);
            psystem.bodies.push(body3);
            psystem.bodies.push(body4);

            // psystem.force_generators.push(new SpringJoint(2, Vector2.zero.clone(), 3, Vector2.zero.clone()));

            const left_r = new Vector2(0.75, 0);
            const right_r = new Vector2(-0.75, 0);

            const circle_r = new Vector2(-0.25, 0);
            const circle_fixed_r = new Vector2(0.4, 0);

            const fixed_1 = new PrismaticConstraint(0, 2, right_r, body3.pos.y + right_r.y);
            const fixed_2 = new PrismaticConstraint(0, 3, circle_fixed_r, body4.pos.y + circle_fixed_r.y);

            const link_1 = new OffsetLinkConstraint(0, 2, 0, left_r, right_r, Vector2.distance(body3.localToWorld(left_r), body1.localToWorld(right_r)));
            const link_2 = new OffsetLinkConstraint(0, 0, 1, left_r, right_r, Vector2.distance(body1.localToWorld(left_r), body2.localToWorld(right_r)));
            const link_3 = new OffsetLinkConstraint(0, 1, 3, left_r, circle_r, Vector2.distance(body2.localToWorld(left_r), body4.localToWorld(circle_r)));

            psystem.constraints.push(fixed_1);
            // psystem.constraints.push(fixed_2);
            
            psystem.constraints.push(link_1);
            psystem.constraints.push(link_2);
            psystem.constraints.push(link_3);

            break;

        case "test 2":
            const b0 = new RigidBody(new Vector2(5, 4), 1, {type: "rect", width: 3.0, height: 0.5});
            const b1 = new RigidBody(new Vector2(8, 4), 1, {type: "rect", width: 3.0, height: 0.5});

            psystem.bodies.push(b0);
            psystem.bodies.push(b1);

            psystem.force_generators.push(new SpringJoint(0, new Vector2(0,0), 1, new Vector2(0,0)));

            const fixed_0 = new PrismaticConstraint(0.0, 0, new Vector2(-1.25, 0.0), b0.pos.y);

            const link_01 = new OffsetLinkConstraint(0.0, 0, 1, new Vector2(1.49, 0.0), new Vector2(-1.49, 0.0), 
                Vector2.distance(Vector2.add(b0.pos, new Vector2(1.49, 0.0)), Vector2.add(b1.pos, new Vector2(-1.49, 0.0))));

            psystem.constraints.push(fixed_0);
            psystem.constraints.push(link_01);

            break;

    }
}
