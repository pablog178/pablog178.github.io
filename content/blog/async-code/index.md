---
title: Aynchronous code (in JavaScript)
date: "2019-04-04T22:12:03.284Z"
description: "From callbacks to Promises to `async`/`await`."
---

JavaScript has always supported async code (but not multi-threading) using `callbacks`, the principal difference starting with ES6 and later, is the addition of 2 new features to make it easier for developers to read, maintain and reuse asynchronous code.

## Promises
Promises are new built-in Objects aimed to replace regular callbacks for async notation (other type of callbacks, such as those used in underscode or lodash functions, continue to be used as callbacks). In order to understand them, you should keep in mind their principal properties:

### Creating Promises

1. To create a new Promise, it receives 2 callbacks: `resolve` and `reject`.

    * `resolve()` should be called once the asynchronous call completes successfully.

        ```javascript
            const myPromise = new Promise(resolve => {
                setTimeout(() => {
                    resolve();
                }, 1500);
            });
        ```

    * `reject()` should be called if an error occurs or if something unexpected happen in execution.
    
        ```javascript
            const myPromise = new Promise((resolve, reject) => {
                dm.waitForDownload(url, (error, data) => {
                    if (error) {
                        reject(error);
                        return;
                    }

                    resolve(data);
                });
            });
        ```

1. A common pattern for asynchronous calls involving Promises is to create a function that returns a new Promise.

    ```javascript
        function waitForDownload (url) {
            return new Promise((resolve, reject) => {
                dm.waitForDownload(url, (error, data) => {
                    if (error) {
                        reject(error);
                        return;
                    }

                    resolve(data);
                });
            });
        }

        // Usage:
        waitForDownload(url)
            .then(data => { ... })
            .catch(error => { ... });
    ```

### Promise instance methods
    
* `.then()`. Called once the asynchronous execution of the promise has completed internally so it's ready to continue the flow. Most of the times, the logic that used to be in a callback will now be inside the `then()` method.

    ```javascript
        // Before
        waitForDownload(url, function(error, data) {
            saveFile(data);
        });
    ```

    ```javascript
        // Now
        waitForDownload(url) // waitForDownload() returns a Promise
            .then(data => { // Promise.then() receives a function
                saveFile(data);
            });
    ```

* `.catch()`. Called if any kind of error occurs within any of previous `then()` or `catch()` calls; this includes: any exception thrown within the promise, internal calls to `promise.reject()`. Ideally, any logic that has no recovery should be treated within the `catch()` method.

    ```javascript
        // Before
        waitForDownload(url, function(error, data) {
            if (error) {
                showErrorMessage(error.message);
                return;
            }
            
            saveFile(data);
        });
    ```

    ```javascript
        // Now
        waitForDownload(url) // waitForDownload() returns a Promise
            .then(data => { // Promise.then() receives a function
                saveFile(data);
            })
            .catch(error => { // Promise.catch() receives a function
                showErrorMessage(error.message);
            });
    ```

* `.finally()`. **ES2019**. Similar to the regular `try/catch/finally`, this method is called once all the `.then()` and `catch()` methods of a Promise have been invoked.

* `.then()` and `.catch()` methods are **chaineable**, that is, they return a new Promise so you can wait as many times as needed for multiple asynchronous calls.

    ```javascript
        // Before
         waitForDownload(url, function(dlError, data) {
            if (dlError) {
                showErrorMessage(dlError.message);
                return;
            }
            saveFile(data, function(svError, file) {
                if (svError) {
                    showErrorMessage(svError.message);
                    return;
                }

                notifyUser(file);
            });
        });
    ```

    ```javascript
        // Now
        waitForDownload(url)
            .then(data => { // waits for the download
                return saveFile(data); // saveFile should return a Promise.
            })
            .then(file => { // waits for the file to be saved
                notifyUser(file);
            })
            .catch(error => {
                showErrorMessage(error.message); // works for both cases, as both errors have `.message`
            })
            .catch(error => {
                console.error('An error occurred!!'); // Enters if the past catch resulted in an error
            });
    ```

* `.then()` and `.catch()` methods will **always** return a new Promise.

    ```javascript
        waitForDownload(url)
            .then(data => {
                saveFile(data);
                return true; // `true` is automatically returned as a Promise
            })
            .then(completed => { // completed === true
                if (completed) {
                    // do something
                } else {
                    // do something else
                }
            })
            .catch(error => {
                return error.code === 'ERR_CONNECTION';// the boolean value is embedded within a Promise
            })
            .then(isOffline => { // Will only be called if `catch` entered.
                if (isOffline) {
                    alert('no Internet connection');
                } else {
                    // do something else
                }
            })
            .catch(error => { //  Will only be called if there is an error in the previous then()
                // log the error
            });
    ```

### Promise static methods

