import { Render } from "./utils/render.js";
import { Colors, LineWidths } from "./settings/render_settings.js";
import { Units } from "./utils/units.js";
import { Vector2 } from "./utils/math.js";

import { PhysicsSystem } from "./physics_system.js";
import { DiscBody } from "./bodies.js";
import { OffsetLinkConstraint } from "./constraints.js";

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

            psystem.bodies.push(b0);
            psystem.bodies.push(b1);

            const r1 = new Vector2(0.2, 0.2);
            const r2 = new Vector2(-0.2, 0.2);

            const c0 = new OffsetLinkConstraint(0.0001, 0, 1, r1, r2, Vector2.distance(b0.pos, b1.pos));

            psystem.constraints.push(c0);

            break;

    }

}
