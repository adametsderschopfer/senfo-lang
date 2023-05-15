import {ExpressionNode, IExpressionNode} from "./expression-node";
import {Token} from "../token/token";

export class BinOperationNode extends ExpressionNode {
    operator: Token;
    leftNode: IExpressionNode;
    rightNode: IExpressionNode;

    constructor(operator: Token, leftNode: IExpressionNode, rightNode: IExpressionNode) {
        super();
        this.operator = operator;
        this.leftNode = leftNode;
        this.rightNode = rightNode;
    }
}