/*
VARIABLES AND CONSTS USED IN THIS SECTIONS
*/
export interface completePinLocation { type: 'input' | 'output' | 'gatetype', index: number, subtype: 'input' | 'output', id: string }
export type constructs = "and" | "not" | string | null;

export class Variable<T> {
    public value: T | null;
    public old: T | null;

    constructor(initial?: T | null) {
        this.value = initial || null;
        this.old = null;
    }


    public set(newValue: T | null): void {
        this.old = this.value;
        this.value = newValue;
    }

    public reset() {
        this.value = null;
        this.old = null;
    }

    }


export const ConstructionVar1 = new Variable<completePinLocation>();
export const ConstructionVar2 = new Variable<constructs>();
export const SelectedElements = new Variable<string[]>([]);
export const Position = new Variable<{ x: number, y: number }>({x : 0, y : 0});
export const CreatingCustomChip = new Variable<boolean>(false);
export const ChangingProps = new Variable<boolean>(false);