* `Promise.all(<any[]>)` returns a single Promise that completes once **all** the Promises in the array complete.

    ```javascript
        Promise.all([
                waitForDownload(url),
                waitForSubmit(data),
                waitForNotification(notification)
            ])
            .then(responses => {
                // responses is an array with all the data resolved by all the promises.
                const [
                    downloadResponse,
                    submitResponse,
                    notificationResponse
                ] = responses;

                // do something with the remaining data.
            })
            .catch(error => {
                // only 1 object error is received as soon as it occurs in any request.
                // do something with the error
            });
    ```

    ```javascript
        // A common pattern is to create a dynamic amount of promises from an array and wait for them all.
        const dataToSend = [data1, data2, data3];
        const requests = dataToSend.map(data => waitForSubmit(data)); // waitForSubmit returns a Promise
        
        Promise
            .all(requests)
            .then(responses => {
                // do something with all the responses
            })
            .catch(error => {
                console.error(error.message);
            });
    ```

* `Promise.race(<any[]>)` returns a single Promise that completes once **one** of the Promises in the array complete.

    ```javascript
        Promise.race([
                waitForDownload(url),
                waitInMilliseconds(1000)
            ])
            .then(response => {
                // response will be only the response for whatever Promise completed first.
            })
            .catch(error => {
                console.error(error.message);
            });

    ```

### Rules for Promises

1. Promises are meant for **asynchronous** calls only. If there is no need for the code to wait for something, don't use them.

    ```javascript
        // avoid this, as find is not asynchronous.
        function findById (array, id) {
            return new Promise(resolve => {
                const item = _.find(array, item => item.id === id);
                resolve(item);
            });
        }
    ```

    ```javascript
        // Use a regular function without promises instead
        function findById (array, id) {
            const item = _.find(array, item => item.id === id);
            return item;
        }
    ```

1. Promises **should not** be nested, use their chaining `.then()` calls instead:
            
    ```javascript
        // avoid
        waitForAuthentication(credentials)
            .then(response => {
                const { id } = response;
                
                waitForProfile(id)
                    .then(profile => {
                        updateUI(profile);
                    });
            })
            .catch(error => {
                console.error(error.message);
            });
    ```

    ```javascript
        // prefer
        waitForAuthentication(credentials)
            .then(response => {
                const { id } = response;
                
                return waitForProfile(id);
            })
            .then(profile => {
                updateUI(profile);
            })
            .catch(error => {
                console.error(error.message);
            });
    ```

1. Promises and callbacks **should not** be mixed together.
    
    ```javascript
        // avoid
        waitForAuthentication(credentials)
            .then(response => {
                const { id } = response;
                
                waitForProfile(id, (error, profile) => {
                    updateUI(profile);
                });
            })
            .catch(error => {
                console.error(error.message);
            });
    ```

    ```javascript
        // prefer this approach, creating a promise container for your callback-based function

        function waitForProfilePromise(id) {
            return new Promise((resolve, reject) => {
                waitForProfile(id, (error, profile) => {
                    if (error) {
                        return reject(error);
                    }
                    
                    resolve(profile);
                });
            });
        }

        waitForAuthentication(credentials)
            .then(response => {
                const { id } = response;
                
                return waitForProfilePromise(id);
            })
            .then(profile => {
                updateUI(profile);
            })
            .catch(error => {
                console.error(error.message);
            });
    ```

1. Promise-based functions **should** always return the Promise, to ensure they can be chained and reused from different sources.

    ```javascript
        // returns a Promise
        function waitRequest(url) {
            return new Promise((resolve, reject) => {
                request(url, (error, response) => {
                    if (error) {
                        return reject(error);
                    }
                    
                    resolve(response);
                });
            });
        }

        // returns a Promise
        function countLinesInHtml(url) {
            return waitRequest(url)
                .then(response => {
                    return response.html.split('\n').length;
                });
        }

        // returns a promise
        function countLinesInSearchEngines() {
            return Promise.all([
                    countLinesInHtml('google.com'),
                    countLinesInHtml('duckduckgo.com'),
                    countLinesInHtml('bing.com'),
                ])
                .then(allLines => {
                    const [google, duckduckgo, bing] = allLines;
                    return google + duckduckgo + bing;
                });
        }
    ```

[Further reading](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)

## `async`/`await`

`async` and `await` are 2 expressions added in ES2017, which make it easier to read and write asynchronous code. They are not intended to replace Promises completely, as they relay internally in them.

`async` is added in a function expression, it causes that function to **return a Promise even if you don't define it**.

```javascript

// All these functions are equivalent
async function add(n1, n2) {
    return n1 + n2;
}

const add = async (n1, n2) => {
    return n1 + n2;
};

function add(n1, n2) {
    return new Promise(resolve => {
        resolve(n1 + n2);
    });
}


// Using them without await
add(1, 1)
    .then(result => {
        console.log(result);
    });
```

