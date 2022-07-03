const types = require('@babel/types');
const runtime = require('react/jsx-runtime');
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
  const openingElementPath = path.get('openingElement');
  const { name } = openingElementPath.node.name;
  const tag = types.stringLiteral(name);
  const args = [tag];
  const attributes = [];
  for (let attrPath of openingElementPath.get('attributes')) {
    attributes.push(attrPath.node);
  }
  const props = attributes.map(convertAttribute);
  const children = buildChildren(path.node);
  if (children.length > 0) {
    props.push(buildChildrenProperty(children));
  }

  const propsObject = types.objectExpression(props);
  args.push(propsObject);

  //   console.log('props',props);
  return call(path, 'jsx', args);
}

function convertAttribute(node) {
  const value = node.value;
  node.name.type = 'Identifier';
  const objectProperty = types.objectProperty(node.name, value);
  return objectProperty;
}

function buildChildren(node) {
  let elements = [];
  for (let i = 0; i < node.children.length; i++) {
    let child = node.children[i];
    elements.push(types.stringLiteral(child.value));
  }
  return elements;
}

function buildChildrenProperty(children) {
  let childrenNode;
  if (children.length === 1) {
    childrenNode = children[0];
  } else if (children.length > 1) {
    childrenNode = types.arrayExpression(children);
  }
  return types.objectProperty(types.identifier('children'), childrenNode);
}

function call(path, name, args) {
  const importSource = 'react/jsx-runtime';
  const callee = addImport(path, name, importSource);
  return types.callExpression(callee, args);
}

function addImport(path,importName,importSource) {
    const programPath = path.find(p =>p.isProgram());
    //获取作用哉
    const programScope = programPath.scope;
    const localName = programScope.generateUidIdentifier(importName);

    const importSpecifier = types.importSpecifier(localName,types.identifier(importName));
    const specifiers = [importSpecifier];
    const importDeclaration = types.importDeclaration(specifiers,types.stringLiteral(importSource));
    programPath.unshiftContainer('body',[importDeclaration]);
    return localName;
    
}

module.exports = pluginTransformReactJsx;
