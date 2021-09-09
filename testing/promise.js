const myPromise = new Promise(function (resolve,reject){
    setTimeout(() => {resolve('fine 1')}, 2000)
})
.then (function whenOk(response){
    console.log("log 1 : ", response)
    // le return de la nouvelle promise est important pour que les then ne s'active pas sur la première promise
    return new Promise(function (resolve,reject){
        setTimeout(() => {resolve('fine 2')}, 2000)
    })
    .then (function whenOk(response){
        console.log("log 3 : ", response)
        return response
    })
})
.then (function whenOk(response){
    console.log("log 2 : ", response)
    return response
})
.catch(function notOk(err){
    console.error(err)
})

var p1 = new Promise(function (resolve,reject){
    setTimeout((param) => {
        console.log(param)
        resolve()}, 1000, 'un')
});
var p2 = new Promise(function (resolve,reject){
    setTimeout((param) => {
        console.log(param)
        resolve()}, 2000, 'deux')
});
var p3 = new Promise(function (resolve,reject){
    setTimeout((param) => {
        console.log(param)
        resolve()}, 3000, 'trois')
});
var p4 = new Promise(function (resolve,reject){
    setTimeout((param) => {
        console.log(param)
        resolve()}, 4000, 'quatre')
});
var p5 = new Promise(function (resolve,reject){
    setTimeout((param) => {
        console.log(param)
        reject('rejet')}, 2500, 'quatre')
});

Promise
    .race([p1,p2,p3, p4, p5])
    .then(values => {
        console.log("all then",values)
    })
    .catch(reason => {
        console.log("all catch", reason)
    });