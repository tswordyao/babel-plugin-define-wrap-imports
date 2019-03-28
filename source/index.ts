import * as babel from 'babel-core';
import * as t from 'babel-types';
import { NodePath,default as traverse,} from 'babel-traverse';

const nejDefineMark = '_nej_defined_';

function addNejDefineMarkOnlyOnce(identifier){
    if(!identifier.name.includes(nejDefineMark)){
        identifier.name += nejDefineMark
    }
}

function isNejDefineCalleeExp(expression) {
    var callee;
    if( t.isCallExpression(expression) ){
        callee = expression.callee;
    }
    return t.isMemberExpression(callee) &&
                    // 对象是标识符
                    t.isIdentifier(callee.object) &&
                    // 标识符是NEJ
                    callee.object.name === 'NEJ' &&
                    // 对象属性也是标识符
                    t.isIdentifier(callee.property) &&
                    // 标识符是define
                    callee.property.name === 'define';
}

export default function (): babel.PluginObj {
    var programPath: NodePath;
    return {
        visitor: {
            // 获取下路径
            Program(path: NodePath) {
                programPath = path;
            },
            // 编译前整个代码是一个top立即执行函数
            CallExpression:{
                enter(path){
                    // 节点
                    const node = path.node as t.CallExpression;
                    // 函数调用
                    let callee = node.callee;
                    let isIIFE = t.isFunctionExpression(callee);
                    let importsCodes:t.Statement[];//, importsCodesDecs,defineCodes,defineCodesDecs;
                    let defineCalleeExp;

                    // 第一个IIFE
                    if(isIIFE){
                        importsCodes = [];
                        callee = callee as t.FunctionExpression;
                        //获取代码
                        let codes = callee.body.body;
                        codes.forEach((it:t.Statement)=>{
                            if (t.isExpressionStatement(it) && isNejDefineCalleeExp(it.expression)) {
                                defineCalleeExp = it.expression;
                            }
                            else{
                                importsCodes.push(it)
                            }
                        });
                        if(!defineCalleeExp){
                            return console.log('no defineCallee');
                        }
                        let defineDps = defineCalleeExp.arguments[0];
                        let defineCb:t.FunctionExpression = defineCalleeExp.arguments[1];
                        let defineParams = defineCb.params.map((it:t.Identifier)=>it.name);
                        // let defineCodes = defineCb.body.body;
 
                        let declaresInNej = [];
                        // 先把声明的标识符登记好
                        traverse(defineCb.body,{
                            // 避免变量声明重复
                            VariableDeclarator:(varPath:NodePath)=>{
                                var varDec = varPath.node as t.VariableDeclarator;
                                var identifier = varDec.id as t.Identifier;
                                declaresInNej.push(identifier.name);
                            },
                            // 避免函数声明重复
                            FunctionDeclaration:(funcPath:NodePath)=>{
                                var funDec = funcPath.node as t.FunctionDeclaration;
                                var identifier = funDec.id as t.Identifier
                                declaresInNej.push(identifier.name);
                            },
                        },path.scope,path);
  
                        // importCodes中变量可能会被define中用到, 而define中变量不会被importCodes用到
                        // 将nej.define参数和内部变量rename为uid或打上token
                        traverse(defineCb.body,{
                            //作为[属性调用的第一个标识符]
                            MemberExpression: function(mPath){
                                var memberExp = mPath.node;
                                if(t.isIdentifier(memberExp.object)){
                                    let identifier = memberExp.object as t.Identifier;
                                    if(defineParams.includes(identifier.name) || declaresInNej.includes(identifier.name)){
                                        addNejDefineMarkOnlyOnce(identifier);
                                    }
                                }
                            },
                            // 作为[独立标识符]使用的
                            Identifier: function (iPath) {
                                var identifier = iPath.node;
                                if(defineParams.includes(identifier.name) || declaresInNej.includes(identifier.name)){
                                    let isInMember = t.isMemberExpression(iPath.parent); // a.b.c
                                    let isInObjectProp = t.isObjectProperty(iPath.parentPath.node); // obj = {a:c, b:d}
                                    if(!isInMember){
                                        addNejDefineMarkOnlyOnce(identifier);
                                    }  
                                    // 直接标识符
                                    if (!isInMember && !isInObjectProp) {
                                        addNejDefineMarkOnlyOnce(identifier);
                                    }
                                    // 对象中的属性标识符(作为属性key是不转的, 作为属性value是要转的)
                                    if(isInObjectProp && (iPath.parentPath.node as t.ObjectProperty).key != identifier){
                                        addNejDefineMarkOnlyOnce(identifier);
                                    }                              
                                }
                            }
                        },path.scope,path);

                        // 作为形参定义的
                        defineParams.forEach((name:string,i:number)=>{
                            // if(path.scope.hasBinding(name)){
                                (defineCb.params[i] as t.Identifier).name += nejDefineMark;
                            // }
                        });

                        let newMemberExpression = {
                            type:'MemberExpression',
                            object:{
                                type:'Identifier',
                                name:'NEJ'
                            },
                            property:{
                                type:'Identifier',
                                name:'define'
                            }
                        };

                        let newBlockStatement = t.blockStatement([
                            ...importsCodes,
                            ...defineCb.body.body
                        ]);

                        let _arguments:Array<t.Expression|t.SpreadElement>= [
                            defineDps,
                            t.functionExpression(
                                null,
                                defineCb.params as t.LVal[],
                                newBlockStatement
                            )
                        ];

                        let newCallExpression =  t.callExpression(
                            newMemberExpression as t.MemberExpression,
                            _arguments
                        )
                        let newAst = t.program([
                            t.expressionStatement(newCallExpression)
                        ]);

                        // 替换为新的ast
                        programPath.replaceWith(newAst);

                        // 终止
                        path.stop();
                    }
                }
            }
        }
    };
}
