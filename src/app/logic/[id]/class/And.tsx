import { MouseObject } from "../hooks/useMouse";
import { ApplyAnd, ComputeFormula } from "../utils/formulas";
import Cip, { CipProperties } from "./Cip";

export default class And extends Cip {
    // the and cip

    // predefined values
    constructor(props?: CipProperties) {
        super(props);
        this.color = "rgb(61, 95, 248)";
        this.tag = "and";
        this.inputsNum = 2;
        this.outputsNum = 1;
    }


    // the formula applied based on connections
    override update(mouse: MouseObject, prevMouse: MouseObject) {
        super.update(mouse, prevMouse);
        if (this.allInputs) {
            const line0 = this.getConnectionAt(0);
            const line1 = this.getConnectionAt(1);
            if (line0 && line1 && line0.startFormula.length > 0 && line1.startFormula.length > 0) {
                const formula = ApplyAnd(line0.startFormula, line1.startFormula);
                this.outputFormulas[0] = formula;
                this.outputs[0] = ComputeFormula(formula);
            }
        }
    }
};