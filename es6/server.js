var p1 = Promise.resolve('foo');

p1.then(function(res) {
    console.log(res)   ;
});

var p2 = new Promise(function(resolve, reject) {
    setTimeout(function() {
        resolve('bar');
    }, 3000);
});

// promise does not change (only the value)
p2.then(function(res) {
    res += 's';
    console.log(res);
});

// promise does not change (only the value)
p2.then(function(res) {
    console.log(res);
});

var p3 = new Promise(function(resolve, reject) {
    setTimeout(function() {
        reject('some error');
    }, 3000);
});

var fullfilled = function(res) {
    console.log('promise fullfilled:', res);
};

var rejected = function(err) {
    console.error('promise rejected:', err);
};

// equivalent
p3.then(fullfilled, rejected);
p3.then(fullfilled).then(undefined, rejected);
p3.then(fullfilled).catch(rejected);

// composing
Promise.all([p1, p2])
    .then(fullfilled)
    .catch(rejected);

Promise.all([p1, p3, p2])
    .then(fullfilled)
    .catch(rejected);

Promise.race([p1, p3, p2])
    .then(fullfilled)
    .catch(rejected);

p1.then(function(res) {
    console.log('1st promise fullfilled:', res);
}).then(function(res) {
    return 'value for next promise';
}).then(function(res) {
    console.log('value from previous promise:', res);
    return p3; // if p2 is returned, next 'catch' does not run
}).catch(function(err) {
    console.error('previous promise rejected:', err);
    return err;
}).then(function(res) {
    console.log('recovered from promised failed:', res);
});
