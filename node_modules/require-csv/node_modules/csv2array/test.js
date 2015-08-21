var csv = require('./index');

var str = '"aa aa","bbb  b"\n"ccc","ddd d"';

var strwhitespace = '"aaaa", "bb bb"\n"c  cc", "dddd"';
console.log(str);

console.log(csv(str, { delimiter: '"' }));

console.log(csv(strwhitespace, { skipwhitespace: true }));
