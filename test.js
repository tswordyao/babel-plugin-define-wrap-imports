const myPlugin = require('./index.js')
const babel= require('@babel/core')

const fs = require('fs');
const code = fs.readFileSync('./test-code.js');

babel.transform(code, {plugins:[myPlugin]}, (err, result)=>{
    if(err){
        return console.log(err)
    }
    fs.writeFileSync('./test-result.js',result.code,{flag:'w+'})
});