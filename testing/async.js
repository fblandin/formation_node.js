function resolveAfter2Sec(){
    return new Promise(resolve =>
        setTimeout(() => {resolve('resolved')}, 2000))
}

async function asyncCall(){
    console.log('calling')
    var result = await resolveAfter2Sec()
    console.log(result)
}

asyncCall()