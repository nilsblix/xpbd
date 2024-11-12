export class Vector2 {
    static zero = new Vector2(0, 0);
    static up = new Vector2(0, 1);
    static down = new Vector2(0, -1);
    static left = new Vector2(-1, 0);
    static right = new Vector2(1, 0);

    constructor(x = 0.0, y = 0.0) {
        this.x = x;
        this.y = y;
    }

    /**
     * @returns {Vector2}
     */
    clone() {
        return new Vector2(this.x, this.y);
    }

    /** 
     * @param {Vector2} v
     * @returns {Vector2}
    */
    add(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }

    /** 
     * @param {Vector2} a
     * @param {Vector2} b
     * @returns {Vector2}
    */
    static add(a, b) {
        return new Vector2(a.x + b.x, a.y + b.y);
    }

    /**
    * @param {Vector2} v 
    * @returns {Vector2}
    */
    sub(v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }

    /** 
     * @param {Vector2} a
     * @param {Vector2} b
     * @returns {Vector2}
    */
    static sub(a, b) {
        return new Vector2(a.x - b.x, a.y - b.y);
    }

    /**
     * @param {number} s 
     * @returns {Vector2}
     */
    scale(s) {
        this.x *= s;
        this.y *= s;
        return this;
    }

    /**
     * @param {number} s
     * @param {Vector2} v
     * @returns {Vector2}
     */
    static scale(s, v) {
        return new Vector2(s * v.x, s * v.y);
    }

    /**
     * @returns {number} 
     * Squared magnitude
     */
    sqr_magnitude() {
        return this.x * this.x + this.y * this.y;
    }

    /**
     * @returns {number}
     * Magnitude
     */
    magnitude() {
        return Math.sqrt(this.sqr_magnitude());
    }

    /**
     * @param {Vector2} v 
     * @returns {number}
     */
    dot(v) {
        return this.x * v.x + this.y * v.y;
    }

    /**
     * @param {Vector2} a 
     * @param {Vector2} b 
     */
    static distance(a, b) {
        return Vector2.sub(a, b).magnitude();
    }

     /**
     * @param {Vector2} a 
     * @param {Vector2} b 
     */
     static sqr_distance(a, b) {
        return Vector2.sub(a, b).sqr_magnitude();
    }

    /**
     * Returns the negated version of this vector
     * @returns {number}
     */
    negate() {
        this.x *= -1;
        this.y *= -1;
        return this;
    }

    /**
     * @param {Vector2} v
     * @returns {Vector2}
     */
    static negate(v) {
        return new Vector2(- v.x, - v.y);
    }

    /**
     * @returns {Vector2}
     */
    normalize() {
        const dist = this.magnitude();
        return this.scale(1 / dist);
    }

    /**
     * @returns {string}
     */
    toString() {
        return "x: " + this.x + " y: " + this.y;
    }

    /**
     * @param {Vector2} v 
     * @returns {boolean}
     */
    equals(v) {
        return this.x == v.x && this.y == v.y;
    }

}