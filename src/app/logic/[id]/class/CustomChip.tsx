import { MouseObject } from "../hooks/useMouse";
import { ApplyAnd, ComputeFormula, ReplaceNumbersWithFormulas } from "../utils/formulas";
import Cip, { CipProperties } from "./Cip";
import Connection from "./Connection";

export interface CustomChipProps extends CipProperties {
    outputFormulas: string[];
}

export default class CustomChip extends Cip {

    private declare originalOutputFormulas;

    constructor(props?: CustomChipProps) {
        super(props);
        this.outputFormulas = props?.outputFormulas || this.outputFormulas;
        this.originalOutputFormulas = [...this.outputFormulas] as const;
        this.outputsNum = this.outputFormulas.length;
    }


    override update(mouse: MouseObject, prevMouse: MouseObject) {
        super.update(mouse, prevMouse);
        if (this.allInputs) {
            const InputConnections = this.inputs.map((inp, index) => this.getConnectionAt(index));
            const badcase = InputConnections.find(connecton => !connecton || connecton.startFormula.length == 0);
            if (badcase) return;
            const InputFormulas = InputConnections.map((connection) => (connection as Connection).startFormula);
            const OutputFormulas = this.originalOutputFormulas;
            console.log(this.originalOutputFormulas);
            console.log(this.tag)
            this.outputs.forEach((out, ind) => {
                const formula = ReplaceNumbersWithFormulas(""+this.originalOutputFormulas[ind], InputFormulas);
                if (formula == '') {
                    return;
                }
                this.outputFormulas[ind] = formula;
                this.outputs[ind] = ComputeFormula(formula);
            })

        }
    }
};