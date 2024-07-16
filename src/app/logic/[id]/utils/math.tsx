// return the squared distance between a and b
export const distSquared = (ax: number, ay: number, bx: number, by: number) => (bx - ax) * (bx - ax) + (by - ay) * (by - ay);
// return a boolean, whether point a is inside of circle at c with radius r
export const inCircle = (ax: number, ay: number, cx: number, cy: number, r: number) => distSquared(ax, ay, cx, cy) <= r * r;
// returns a boolean, whether a point is inside a given rect (tlx, tly, w, h)
export const inRect = (x: number, y: number, tlx: number, tly: number, width: number, height: number) => (x >= tlx && x <= tlx + width && y >= tly && y <= tly + height);

// Random number in range 0 - 255
export function randomChange255(number: number, speed = 6): number {
    if (number < 0) number = 0;
    if (number > 255) number = 255;

    const random = (Math.random()*2)-1;
    return Math.max(Math.min(number + speed * random, 255), 0);
}
