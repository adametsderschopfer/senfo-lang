import {ITokenType} from "./token-type";

export interface IToken {
    type: ITokenType;
    value: string;
    position: number;
}

export class Token implements IToken{
    type: ITokenType;
    value: string;
    position: number;

    constructor(type: ITokenType, value: string, position: number) {
        this.type = type;
        this.value = value;
        this.position = position;
    }
}