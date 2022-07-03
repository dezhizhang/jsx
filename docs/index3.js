const babel = require('@babel/core');
const pluginTransformReactJsx = require('./plugin-transform-react-jsx');

const sourceCode = `<h1 id="app" ref="hello">hello</h1>`;

let output = babel.transform(sourceCode,{
    plugins:[
        [pluginTransformReactJsx,{runtime:'automatic'}]
    ]
});

console.log(output.code);
