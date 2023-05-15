import {IToken} from "./token/token";
import {ITokenType} from "./token/token-type";
import {ExpressionNode, IExpressionNode} from "./ast/expression-node";
import {StatementsNode} from "./ast/statements-node";
import {tokenTypes} from "./token/token-types";
import {NumberNode} from "./ast/number-node";
import {VariableNode} from "./ast/variable-node";
import {BinOperationNode} from "./ast/bin-operation-node";
import {UnarOperationNode} from "./ast/unar-operation-node";

export interface IParser {
    tokens: IToken[];
    position: number;
    scope: any;
}

export class Parser implements IParser {
    public readonly tokens: IToken[];

    public position: number = 0;
    public scope: any = {};

    constructor(tokens: IToken[]) {
        this.tokens = tokens;
    }

    private match(...expectedTypes: ITokenType[]): IToken | null {
        if (this.position < this.tokens.length) {
            const currentToken = this.tokens[this.position];

            if (expectedTypes.find(type => type.name === currentToken.type.name)) {
                this.position += 1;
                return currentToken;
            }
        }

        return null;
    }

    private require(...expectedTypes: ITokenType[]): IToken {
        const token = this.match(...expectedTypes);
        if (!token) {
            throw new SyntaxError(`${expectedTypes[0].name} is expected at position ${this.position}`);
        }

        return token;
    }

    private parsePrintLog(): IExpressionNode {
        const printLogToken = this.match(tokenTypes.PRINT_LOG);
        if (printLogToken !== null) {
            return new UnarOperationNode(printLogToken, this.parseFormula());
        }

        throw new SyntaxError(`expected unar operator print_log at position ${this.position}`);
    }

    private parseVariableOrNumber(): IExpressionNode {
        const number = this.match(tokenTypes.NUMBER);
        if (number !== null) {
            return new NumberNode(number);
        }

        const variable = this.match(tokenTypes.VARIABLE);
        if (variable !== null) {
            return new VariableNode(variable);
        }

        throw new SyntaxError(`Expected variable or number at position ${this.position}`)
    }

    private parseParentheses(): IExpressionNode {
        if (this.match(tokenTypes.LEFT_PAR) !== null) {
            const node = this.parseFormula();
            this.require(tokenTypes.RIGHT_PAR);
            return node;
        } else {
            return this.parseVariableOrNumber();
        }
    }

    private parseFormula(): IExpressionNode {
        const getOperator = () => this.match(
            tokenTypes.MINUS,
            tokenTypes.PLUS,
            tokenTypes.MULTIPLY,
            tokenTypes.DIVIDE,
        );

        let leftNode: IExpressionNode = this.parseParentheses();
        let operator = getOperator();

        while (operator !== null) {
            const rightNode: IExpressionNode = this.parseParentheses();

            leftNode = new BinOperationNode(operator, leftNode, rightNode);
            operator = getOperator();
        }

        return leftNode;
    }

    private parseExpression(): IExpressionNode {
        if (this.match(tokenTypes.VARIABLE) === null) {
            return this.parsePrintLog();
        }

        this.position -= 1;
        let variableNode = this.parseVariableOrNumber();

        const assignOperator = this.match(tokenTypes.ASSIGN)
        if (assignOperator !== null) {
            const rightFormulaNode = this.parseFormula();

            return new BinOperationNode(
                assignOperator,
                variableNode,
                rightFormulaNode
            );
        }

        throw new SyntaxError(`After the variable, an assignment sign is expected at position ${this.position}`);
    }

    public parseCode(): ExpressionNode {
        const root = new StatementsNode();

        while (this.position < this.tokens.length) {
            const codeStringNode = this.parseExpression();
            this.require(tokenTypes.SEMICOLON);

            root.addNode(codeStringNode);
        }

        return root;
    }

    public run(node: IExpressionNode): any {
        if (node instanceof NumberNode) {
            return parseInt(node.number.value);
        }

        if (node instanceof UnarOperationNode) {
            switch (node.operator.type.name) {
                case tokenTypes.PRINT_LOG.name: {
                    console.log(this.run(node.operand));
                    return;
                }
            }
        }

        if (node instanceof BinOperationNode) {
            switch (node.operator.type.name) {
                case tokenTypes.PLUS.name:
                    return this.run(node.leftNode) + this.run(node.rightNode);
                case tokenTypes.MINUS.name:
                    return this.run(node.leftNode) - this.run(node.rightNode);
                case tokenTypes.MULTIPLY.name:
                    return this.run(node.leftNode) * this.run(node.rightNode);
                case tokenTypes.DIVIDE.name:
                    return this.run(node.leftNode) / this.run(node.rightNode);
                case tokenTypes.ASSIGN.name: {
                    const result = this.run(node.rightNode);
                    const variableNode = node.leftNode as VariableNode;

                    this.scope[variableNode.variable.value] = result;
                    return result;
                }
            }
        }

        if (node instanceof VariableNode) {
            if (this.scope[node.variable.value]) {
                return this.scope[node.variable.value];
            } else {
                throw new SyntaxError(`Variable named ${node.variable.value} not found`);
            }
        }

        if (node instanceof StatementsNode) {
            for (let codeString of node.codeStrings) {
                this.run(codeString);
            }

            return;
        }

        throw new SyntaxError(`Something went wrong. Position: ${this.position}`);
    }
}