const hexdigits = "0123456789abcdef";

export const modify = (str: string, ammount: number) => {
    var output = "#";
    for (let i = 1; i < str.length; i++) {
        const char = str[i];
        const pos = hexdigits.indexOf(char);
        const newpos = Math.max(Math.min(pos + ammount, hexdigits.length), 0);
        if (pos != -1 && char != '0')
            output += hexdigits[newpos];
        else if (char == '0')
            output += '0';
        else
            output += char;
    }
    return output;
}

// accepts [num,num,num] and returns a contrasted value by focusing on the higher values
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }

        h /= 6;
    }

    return [h * 360, s, l];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
    let r: number, g: number, b: number;

    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        const hue2rgb = (p: number, q: number, t: number) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 3) return q;
            if (t < 1 / 2) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        h /= 360;

        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

export function increaseContrast(rgb: [number, number, number], factor: number): [number, number, number] {
    const [r, g, b] = rgb;
    let [h, s, l] = rgbToHsl(r, g, b);

    l = l < 0.5 ? l * (1 - factor) : l + (1 - l) * factor;
    s = s * (1 + factor);

    return hslToRgb(h, s, l);
}

export function convertRgbToRgba(rgbString: string, opacity: number): string {
    const rgbValues = rgbString.match(/\d+/g);

    if (!rgbValues || rgbValues.length !== 3) {
        throw new Error('Invalid RGB string format. Expected format: rgb(x,y,z)');
    }

    const [r, g, b] = rgbValues.map(Number);

    if (opacity < 0 || opacity > 1) {
        throw new Error('Invalid opacity value. Expected a value between 0 and 1.');
    }

    return `rgba(${r},${g},${b},${opacity})`;
}