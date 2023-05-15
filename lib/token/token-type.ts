export interface ITokenType {
    name: string;
    regex: RegExp | string;
}

export class TokenType implements ITokenType{
    name: string;
    regex: string;

    constructor(name: string, regex: string) {
        this.name = name;
        this.regex = regex;
    }
}