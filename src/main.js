import { Units } from "./_units.js";
import { Vector2 } from "./_math.js";
import { Render } from "./_render.js";

const canvas = document.getElementById("engine");

Units.init(canvas);
Render.init(canvas.getContext("2d"));

const circle_pos = Vector2.scale(3/4, Units.DIMS);

const loop = () => {

    Units.init(canvas);

    const pivot_pos = Vector2.scale(1/2, Units.DIMS);
    circle_pos.rotateAroundPoint(0.01, pivot_pos);

    Render.c.clearRect(0, 0, canvas.width, canvas.height);

    Render.renderBackground();

    Render.c.lineWidth = 2;

    Render.c.fillStyle = "#ff0000";
    Render.c.strokeStyle = "#00ff00";
    Render.arc(pivot_pos, Vector2.distance(pivot_pos, Vector2.scale(3/4, Units.DIMS)), true, false);
    Render.arc(circle_pos, 0.5, true, true);

    Render.c.fillStyle = "#0000ff";
    Render.c.strokeStyle = "#ffffff";
    Render.rect(new Vector2(1, 1), new Vector2(1.5, 1.5), true, true);

    // Render.c.fillStyle = "#ff0000";
    Render.c.strokeStyle = "#ffff00";
    Render.line(Vector2.zero, circle_pos);

    requestAnimationFrame(loop);

}

loop();
