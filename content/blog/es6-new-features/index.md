---
title: ES6 (and beyond) new features
date: '2019-04-03T22:12:03.284Z'
description: 'ES6 new features, at least they were back in 2015'
---

ECMAScript is the standard definition of the JavaScript language, although it's not limited to it, and other languages could be created following the standard, without being called JavaScript.
As the standard for the language, all changes, including new features, API updates, implementation, depends fully in the ES version the language is following.

## Versions

Starting in 2015, ECMAScript gets updates every year around June., but the JS language doesn't implement the new features until later in the year, depending on the engine or transpiler timeline.
The following is a table about the different versions that have rolled out along the years since JavaScript was first implemented.

- ES1. June 1997
- ES2. June 1998
- ES3. December 1999
- ES4. **Abandoned**
- ES5. December 2009
- ES5.June 2011
- ES6. June 2015
- ES7. June 2016. AKA ES-2016
- ES8. June 2017. AKA ES-2017
- ES9. June 2018. AKA ES-2018
  As you can see, starting in 2016, the official naming changed from a number to the year of release.
  There is also **ES-Next**, which refers to whatever is the upcoming definition that has not been published yet, as the day of edition, ES-Next would refer to **ES10 (ES-2019)**

## Transpilers

Transpilers are source-to-source compilers, which take code written in the latest version of ES and generate code compliant with older versions.
Starting with ES6, transpilers gained popularity and they allowed for developers to embrace the latest features of the language without having to wait for the browsers (and their users) to support them.
Nowadays, transpilers are the first tools to support the latest versions of ES and even ES-Next, they can be configured to generate compliant code with ES3, ES5 or later, it will always depend on the developer's needs. Because of this, most boilerplates and new JS tools will depend make use of a transpiler as part of the regular development process.

## How to keep up to date?

With new updates being more frequent, transpilers supporting these new features and and more active than ever community around JS, there are new questions about ECMAScript and their latest versions:

- What do these features do?
- When should I use them?
- Am I using some older API that I should not use anymore?
- Is this supported in most browsers so I should not transpile it?
  Unfortunately, we don't have concrete answers for most of these questions, but we can put you in the right direction:
- Use [MDN Web Docs](https://developer.mozilla.org/en-US/) to review the documentation about any API, it includes examples, when to use them and what browsers support it, including Node.js versions.
- Axel Rauschmayer [Exploring ES2016 and 2017](http://exploringjs.com/es2016-es2017/) exhibits detailed information about all the new features in these versions, also make sure you read his [blog](http://2ality.com/), as he post frequent updates for new features in each new release.

## How code for ES5 will change

There are multiple sites where you can find all the list of new features added in ES6 and later. For information purposes, and based on a personal experience, we will list the changes compared to the code nowadays written in ES5 the will need to be covered.

### `const`, `let`, `var` and block-scopes.

**Before:** we declared all variables at the start of the `function`.

```javascript
function isAdult(person) {
	var age = person.age || -1;
	var result = null;

	if (!_.isNumber(age)) {
		age = Number(age) || -1;
	}

	result = age >= 18;

	return result;
}
```

**Now:** we declare variables until we use them. By default we use `const`; if the variable needs to point to a different value after we declare it, we use `let`.

```javascript
function isAdult(person) {
	let age = person.age || -1;

	if (!_.isNumber(age)) {
		age = Number(age) || -1;
	}

	const result = age >= 18;
	return result;
}
```

**Before:** we declared all variables at the start of the function to avoid bugs related with the hoisting and global declarations.

```javascript
(function () {
	var appName = Ti.App.name;
	var appId = Ti.App.id;
	var osName = null;
	var isIpad = false;

	if (Ti.Platform.name === 'android') {
		osName = 'android';
		isIpad = false;
		return;
	}

	if (Ti.Platform.name === 'iphone') {
		osName = 'ios';
	}

	isIpad = Ti.Platform.device.width === 320;
})();
```

**Now:** `const` and `let` declare the variables within the block, avoiding hoisting issues by default:

```javascript
{
	const appName = Ti.App.name;
	const appId = Ti.App.id;
	let isIpad = false;

	if (Ti.Platform.name === 'android') {
		const osName = 'android';
		return;
	}

	if (Ti.Platform.name === 'iphone') {
		const osName = 'ios';
	}

	isIpad = Ti.Platform.device.width === 320;
}
```

[Further reading](https://hacks.mozilla.org/2015/07/es6-in-depth-let-and-const/)

### Template literals

**Before** We used concatenation (`+`) for multiple chains of characters.

```javascript
const person = {
	name: 'John Doe',
	age: 47,
};
const message = 'Person name: ' + person.name + ', age: ' + person.age;
```

**Now** String literals allow insertion of variables directly within strings.

```javascript
const person = {
    name: 'John Doe',
    age: 47
};
const message =  `Person name:  ${person.name}, age: ${person.age}`;
```

```javascript
function add(a, b) {
  return a + b;
}
const message = `5 + 8 = ${add(5, 8)}`; // 5 + 8 = 13
```

**Before** Showing strings with multiple lines required to scape the line break.

```javascript
const message =
	'This \
message \
has \
multiple \
lines';
```

**Now** String literals allow to use line breaks within the same string.

```javascript
const message = `This 
message 
has 
multiple 
lines`;
```

[Further reading](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)

### Arrow Functions

**Before** We used regular function declaration for **anonymous** functions, mostly used in **callbacks**.

```javascript
const numbers = [1, 2, 3, 4, 5];
const double = _.map(numbers, function (number) {
	return number * 2;
});
```

**Now** Arrow functions allow the same functionality, removing syntax.

```javascript
const numbers = [1, 2, 3, 4, 5];

const double = _.map(numbers, (number) => {
	// easier to read
	return number * 2;
});

const double = _.map(numbers, (number) => number * 2); // shortest form
```

**Before** If we required to preserve `this` reference, we needed to save it in a separate variable (e.g. `self`).

```javascript
function Person(name) {
	const self = this;
	this.name = name;

	const sayName = function () {
		console.log('My name is ' + this.name);
	};

	return {
		sayName: sayName,
	};
}
```

**Now** We should use arrow functions to avoid missing the original reference to `this`.

```javascript
function Person(name) {
	this.name = name;

	const sayName = () => {
		console.log(`My name is ${this.name}`);
	};

	return {
		sayName: sayName,
	};
}
```

[Further reading](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)

### Destructuring

Use destructuring to assign multiple attributes out of an `object` or `array` into separate variables. Reaplces `dot-notation` when needed.

```javascript
// Before
const person = {
	name: 'john doe',
	age: 21,
	address: 'Street 123',
	state: 'PA',
	country: 'US',
	lang: 'en-US',
};

const age = person.age; // no default
const nation = person.country; // rename variable
const name = person.name || 'No name'; // default to 'No Name' if falsy
const address = person.address || ''; // default to '' if falsy
const state = person.state || ''; // default to '' if falsy
const language = person.lang || ''; // default to '' if falsy and renames variable
```

```javascript
// Now
const person = {
    name: 'john doe',
    age: 21,
    address: 'Street 123',
    state: 'PA',
    country: 'US',
    lang: 'en-US'
};

const {
    age, // no default
    country: nation, // rename variable (`person.country` to variable `nation`)
    name = 'No name', // defaults to 'No name' if `undefined`
    address = '', // defaults to '' if `undefined`
    state = '', // defaults to '' if `undefined`
    lang: language = '' // defaults to 'No name' if `undefined` and renames the variable
} = person;
```

```javascript
// Before
const array = [ 1, 2, 3, 4, 5, 6 ];
const num1 = array[0];
const num2 = array[1];
const num3 = array[2] !== undefined ? array[2] : -1;
```

```javascript
// Now
const array = [1, 2, 3, 4, 5, 6];
const [num1, num2, num3 = -1] = array;
```

```javascript
// Before
const person = {
	name: 'john doe',
	age: 21,
	address: {
		line1: 'Street 123',
		line2: '',
		state: 'PA',
		country: 'US',
		zip: '12345',
	},
	langs: ['en-US', 'en-GB', 'fr-CA'],
};

const name = person.name || '';

const address = person.address || {};
const zip = address.zip;

const langs = person.langs || [];
const primaryLang = langs[0] || 'N/A';
```

```javascript
// Now
const person = {
	name: 'john doe',
	age: 21,
	address: {
		line1: 'Street 123',
		line2: '',
		state: 'PA',
		country: 'US',
		zip: '12345',
	},
	langs: ['en-US', 'en-GB', 'fr-CA'],
};

const {
	name = '',

	address: { zip } = {},

	langs: [primaryLang = 'N/A'] = [],
} = person;
```

```javascript
// Before
const lookup = {
	key: 'line4',
};

const data = {
	line1: 'line1',
	line2: 'line2',
	line3: 'line3',
	line4: 'line4',
	line5: 'line5',
};

const key = lookup.key || '';
const realData = data[key] || '';
```

```javascript
// Now
const lookup = {
	key: 'line4',
};

const data = {
	line1: 'line1',
	line2: 'line2',
	line3: 'line3',
	line4: 'line4',
	line5: 'line5',
};

const key = lookup.key || '';
const { [key]: realData } = data;
```

[Further reading](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)

### Spread operator `...`

- Use it for concatenate arrays.

```javascript
// Before
const array1 = [1, 2, 3];
const array2 = ['a', 'b', 'b'];
const concatArray = array1.concat(array2);
```

```javascript
// Now
const array1 = [1, 2, 3];
const array2 = ['a', 'b', 'b'];
const concatArray = [...array1, ...array2];
```

```javascript
// Before
const array1 = [1, 2, 3];
const array2 = ['a', 'b', 'b'];
const concatArray = array1.concat(4, 5, 6, array2);
```

```javascript
// Now
const array1 = [1, 2, 3];
const array2 = ['a', 'b', 'b'];
const concatArray = [...array1, 4, 5, 6, ...array2];
```

- Use it to expand an array into a list of parameters for a function.

```javascript
// Before
const array = [1, 2, 3];

function add(n1, n2, n3) {
	return n1 + n2 + n3;
}

add.apply(null, array);
```

```javascript
// Now
const array = [1, 2, 3];

function add(n1, n2, n3) {
	return n1 + n2 + n3;
}

add(...array);
```

- With **ES2018**, we could also expand objects inside other objects.

```javascript
// Before
const address = {
	line1: 'Street 123',
	state: 'PA',
	zip: '92831',
};

const person = {
	name: 'john doe',
};
_.extend(person, address);

/*
{
    "name": "john doe",
    "line1": "Street 123",
    "state": "PA",
    "zip": "92831"
}
*/
```

[Further reading](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)

### Rest parameter: `...`

**Before** we calculated the remaining elements from an array.

```javascript
const array = [1, 2, 3, 4, 5];
const item1 = array[0];
const remaining = array.slice(1); // [ 2, 3, 4, 5 ]
```

**Now** we can use the rest parameter to automatically assign the remaining values of an array while **destructuring**.

```javascript
const array = [1, 2, 3, 4, 5];
const [item1, ...remaining] = array;
```

This also applies for function's `arguments` variable.

```javascript
// Before
function add() {
	const numbers = Array.from(arguments);
	let result = 0;

	for (let i = 0, len = numbers.length; i < len; i++) {
		result += numbers[i];
	}

	return result;
}
```

```javascript
// Now
function add(...numbers) {
	let result = 0;

	for (let i = 0, len = numbers.length; i < len; i++) {
		result += numbers[i];
	}

	return result;
}
```

```javascript
// Before
function saveFile(name, dest) {
	const params = Array.from(arguments);
	const options = params.slice(2);

	// ...
}
```

```javascript
// Now
function saveFile(name, dest, ...options) {
	// ...
}
```

[Further reading](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters).

### Parameters with default values

**Before** we used additional variable declarations and short-circuit declarations for defaults.

```javascript
// Before
function saveFile(name, dest, options) {
	name = name || '';
	dest = dest || '';
	options = options || {};
}
```

**Now** functions support default value declarations, the principal difference is that the default value will be applied **only** for `undefined` values.

```javascript
// Now
function saveFile(name = '', dest = '', options = {}) {}
```

This is compatible with the destructuring notation.

```javascript
// Before
function saveFile(name, dest, options) {
	name = name || '';
	dest = dest || '';
	options = options || {};

	const rename = options.rename;
	const create = options.create || false;
}
```

```javascript
// Now
function saveFile(name = '', dest = '', { rename, create = false } = {}) {}
```

[Further reading](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters).

### Enhanced Object Properties

**Before** we had to specify properties along with value for object declaration.

```javascript
// Before
const name = 'john doe';
const age = 21;
const sayName = () => {
	console.log(this.name);
};

const person = {
	name: name,
	age: age,
	sayName: sayName,
};
```

**Now** we can skip the value declaration if there is a variable with the same name as the attribute.

```javascript
// Now
const name = 'john doe';
const age = 21;
const sayName = () => {
	console.log(this.name);
};

const person = {
	name,
	age,
	sayName,
};
```

**Before** we specified the `function` expression when assigning anonymous functions into objects (methods).

```javascript
// Before
const person = {
	name: 'john doe',
	sayName: function () {
		console.log(this.name);
	},
};
```

**Now** we can skip the `function` word for object methods.

```javascript
// Now
const person = {
	name: 'john doe',
	sayName() {
		console.log(this.name);
	},
};
```

[Further reading](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer).
