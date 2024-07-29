// obtain random alphabet letter
export function randomLetter() {
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    const randomIndex = Math.floor(Math.random() * letters.length);
    return letters.charAt(randomIndex);
}
