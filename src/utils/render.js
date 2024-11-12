import { Vector2 } from "./math.js";
import { Units } from "./units.js";

export class Render {
    static c;
    static TAU = 2 * Math.PI;
    static background = {
        background: "#0c0e11",
        big_line_color: "#27282e",
        big_line_sim_thickness: 0.01,
        small_line_color: "#1b1c1f",
        small_line_sim_thickness: 0.005,
    };

    /**
     * Initializes the interface. All of the rendering is not called here. Some may be done outside but since c is a reference it doesn't matter
     * 
     * @param {CanvasRenderingContext2D} c 
     */
    static init(c) {
        this.c = c;
    }

    /**
     * Draws a circle
     * @param {Vector2} pos SIM
     * @param {number} radius SIM
     * @param {boolean} stroke
     * @param {boolean} fill
     */
    static arc(pos, radius, stroke = true, fill = true, ) {;
        this.c.beginPath();
        this.c.arc(Units.s2c_x(pos), Units.s2c_y(pos), Units.mult_s2c * radius, 0, this.TAU);
        if (fill)
            this.c.fill();
        if (stroke)
            this.c.stroke();
        this.c.closePath();
    }   

    /**
     * Draws a rectangle at SIM position and dimensions
     * @param {Vector2} pos SIM
     * @param {Vector2} dimensions SIM
     * @param {boolean} stroke 
     * @param {boolean} fill 
     */
    static rect(pos, dimensions, stroke = true, fill = true) {
        this.c.beginPath();
        this.c.rect(Units.s2c_x(pos), Units.s2c_y(pos), Units.mult_s2c * dimensions.x, -Units.mult_s2c * dimensions.y);
        if (fill)
            this.c.fill();
        if (stroke)
            this.c.stroke();
        this.c.closePath();
    }

    /**
     * Draws a line from a to b
     * OBS Uses only stroke color to fill
     * @param {Vector2} a SIM
     * @param {Vector2} b SIM
     */
    static line(a, b) {
        this.c.beginPath();
        this.c.moveTo(Units.s2c_x(a), Units.s2c_y(a));
        this.c.lineTo(Units.s2c_x(b), Units.s2c_y(b));
        this.c.stroke();
        this.c.closePath();
    }

    static renderBackground() {

        Render.c.fillStyle = Render.background.background;
        Render.rect(Vector2.zero, Units.DIMS, false, true);
    
        Render.c.strokeStyle = Render.background.small_line_color;
        Render.c.lineWidth = Units.mult_s2c * Render.background.small_line_sim_thickness;
    
        for (let i = 0; i < Units.NUM_LINES.x; i++) {
            const clip = i / Units.NUM_LINES.x;
            const delta = 0.5 / Units.NUM_LINES.x;
            const x = Units.WIDTH * (clip + delta);
            Render.line(new Vector2(x, 0), new Vector2(x, Units.HEIGHT));
        }
    
        for (let i = 0; i < Units.NUM_LINES.y; i++) {
            const clip = i / Units.NUM_LINES.y;
            const delta = 0.5 / Units.NUM_LINES.y;
            const y = Units.HEIGHT * (clip + delta);
            Render.line(new Vector2(0, y), new Vector2(Units.WIDTH, y));
        }
    
        Render.c.strokeStyle = Render.background.big_line_color;
        Render.c.lineWidth = Units.mult_s2c * Render.background.small_line_sim_thickness;
    
        for (let i = 0; i < Units.NUM_LINES.x; i++) {
            const clip = i / Units.NUM_LINES.x;
            const x = Units.WIDTH * clip;
            Render.line(new Vector2(x, 0), new Vector2(x, Units.HEIGHT));
        }
    
        for (let i = 0; i < Units.NUM_LINES.y; i++) {
            const clip = i / Units.NUM_LINES.y;
            const y = Units.HEIGHT * clip;
            Render.line(new Vector2(0, y), new Vector2(Units.WIDTH, y));
        }
    
    }

}