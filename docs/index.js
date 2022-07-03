const babel = require('@babel/core');
const types = require('@babel/types'); // 用来生成新的节点
const traverse = require('@babel/traverse').default; //遍历词法权
const generate = require('@babel/generator').default; // 用来从词法权生成源代码的



let indent = 0;
let sourceCode = `function ast() {}`;
let ast = babel.parse(sourceCode);

let padding = () => ' '.repeat(indent);

traverse(ast,{
    enter(path) {
        console.log(padding() + '进入' + path.node.type);
        if(types.isFunctionDeclaration(path.node)) {
            path.node.id.name = 'newAst';
        }
        indent+= 2;
    },
    exit(path) {
        indent-= 2;
        console.log(padding() + '离开' + path.node.type);
    }
});

let output = generate(ast);
