var t = require('@babel/types')
var traverse = require('@babel/traverse').default
var nejDefineMark = '_nej_defined_';
function addNejDefineMarkOnlyOnce(identifier) {
    if (!identifier.name.includes(nejDefineMark)) {
        identifier.name += nejDefineMark;
    }
}
function isNejDefineCalleeExp(expression) {
    var callee;
    if (t.isCallExpression(expression)) {
        callee = expression.callee;
    }
    return t.isMemberExpression(callee) &&
        t.isIdentifier(callee.object) &&
        callee.object.name === 'NEJ' &&
        t.isIdentifier(callee.property) &&
        callee.property.name === 'define';
}
module.exports = function () {
    var programPath;
    return {
        visitor: {
            // 获取下总路径
            Program: function (path) {
                programPath = path;
            },
            // top立即执行函数
            CallExpression: {
                enter: function (path) {
                    var node = path.node;
                    var callee = node.callee;
                    var isIIFE = t.isFunctionExpression(callee);
                    var importsCodes = [];
                    var defineCalleeExp;
                    if (isIIFE) {
                        var codes = callee.body.body;
                        codes.forEach(function (it) {
                            if (t.isExpressionStatement(it) && isNejDefineCalleeExp(it.expression)) {
                                defineCalleeExp = it.expression;
                            }
                            else {
                                importsCodes.push(it);
                            }
                        });
                        if (!defineCalleeExp) {
                            return console.log('no defineCallee');
                        }
                        var defineDps = defineCalleeExp.arguments[0];
                        var defineCb_1 = defineCalleeExp.arguments[1];
                        var defineParams_1 = defineCb_1.params.map(function (it) { return it.name; });
                        var declaresInNej_1 = [];
                        traverse(defineCb_1.body, {
                            VariableDeclarator: function (varPath) {
                                var varDec = varPath.node;
                                var identifier = varDec.id;
                                declaresInNej_1.push(identifier.name);
                            },
                            FunctionDeclaration: function (funcPath) {
                                var funDec = funcPath.node;
                                var identifier = funDec.id;
                                declaresInNej_1.push(identifier.name);
                            }
                        }, path.scope, path);
                        traverse(defineCb_1.body, {
                            MemberExpression: function (mPath) {
                                var memberExp = mPath.node;
                                if (t.isIdentifier(memberExp.object)) {
                                    var identifier = memberExp.object;
                                    if (defineParams_1.includes(identifier.name) || declaresInNej_1.includes(identifier.name)) {
                                        addNejDefineMarkOnlyOnce(identifier);
                                    }
                                }
                            },
                            Identifier: function (iPath) {
                                var identifier = iPath.node;
                                if (defineParams_1.includes(identifier.name) || declaresInNej_1.includes(identifier.name)) {
                                    var isInMember = t.isMemberExpression(iPath.parent);
                                    var isInObjectProp = t.isObjectProperty(iPath.parentPath.node);
                                    if (!isInMember && !isInObjectProp) {
                                        addNejDefineMarkOnlyOnce(identifier);
                                    }
                                    if(isInObjectProp && iPath.parentPath.node.key!=identifier){
                                        addNejDefineMarkOnlyOnce(identifier);
                                    }
                                }
                            }
                        }, path.scope, path);
                        defineParams_1.forEach(function (name, i) {
                            defineCb_1.params[i].name += nejDefineMark;
                        });
                        var newMemberExpression = {
                            type: 'MemberExpression',
                            object: {
                                type: 'Identifier',
                                name: 'NEJ'
                            },
                            property: {
                                type: 'Identifier',
                                name: 'define'
                            }
                        };
                        var newBlockStatement = t.blockStatement(importsCodes.concat(defineCb_1.body.body));
                        var _arguments = [
                            defineDps,
                            t.functionExpression(null, defineCb_1.params, newBlockStatement)
                        ];
                        var newCallExpression = t.callExpression(newMemberExpression, _arguments);
                        var newAst = t.program([
                            t.expressionStatement(newCallExpression)
                        ]);
                        programPath.replaceWith(newAst);
                        path.stop();                    }
                }
            }
        }
    };
}
