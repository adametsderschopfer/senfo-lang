import {ExpressionNode, IExpressionNode} from "./expression-node";

export class StatementsNode extends ExpressionNode {
    public codeStrings: IExpressionNode[] = [];

    public addNode(node: IExpressionNode) {
        this.codeStrings.push(node);
    }
}