`await` is an expression used before invoking a Promise. It causes the data coming in the `then()` method to be returned instead.

`await` expressions can be used **only** within `async` functions.

```javascript
function add(n1, n2) {
    return new Promise(resolve => {
        resolve(n1 + n2);
    });
}

// Before, using the promise
add(1, 2)
    .then(result => {
        console.log(result);
    });

// using await
const result = await add(1, 2);
console.log(result);
```

### From callbacks to async/await

```javascript
// Before, with callbacks

function waitForDownload(url, callback) {
    request(url, (error, response) = {
        if (error) {
            return callback(error);
        }

        return callback(null, response);
    });
}

function waitForNotification(id, callback) {
    notify(id, (error, response) = {
        if (error) {
            return callback(error);
        }

        return callback(null, response);
    });
}

function start() {
    waitForDownload('google.com', (error, response) => {
        if (error) {
            console.error(error);
            return;
        }

        waitForNotification(response.id, (error2, response2) => {
            if (error) {
                console.error(error);
                return;
            }

            console.log(response2);
        });
    });
}


start();
```

```javascript
// Now, with promises

function waitForDownload(url) {
    return new Promise((resolve, reject) => {
        request(url, (error, response) = {
            if (error) {
                return reject(error);
            }

            return resolve(response);
        });
    });
}

function waitForNotification(id) {
    return new Promise((resolve, reject) => {
        notify(id, (error, response) = {
            if (error) {
                return reject(error);
            }

            return resolve(response);
        });
    });
}

function start() {
    waitForDownload('google.com')
        .then(response => {
            return waitForNotification(response.id);
        })
        .then(response => {
            console.log(response);
        })
        .catch(error => {
            console.error(error);
        });
}

start();
```

```javascript
// Now, with async/await

async function waitForDownload(url) {
    return new Promise((resolve, reject) => {
        request(url, (error, response) = {
            if (error) {
                return reject(error);
            }

            return resolve(response);
        });
    });
}

async function waitForNotification(id) {
    return new Promise((resolve, reject) => {
        notify(id, (error, response) = {
            if (error) {
                return reject(error);
            }

            return resolve(response);
        });
    });
}

async function start() {
    try {
        const response = await waitForDownload('google.com');
        const response2 = await waitForNotification(response.id);
        console.log(response2);
    } catch(error) {
        console.error(error);
    }
}

start();
```

### Why it's important to always return the promise in a function

If you followed the rule #4, about always returning Promises to be reused, this design can be adapted to async/await usage.


* Promise-based functions 

    ```javascript
        // Returns a promise
        function waitRequest(url) {
            return new Promise((resolve, reject) => {
                request(url, (error, response) => {
                    if (error) {
                        return reject(error);
                    }
                    
                    resolve(response);
                });
            });
        }

        // returns a Promise
        function countLinesInHtml(url) {
            return waitRequest(url)
                .then(response => {
                    return response.html.split('\n').length;
                });
        }

        // returns a promise
        function countLinesInSearchEngines() {
            return Promise.all([
                    countLinesInHtml('google.com'),
                    countLinesInHtml('duckduckgo.com'),
                    countLinesInHtml('bing.com'),
                ])
                .then(allLines => {
                    const [google, duckduckgo, bing] = allLines;
                    return google + duckduckgo + bing;
                });
        }
    ```

* Async/await approach

    ```javascript
        // returns a Promise
        async function waitRequest(url) {
            return new Promise((resolve, reject) => {
                request(url, (error, response) => {
                    if (error) {
                        return reject(error);
                    }
                    
                    resolve(response);
                });
            });
        }

        // returns a Promise
        async function countLinesInHtml(url) {
            const response = await waitRequest(url);
            return response.html.split('\n').length;
        }

        // returns a promise
        async function countLinesInSearchEngines() {
            const allLines = await Promise.all([
                countLinesInHtml('google.com'),
                countLinesInHtml('duckduckgo.com'),
                countLinesInHtml('bing.com'),
            ]);
            const [google, duckduckgo, bing] = allLines;
            return google + duckduckgo + bing;
        }
    ```

## Coding for asynchronous 

async/await is not a silver bullet for asynchronous requests. Some times you will need to still make use of Promises or even something different.

* **async/await** blocks the whole thread until the Promise(s) it's waiting for complete.

* **async/await** is part of the ES2017 standard, it may not be fully supported in the platform you are coding for.

* **Promises** allow non-asynchronous code to keep running outside the `.then()` chains.

* Callbacks are still part of the JavaScript language, Promises and async/await are great, but they are for **one-time events**. If you need asynchronous code that could be triggered more than once, use **events** or **observables**.


