import { Inputs } from "../data/elements";
import { voltage } from "../interfaces/keywords";

export const ExtendFormula = (name: string, formula: string) => `${name}(${formula})`;
export const ApplyNot = (formula: string) => `(!${formula})`;
export const ApplyAnd = (formula: string, other: string | number) => `(${formula}&&${other})`;
export const ComputeFormula = (formula: string): voltage => {
    if (formula == '-1' || formula.length == 0) return 'unset';
    const inputs: boolean[] = [...Inputs.map(input => input.value == 'high' ? true : false)];
    const parsed = formula.replace(/\d+/g, (match) => {
        const index = parseInt(match, 10);
        return `${(inputs[index])}`;
    });
    try {
        return eval(parsed) ? 'high' : 'low';
    } catch (error) {
        console.log(error, formula);
        return 'low';
    }
}
/*
const matches = [];
formula.replace(/\d+/g, (match, offset) => {
    matches.push({ match, offset });
    return match;
});

let parsed = formula;
let shift = 0; // To account for length changes in the string
matches.forEach(({ match, offset }) => {
    const index = parseInt(match, 10);
    if (formulas[index] !== undefined) {
        const replacement = formulas[index];
        parsed = parsed.substring(0, offset + shift) + replacement + parsed.substring(offset + match.length + shift);
        shift += replacement.length - match.length; // Update the shift
    }
});

*/
export const ReplaceNumbersWithFormulas = (formula: string, formulas: string[]) => {
    if (formula == '-1' || formula.length == 0) return '';
    const parsed = formula.replace(/\d+/g, (match) => {
        const index = parseInt(match, 10);
        return `${formulas[index]}`;
    });
    return parsed;
}