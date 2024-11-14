import { Units } from "./utils/units.js";
import { Render } from "./utils/render.js";

import { start, update } from "./engine.js";

import { initGUIWindows } from "./dear-imgui/gui_helper.js";

const canvas = document.getElementById("engine");

initGUIWindows();

Units.init(canvas);
Render.init(canvas.getContext("2d"));

start(canvas);
update(canvas);
