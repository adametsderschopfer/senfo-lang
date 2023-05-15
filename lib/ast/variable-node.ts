import {ExpressionNode} from "./expression-node";
import {IToken} from "../token/token";

export class VariableNode extends ExpressionNode {
    public variable: IToken;

    constructor(variable: IToken) {
        super();
        this.variable = variable;
    }
}