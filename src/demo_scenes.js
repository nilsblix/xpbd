import { Vector2 } from "./utils/math.js";
import { RigidBody } from "./rigid_body.js";
import { OffsetLinkConstraint, PrismaticYConstraint, PrismaticPosConstraint, RevoluteJoint } from "./constraints.js";
import { SpringJoint } from "./force_generators.js";
import { editor } from "./editor.js";

/**
 * Setups up a scene. Make sure prev-scene is the nothing scene.
 * @param {string} ver 
 * @returns {void}
 */
export function setupScene(ver, psystem) {
    switch (ver) {
        case "test 1":

            const delta = 0.25;

            const p0 = new RigidBody(new Vector2(5, 3.25), 10, {type: "rect", width: 5, height: 0.25});
            const p1 = new RigidBody(new Vector2(2.5 + delta, 2.25), 6, {type: "disc", radius: 0.5});

            psystem.bodies.push(p0);
            psystem.bodies.push(p1);

            editor.spawnRagdoll(psystem, new Vector2(7.5 - delta, 2.75));

            psystem.addPrismaticJoint(0.0, "pos", 0, Vector2.zero.clone());
            psystem.addLinkJoint(0.0, 0, 1, new Vector2(- 2.5 + delta), new Vector2(0, 0.25));
            psystem.addLinkJoint(0.0, 0, 2, new Vector2(  2.5 - delta), new Vector2(0, 0.1));

            break;

        default:
            console.warn("Tried to setup unknown scene. Tried: " + ver);
    }
}
