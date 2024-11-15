import { Vector2 } from "./utils/math.js";
import { RigidBody } from "./rigid_body.js";
import { OffsetLinkConstraint, PrismaticYConstraint } from "./constraints.js";
import { SpringJoint } from "./force_generators.js";

/**
 * Setups up a scene. Make sure prev-scene is the nothing scene.
 * @param {string} ver 
 * @returns {void}
 */
export function setupScene(ver, psystem) {
    switch (ver) {
        case "test 1":
            const b0 = new RigidBody(new Vector2(5, 4), 1, {type: "rect", width: 3.0, height: 0.5});
            const b1 = new RigidBody(new Vector2(8, 4), 1, {type: "rect", width: 3.0, height: 0.5});

            psystem.bodies.push(b0);
            psystem.bodies.push(b1);

            // psystem.addSpringJoint(0, 1, Vector2.zero.clone(), Vector2.zero.clone());

            psystem.addPrismaticJoint(0.0, "y", 0, new Vector2(-1.25, 0));
            psystem.addLinkJoint(0.0, 0, 1, new Vector2(1.4, 0.0), new Vector2(-1.4, 0.0));

            break;

    }
}
