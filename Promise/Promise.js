function Promise(executor) {
    this.PromiseState = 'pending'
    this.PromiseRuselt = null
    this.callback = []
    let selt = this

    function resolve(data) {
        if (selt.PromiseState !== 'pending') return
        selt.PromiseState = 'fulfilled'
        selt.PromiseRuselt = data
        selt.callback.forEach(item => {
            item.onResolve(data)
        })
    }
    function reject(data) {
        if (selt.PromiseState !== 'pending') return
        selt.PromiseState = 'rejected'
        selt.PromiseRuselt = data
        selt.callback.forEach(item => {
            item.onReject(data)
        })
    }


    try {
        executor(resolve, reject)
    } catch (error) {
        reject(error)
    }

}

Promise.prototype.then = function (onResolve, onReject) {
    let selt = this

    if (typeof onReject !== 'function') {
        onReject = function (reason) {
            throw reason
        }
    }

    if (typeof onResolve !== 'function') {
        onResolve = vul => vul
    }
    return new Promise((resolve, reject) => {
        function callback(type) {
            try {
                let result = type(selt.PromiseRuselt)
                if (result instanceof Promise) {
                    result.then((s) => {
                        resolve(s)
                    }, (j) => { reject(j) })
                } else {
                    resolve(result)
                }
            } catch (error) {
                reject(error)
            }
        }

        if (this.PromiseState === 'fulfilled') {
            callback(onResolve)
        }
        if (this.PromiseState === 'rejected') {
            callback(onReject)
        }
        if (this.PromiseState === 'pending') {
            this.callback.push({
                onResolve:
                    function () { callback(onResolve) },
                onReject:
                    function () { callback(onReject) },
            })
        }
    })
}

Promise.prototype.catch = function (onReject) {
    return this.then(undefined, onReject)
}

Promise.resolve = function (vul) {
    return new Promise((resolve, reject) => {
        if (vul instanceof Promise) {
            vul.then(s => { resolve(s) },
                j => { reject(j) })
        } else {
            resolve(vul)
        }
    })
}
Promise.reject = function (vul) {
    return new Promise((resolve, reject) => {
        if (vul instanceof Promise) {
            vul.then(s => { resolve(s) },
                j => { reject(j) })
        } else {
            reject(vul)
        }
    })
}

Promise.all = function (promises) {
    return new Promise((resolve, reject) => {
        let count = 0
        let arr = []
        for (let i = 0; i < promises.length; i++) {
            promises[i].then(s => {
                count++
                arr[i] = s
                if (count === promises.length) {
                    resolve(arr)
                }
            }, j => {
                reject(j)
            })
        }
    })
}

Promise.race = function (promises) {
    return new Promise((resolve, reject) => {
        for (let i = 0; i < promises.length; i++) {
            promises[i].then(s => {
                resolve(s)
            }, j => {
                reject(j)
            })
        }
    })
}