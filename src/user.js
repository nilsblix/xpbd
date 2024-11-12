import { Vector2 } from "./utils/math.js";
import { Units } from "./utils/units.js";

export class User {
    static mouse = {
        left_down: false,
        sim_pos: Vector2.zero,
        canv_pos: Vector2.zero,
    }

    /**
     * Specify which key, then specify what type of event, then the method it does
     * @params array An array of objects like this 
     *  {
     *  key: "a", 
     *  onkeydown_do: foo1,
     *  onkeydown_cond: fee1,
     *  onkeyup_do?: foo2, 
     *  onkeyup_cond?: fee2,
     *  }
     */
    static handleKeyboardInputs(keys) {
        for (let i = 0; i < keys.length; i++) {
            const k = keys[i];

            document.addEventListener("keydown", (e) => {
                if (e.key == k.key && k.onkeydown_cond)
                    onkeydown_do();
            });

            if (!k.onkeyup_do) continue;
            document.addEventListener("keyup", (e) => {
                if (e.key == k.key && k.onkeyup_cond)
                    onkeyup_do();
            });
        }

    }

    /**
     * Updates the mouse position and 
     * @param {HTMLCanvasElement} canvas 
     */
    static initMouseEventListeners(canvas) {
        document.addEventListener("mousemove", (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX + rect.x;
            const y = e.clientY + rect.y;
            User.mouse.canv_pos.x = x;
            User.mouse.canv_pos.y = y;
            User.mouse.sim_pos = Units.c2s(User.mouse.canv_pos);
        });

        document.addEventListener("mousedown", (e) => {
            User.mouse.left_down = true;
        });

        document.addEventListener("mouseup", (e) => {
            User.mouse.left_down = false;
        });

        canvas.addEventListener("mouseleave", (e) => {
            User.mouse.left_down = false;
        });
    }

}