const babel = require('@babel/core');
const types = require('@babel/types'); // 用来生成新的节点
const traverse = require('@babel/traverse').default; //遍历词法权
const generate = require('@babel/generator').default; // 用来从词法权生成源代码的





const sourceCode = `<h1 id="app" ref="hello">hello</h1>`;

let output = babel.transform(sourceCode,{
    plugins:[
        ['@babel/plugin-transform-react-jsx',{runtime:'automatic'}]
    ]
});

console.log(output);
