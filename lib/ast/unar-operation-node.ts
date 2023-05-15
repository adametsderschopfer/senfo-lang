import {Token} from "../token/token";
import {ExpressionNode} from "./expression-node";

export class UnarOperationNode {
    operator: Token;
    operand: ExpressionNode;

    constructor(operator: Token, operand: ExpressionNode) {
        this.operator = operator;
        this.operand = operand;
    }
}