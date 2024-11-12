import { Units } from "./utils/units.js";
import { Vector2 } from "./utils/math.js";
import { Render } from "./utils/render.js";
import { ScopedTimer } from "./utils/scoper_timer.js";

import { DiscBody } from "./bodies.js";
import { PhysicsSystem } from "./physics_system.js";

import { User } from "./user.js";

const psystem = new PhysicsSystem();

export function start() {
    const body = new DiscBody(new Vector2(5, 5), 1, 1);
    psystem.bodies.push(body);
}

export function update(canvas) {

    const timer = new ScopedTimer();

    Units.init(canvas);
    handleEventsOnInput();

    psystem.process();

    timer.measure(() => {
        Render.c.clearRect(0, 0, canvas.width, canvas.height);
        Render.renderBackground();
        psystem.render();
    });

    console.log("render time", (timer.dt * 1E3), "ms");

    requestAnimationFrame(() => update(canvas));
}

function handleEventsOnInput() {
    User.handleKeyboardInputs([
        {
            key: "s",
            onkeydown_do: (() => {psystem.simulating = false;}),
            onkeydown_cond: true,
            onkeyup_do: (() => {}),
            onkeyup_cond: false,
        },
        {
            key: "R",
            onkeydown_do: start,
            onkeydown_cond: true,
            onkeyup_do: () => {},
            onkeyup_cond: false,
        },
    ]);
}