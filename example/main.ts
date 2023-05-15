import {Lexer} from "../lib/lexer";
import {Parser} from "../lib/parser";

const code = `
    my_variable = 5 + 1;
    
    print_log(my_variable);
    print_log(my_variable + (1 - 2));
    print_log(1 + 2);
`;

const tokens = new Lexer(code).lexicalAnalysis();

const parser = new Parser(tokens);
const rootNode = parser.parseCode();

parser.run(rootNode);