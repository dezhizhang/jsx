const types = require('@babel/types');

const pluginSyntaxJsx = require('@babel/plugin-syntax-jsx').default;

const pluginTransformReactJsx = {
  inherits: pluginSyntaxJsx,
  visitor: {
    JSXElement(path) {
      let callExpression = buildJSXElementCall(path);
      path.replaceWith(callExpression);
    },
  },
};

function buildJSXElementCall(path) {
  const args = [];
  return call(path, 'jsx', args);
}

function call(path, name, args) {
  const callee = types.identifier('_jsx');
  return types.callExpression(callee, args);
}

module.exports = pluginTransformReactJsx;
