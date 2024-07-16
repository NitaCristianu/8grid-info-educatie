import { MouseObject } from "../hooks/useMouse";
import { ApplyAnd, ComputeFormula, ReplaceNumbersWithFormulas } from "../utils/formulas";
import Cip, { CipProperties } from "./Cip";
import Connection from "./Connection";

export interface CustomChipProps extends CipProperties {
    outputFormulas : string[];
}

export default class CustomChip extends Cip {

    constructor(props?: CustomChipProps) {
        super(props);
        this.outputFormulas = props?.outputFormulas || this.outputFormulas;
        this.outputsNum = this.outputFormulas.length;
    }


    override update(mouse: MouseObject, prevMouse: MouseObject) {
        super.update(mouse, prevMouse);
        if (this.allInputs) {
            const InputConnections = this.inputs.map((inp, index) => this.getConnectionAt(index));
            const badcase = InputConnections.find(connecton => !connecton || connecton.startFormula.length == 0);
            if (badcase) return;
            const InputFormulas = InputConnections.map((connection)=> (connection as Connection).startFormula);
            const OutputFormulas = this.outputFormulas;
            console.log(InputFormulas);
            this.outputs.forEach((out,ind)=>{
                console.log(this.outputFormulas[ind]);
                const formula = ReplaceNumbersWithFormulas(this.outputFormulas[ind], InputFormulas);
                if (formula == ''){
                    return;
                }
                this.outputFormulas[ind] = formula;
                this.outputs[ind] = ComputeFormula(formula);
            })

        }
    }
};