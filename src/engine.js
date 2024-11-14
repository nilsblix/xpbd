import { Units } from "./utils/units.js";
import { Render } from "./utils/render.js";
import { ScopedTimer, FPSCalculator } from "./utils/scoper_timer.js";
import { Vector2 } from "./utils/math.js";

import { PhysicsSystem } from "./physics_system.js";

import { User } from "./user.js";
import { updateGUI } from "./dear-imgui/gui_helper.js";

import { setupScene } from "./demo_scenes.js";

import { editor } from "./editor.js";

const SUB_STEPS = 20;

PhysicsSystem.sub_steps = SUB_STEPS;

var psystem;
const physics_timer = new ScopedTimer(true, 5);
const render_timer = new ScopedTimer(true, 5);
const fps_calculator = new FPSCalculator();

export function start(canvas) {
    psystem = new PhysicsSystem();
    handleEventsOnInput();
    User.initMouseEventListeners(canvas);
}

export function update(canvas) {

    Units.init(canvas);

    updateGUI();
    fps_calculator.update();

    if (!document.hasFocus()) {
        PhysicsSystem.simulating = false;
        const paused = document.getElementById("paused");
        paused.style.display = "block";
    }

    editor.update();

    PhysicsSystem.dt = fps_calculator.dt;

    physics_timer.measure(() => psystem.process());
    PhysicsSystem.pdt = physics_timer.dt;

    PhysicsSystem.energy = psystem.getSystemEnergy();

    render_timer.measure(() => {
        Render.c.clearRect(0, 0, canvas.width, canvas.height);
        Render.renderBackground();
        psystem.render();
        editor.render(psystem);
    });
    PhysicsSystem.rdt = render_timer.dt;

    requestAnimationFrame(() => update(canvas));
}

function handleEventsOnInput() {
    User.handleKeyboardInputs([
        {
            key: " ",
            onkeydown: (e) => {
                e.preventDefault();

                if (editor.active) return;
                PhysicsSystem.simulating = !PhysicsSystem.simulating;

                const paused = document.getElementById("paused");
                if (paused.style.display == "block")
                    paused.style.display = "none";
                else if (paused.style.display == "none")
                    paused.style.display = "block";

            },
            onkeyup: null,
        },
        {
            key: "ArrowUp",
            onkeydown: (e) => {
                e.preventDefault();
                PhysicsSystem.sub_steps = 1;
                PhysicsSystem.dt = fps_calculator.dt / SUB_STEPS;
            },
            onkeyup: (e) => {
                e.preventDefault();
                PhysicsSystem.sub_steps = SUB_STEPS;
                PhysicsSystem.dt = fps_calculator.dt;
            },
        },
        {
            key: "R",
            onkeydown: (e) => {
                PhysicsSystem.simulating = false;
                psystem = new PhysicsSystem();
                const paused = document.getElementById("paused");
                paused.style.display = "block";
            },
            onkeyup: null,
        },
        {
            key: "1",
            onkeydown: (e) => {
                PhysicsSystem.simulating = false;
                psystem = new PhysicsSystem();
                const paused = document.getElementById("paused");
                paused.style.display = "block";

                setupScene("test 1", psystem);
            },
            onkeyup: null,
        },
        {
            key: "s",
            onkeydown: (e) => {
                if (!editor.active) return;
                if (editor.spawning_rigidbody) return;

                editor.spawning_rigidbody = true;

                switch (editor.spawner.typeof_rigidbody) {
                    case "disc":
                        editor.preliminary.disc.pos.set(User.mouse.sim_pos);
                        break;
                    case "rect":
                        editor.preliminary.rect.origin_pos.set(User.mouse.sim_pos);
                        break;
                }

            },
            onkeyup: (e) => {
                if (!editor.active) {
                    editor.spawning_rigidbody = false;
                    return;
                }

                if (!editor.spawning_rigidbody) return;

                switch (editor.spawner.typeof_rigidbody) {
                    case "disc":
                        editor.spawnRigidBody(psystem, editor.preliminary.disc.pos, editor.standard.mass, editor.preliminary.disc.radius);
                        break;
                    case "rect":
                        const rect_pos = editor.preliminary.rect.origin_pos;
                        const width = editor.preliminary.rect.width;
                        const height = editor.preliminary.rect.height;
                        rect_pos.set(Vector2.add(rect_pos, Vector2.scale(1/2, new Vector2(width, height))));
                        editor.spawnRigidBody(psystem, rect_pos, editor.standard.mass, null, editor.preliminary.rect.width, editor.preliminary.rect.height);
                        break;
                }
                editor.spawning_rigidbody = false;
            },
        },
        {
            key: "x",
            onkeydown: (e) => {
                editor.spawning_rigidbody = false;
            },
            onkeyup: null,
        },
        {
            key: "v",
            onkeydown: (e) => {
                if (!editor.active) return;
                if (editor.spawning_joint) return;

                editor.spawning_joint = true;

                switch (editor.spawner.typeof_joint) {
                    case "link":
                        const info = psystem.getRigidBodyInfoContainingPoint(User.mouse.sim_pos);
                        if (!info) return;
                        const r = psystem.bodies[info.id].worldToLocal(User.mouse.sim_pos);
                        editor.preliminary.link_joint.id1 = info.id;
                        editor.preliminary.link_joint.r1 = r;
                        break;
                }

            },
            onkeyup: (e) => {
                if (!editor.active) {
                    editor.spawning_joint = false;
                    return;
                }

                if (!editor.spawning_joint) return;

                switch (editor.spawner.typeof_joint) {
                    case "link":
                        const info = psystem.getRigidBodyInfoContainingPoint(User.mouse.sim_pos);
                        if (!info) break;
                        const link_id1 = editor.preliminary.link_joint.id1;
                        const link_r1 = editor.preliminary.link_joint.r1;
                        const link_id2 = info.id;
                        const link_r2 = psystem.bodies[info.id].worldToLocal(User.mouse.sim_pos);
                        editor.spawnJoint(psystem, "link", link_id1, link_id2, link_r1, link_r2);
                        break;
                }
                editor.spawning_joint = false;
            },
        },
    ]);
}