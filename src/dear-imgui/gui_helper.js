import { PhysicsSystem } from "../physics_system.js";
import { editor } from "../editor.js";

class GUIWindow {
    // slider args is in [{slider_id: x, value_id: x, num_decimals: x}, {etc}]
    constructor(
        toggle_window_key,
        id_window,
        id_header,
        id_close_btn,
        slider_args,
    ) {
        this.toggle_key = toggle_window_key;
        this.window = document.getElementById(id_window);
        this.header = document.getElementById(id_header);
        this.close_btn = document.getElementById(id_close_btn);
        this.slider_args = slider_args;
    }

    static updateSlider(arr) {
        const slider = document.getElementById(arr.slider_id);
        const value = document.getElementById(arr.value_id);
        slider.addEventListener('input', () => {
            value.innerText = parseFloat(slider.value).toFixed(arr.num_decimals);
        });
    }

    init() {
        this.window.style.display = "none";

        this.close_btn.addEventListener("click", () => {
            this.window.style.display = "none";
        });

        for (let i = 0; i < this.slider_args.length; i++) {
            GUIWindow.updateSlider(this.slider_args[i]);
        }

        document.addEventListener("keydown", (e) => {
            if (e.key == this.toggle_key) {
                if (this.window.style.display == "block") {
                    this.window.style.display = "none";
                } else if (this.window.style.display == "none") {
                    this.window.style.display = "block";
                }
            }
        });

        let dragging = false;
        let off_x = 0; let off_y = 0;

        this.header.addEventListener("mousedown", (e) => {
            dragging = true;
            off_x = e.clientX - this.window.offsetLeft;
            off_y = e.clientY - this.window.offsetTop;
        });

        document.addEventListener('mousemove', (e) => {
            if (dragging) {
                this.window.style.left = `${e.clientX - off_x}px`;
                this.window.style.top = `${e.clientY - off_y}px`;
            }
        });
  
        document.addEventListener('mouseup', () => {
            dragging = false;
        });

    }

}

const profiling = new GUIWindow(
    "a",
    "profiling-window",
    "profiling-header",
    "profiling-close-button",
    [],
);

const info = new GUIWindow(
    "z",
    "info-window",
    "info-header",
    "info-close-button",
    [],
);

const editor_window = new GUIWindow(
    "e",
    "editor-window",
    "editor-header",
    "editor-close-button",
    [
        {
            slider_id: "editor-rigidbody-type-slider",
            value_id: "editor-rigidbody-type-value",
            num_decimals: "0",
        },
        {
            slider_id: "editor-constraint-compliance-slider",
            value_id: "editor-constraint-compliance-value",
            num_decimals: "3",
        },
        {
            slider_id: "editor-joint-type-slider",
            value_id: "editor-joint-type-value",
            num_decimals: "0",
        },
        {
            slider_id: "editor-mass-slider",
            value_id: "editor-mass-value",
            num_decimals: "1",
        },
        
    ],
)

export function initGUIWindows() {
    profiling.init();
    info.init();
    editor_window.init();
}

export function updateGUI() {
    updateDisplayedDebugs();
    updateChangedUserData();
}

function updateDisplayedDebugs() {
    // profiling
    document.getElementById("profiling-dt").innerHTML = (PhysicsSystem.dt * 1E3).toFixed(3);
    document.getElementById("profiling-pdt").innerHTML = (PhysicsSystem.pdt * 1E3).toFixed(3);
    document.getElementById("profiling-rdt").innerHTML = (PhysicsSystem.rdt * 1E3).toFixed(3);
    document.getElementById("profiling-energy").innerHTML = (PhysicsSystem.energy).toFixed(3);

    // info
    document.getElementById("info-framerate").innerHTML = (1 / PhysicsSystem.dt).toFixed(0);
    document.getElementById("info-simrate").innerHTML = (PhysicsSystem.sub_steps * 1 / PhysicsSystem.dt).toFixed(0);

}

function updateChangedUserData() {
    // EDITOR ---------------------------------------------------------------------------------------------------------------------
    if (document.getElementById("editor-toggle-active").checked) {
        editor.active = true;
        PhysicsSystem.simulating = false;
        document.getElementById("paused").style.display = "block";
        document.getElementById("paused").innerText = "*paused (EDITOR ACTIVE)"
    } else {
        editor.active = false;
        document.getElementById("paused").innerText = "*paused"
    }

    const rigidbody_type_slider = document.getElementById("editor-rigidbody-type-slider");
    if (rigidbody_type_slider.value == 1) {
        editor.spawner.typeof_rigidbody = "disc"
    } else if (rigidbody_type_slider.value == 2) {
        editor.spawner.typeof_rigidbody = "rect"
    }

    const joint_type_slider = document.getElementById("editor-joint-type-slider");
    if (joint_type_slider.value == 1) {
        editor.spawner.typeof_joint = "link"
    } else if (joint_type_slider.value == 2) {
        editor.spawner.typeof_joint = "link"
    }

    editor.standard.mass = document.getElementById("editor-mass-slider").value;

}
