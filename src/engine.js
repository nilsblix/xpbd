import { Units } from "./utils/units.js";
import { Vector2 } from "./utils/math.js";
import { Render } from "./utils/render.js";
import { ScopedTimer, FPSCalculator } from "./utils/scoper_timer.js";

import { DiscBody } from "./bodies.js";
import { PhysicsSystem } from "./physics_system.js";

import { User } from "./user.js";
import { updateGUI } from "./dear-imgui/gui_helper.js";

var psystem;
const physics_timer = new ScopedTimer(true, 5);
const render_timer = new ScopedTimer(true, 5);
const fps_calculator = new FPSCalculator();

export function start() {
    psystem = new PhysicsSystem();
    const body = new DiscBody(new Vector2(5, 5), 1, 1);
    psystem.bodies.push(body);
    handleEventsOnInput();
}

export function update(canvas) {

    Units.init(canvas);

    fps_calculator.update();
    PhysicsSystem.dt = fps_calculator.dt;

    updateGUI();
    physics_timer.measure(() => psystem.process());
    PhysicsSystem.pdt = physics_timer.dt;

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
            onkeydown_do: () => {
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
            key: "R",
            onkeydown_do: () => {
                psystem = new PhysicsSystem();
                const paused = document.getElementById("paused");
                paused.style.display = "block";
                const body = new DiscBody(new Vector2(5, 5), 1, 1);
                psystem.bodies.push(body);
            },
            onkeydown_cond: true,
            onkeyup_do: null,
            onkeyup_cond: false,
        },
    ]);
}