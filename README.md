# foldmaker-tiny
This is a reduced version of [Foldmaker](https://github.com/foldmaker/foldmaker) that only exposes `Foldmaker` and `tokenize` functions, and `f` class. Great for figuring out how Foldmaker works, since core utilities are `tokenize` function and `parse` method. The aim is to see how tiny Foldmaker's algorithm can be. FoldmakerObject class (`f` in this case), only has `parse`, `_replace`, `add` methods. These methods are oftenly adequate for tree generation. 

### Differences from the main version:

- There is no `replace`, `traverse` methods and `visitor` helper.
- Is not easily pluggable like the main version. 
- `parse` method does not set `'1'` for unset token types.
- `parse` method does not have `debug` callback as the last argument.
- `parse` method does not have `props` key in its callback argument, as soon as you won't do something like source mapping this is not important though.

Most Foldmaker [examples](https://github.com/foldmaker/foldmaker/blob/master/examples) that uses no more than `Foldmaker`, `tokenize`, `visitor` and `parse` method should also be able to work with this version. There is only the following slight change:

While parse method works like this in Foldmaker:
```js
parse([visitor(regex1, fn1), visitor(regex2, fn2)])
parse(regex1,fn1)
```
In this version, it works like this:
```js
parse([regex1, fn1], [regex2, fn2])
parse([regex1, fn1])
```

### When minified, whole code looks like this:
```js
class f{constructor(e){let t=e;this.types=t?e.map(e=>e.type).join(""):"",this.values=t?e
.map(e=>e.value):[]}parse(...e){(e=e.map(([e,t])=>[t,e])).push([()=>void 0,/[\s\n\S]/]);
let t=this;do{t=t._replace(t,e)}while(!0===t.m);return t}add(e,t){this.types+=e,this
.values=this.values.concat(t)}_replace({types:e,values:t},a){let l=new f;return tokenize
(e,a,({type:e,map:a,index:s})=>{let i=a[0].length,n={raw:t.slice(s,i+s),index:s,count:i,
map:a},p=e(n);p?(l.add(p[0],[p[1]]),l.m=!0):l.add(n.map[0],n.raw)}),l}}tokenize=(
(e,t,a)=>{let l=0,s=[];for(t.push(["0",/[\s\n\S]/]);e;)t.some(([t,i])=>{let n=i.exec(e);
if(n&&n.index<1){let i=n[0],p=a?a({type:t,value:i,map:n,index:l}):{type:t,value:i};
return p&&s.push(p),e=e.slice(i.length),l+=i.length,!0}});return s});let Foldmaker=e=>new f(e);
```