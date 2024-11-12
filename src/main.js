import { Units } from "./utils/units.js";
import { Vector2 } from "./utils/math.js";
import { Render } from "./utils/render.js";
import { ScopedTimer } from "./utils/scoper_timer.js";

const canvas = document.getElementById("engine");

Units.init(canvas);
Render.init(canvas.getContext("2d"));
