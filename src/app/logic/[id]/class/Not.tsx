import { Connections } from "../data/elements";
import { MouseObject } from "../hooks/useMouse";
import { ApplyNot, ComputeFormula } from "../utils/formulas";
import Cip, { CipProperties } from "./Cip";

/*

SIMILAR TO AND (SEE THERE MORE INFO)

used for inversing formula

*/

export default class Not extends Cip {
    constructor(props?: CipProperties) {
        super(props);
        this.tag = "not";
        this.color = "rgb(223, 69, 69)";
        this.inputsNum = 1;
        this.outputsNum = 1;
    }


    override update(mouse: MouseObject, prevMouse: MouseObject) {
        super.update(mouse, prevMouse);
        if (this.allInputs) {
            const line = this.getConnectionAt(0);
            if (line && line.startFormula.length > 0) {
                const formula = ApplyNot(line.startFormula);
                this.outputFormulas[0] = formula;
                this.outputs[0] = ComputeFormula(formula);
            }
        }
    }
};