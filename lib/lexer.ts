import {IToken, Token} from "./token/token";
import {tokenTypes} from "./token/token-types";

interface ILexer {
    code: string;
    position: number;
    tokenList: IToken[];

    lexicalAnalysis(): IToken[];
}

export class Lexer implements ILexer {
    public readonly code: string;
    public position: number = 0;
    public tokenList: IToken[] = [];

    constructor(code: string) {
        this.code = code;
    }

    public lexicalAnalysis(): IToken[] {
        while (this.nextToken()) {
            // console.log(this.tokenList)
        }

        this.tokenList =
            this.tokenList.filter(token => token.type.name !== tokenTypes.SPACE.name);

        return this.tokenList;
    }

    private nextToken(): boolean {
        if (this.position >= this.code.length) {
            return false;
        }

        const tokenTypesList = Object.values(tokenTypes);

        for (const tokenType of tokenTypesList) {
            const regex = new RegExp(`^${tokenType.regex}`);
            const result = this.code.substring(this.position).match(regex);

            if (result?.length && result[0]) {
                const token = new Token(tokenType, result[0], this.position);

                this.position += result[0].length;
                this.tokenList.push(token);

                return true;
            }
        }

        this.catchLexerError();
    }

    private catchLexerError() {
        const __code__ = [...this.code];
        __code__[this.position + 1] = "<<<<ERROR ";

        throw new SyntaxError(`
            Error found at position ${this.position}
            ${__code__.join("").substring(0, 30)}
        `);
    }
}