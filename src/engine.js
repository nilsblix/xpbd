import { Units } from "./utils/units.js";
import { Vector2 } from "./utils/math.js";
import { Render } from "./utils/render.js";
import { ScopedTimer, FPSCalculator } from "./utils/scoper_timer.js";

import { PhysicsSystem } from "./physics_system.js";

import { User } from "./user.js";
import { updateGUI } from "./dear-imgui/gui_helper.js";

import { setupScene } from "./demo_scenes.js";

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

    PhysicsSystem.dt = fps_calculator.dt;

    physics_timer.measure(() => psystem.process());
    PhysicsSystem.pdt = physics_timer.dt;

    PhysicsSystem.energy = psystem.getSystemEnergy();

    render_timer.measure(() => {
        Render.c.clearRect(0, 0, canvas.width, canvas.height);
        Render.renderBackground();
        psystem.render();
    });
    PhysicsSystem.rdt = render_timer.dt;

    requestAnimationFrame(() => update(canvas));
}

function handleEventsOnInput() {
    User.handleKeyboardInputs([
        {
            key: " ",
            onkeydown_do: (e) => {
                e.preventDefault();
                PhysicsSystem.simulating = !PhysicsSystem.simulating;

                const paused = document.getElementById("paused");
                if (paused.style.display == "block")
                    paused.style.display = "none";
                else if (paused.style.display == "none")
                    paused.style.display = "block";

            },
            onkeydown_cond: true,
            onkeyup_do: null,
            onkeyup_cond: false,
        },
        {
            key: "ArrowUp",
            onkeydown_do: (e) => {
                e.preventDefault();
                PhysicsSystem.sub_steps = 1;
                PhysicsSystem.dt = fps_calculator.dt / SUB_STEPS;
            },
            onkeydown_cond: true,
            onkeyup_do: (e) => {
                e.preventDefault();
                PhysicsSystem.sub_steps = SUB_STEPS;
                PhysicsSystem.dt = fps_calculator.dt;
            },
            onkeyup_cond: true,
        },
        {
            key: "R",
            onkeydown_do: (e) => {
                PhysicsSystem.simulating = false;
                psystem = new PhysicsSystem();
                const paused = document.getElementById("paused");
                paused.style.display = "block";
            },
            onkeydown_cond: true,
            onkeyup_do: null,
            onkeyup_cond: false,
        },
        {
            key: "1",
            onkeydown_do: () => {
                PhysicsSystem.simulating = false;
                psystem = new PhysicsSystem();
                const paused = document.getElementById("paused");
                paused.style.display = "block";

                setupScene("test 1", psystem);
            },
            onkeydown_cond: true,
            onkeyup_do: null,
            onkeyup_cond: false,
        },
        {
            key: "2",
            onkeydown_do: () => {
                PhysicsSystem.simulating = false;
                psystem = new PhysicsSystem();
                const paused = document.getElementById("paused");
                paused.style.display = "block";

                setupScene("test 2", psystem);
            },
            onkeydown_cond: true,
            onkeyup_do: null,
            onkeyup_cond: false,
        },
    ]);
}