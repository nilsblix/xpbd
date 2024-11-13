import { Render } from "./utils/render.js";
import { Colors, LineWidths } from "./settings/render_settings.js";
import { Units } from "./utils/units.js";
import { Vector2 } from "./utils/math.js";

import { PhysicsSystem } from "./physics_system.js";
import { DiscBody, RectBody } from "./bodies.js";
import { OffsetLinkConstraint, FixedYConstraint } from "./constraints.js";
import { body_helper } from "./bodies.js";

/**
 * Setups up a scene. Make sure prev-scene is the nothing scene.
 * @param {string} ver 
 * @returns {void}
 */
export function setupScene(ver, psystem) {
    switch(ver) {
        case "test":

            const rad = 0.5;

            const b0 = new DiscBody(new Vector2(4, 4), rad, 1);
            const b1 = new DiscBody(new Vector2(6, 4), rad, 1);
            const b2 = new DiscBody(new Vector2(8, 4), rad, 1);

            const b3 = new RectBody(new Vector2(2, 4), 1, 2, 1);

            // b0.omega = -5;
            // b2.omega = 5;

            psystem.bodies.push(b0);
            psystem.bodies.push(b1);
            psystem.bodies.push(b2);
            psystem.bodies.push(b3);

            const r0 = new Vector2(0.2, 0.2);
            const r1 = new Vector2(-0.2, 0.2);

            const r2 = new Vector2(0.2, 0.2);
            const r3 = new Vector2(-0.2, -0.2);

            const r4 = new Vector2(0.5, 0);
            const r5 = new Vector2(-0.2, -0.2);

            const a0 = body_helper.localToWorld(b0, r0);
            const a1 = body_helper.localToWorld(b1, r1);

            const a2 = body_helper.localToWorld(b1, r2);
            const a3 = body_helper.localToWorld(b2, r3);

            const a4 = body_helper.localToWorld(b3, r4);
            const a5 = body_helper.localToWorld(b0, r5);

            const c_fixed_y = new FixedYConstraint(PhysicsSystem.EPS, 0, new Vector2(-0.1, 0.1), b0.pos.y + 0.1);

            const c0 = new OffsetLinkConstraint(PhysicsSystem.EPS, 0, 1, r0, r1, Vector2.distance(a0, a1));
            const c1 = new OffsetLinkConstraint(PhysicsSystem.EPS, 1, 2, r2, r3, Vector2.distance(a2, a3));
            const c2 = new OffsetLinkConstraint(PhysicsSystem.EPS, 0, 3, r5, r4, Vector2.distance(a4, a5));

            psystem.constraints.push(c0);
            psystem.constraints.push(c1);
            psystem.constraints.push(c2);
            psystem.constraints.push(c_fixed_y);

            break;

    }

}
