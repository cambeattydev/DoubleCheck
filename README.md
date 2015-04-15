Double Check
=================

Library for developers to integrate keystroke dynamics into user authentication.  
When installed with NPM, the software will create a file system for developers 
to use on there node servers.  

## How to start
Inorder to use this package, a developer must run `npm install DoubleCheck`. 
This will create a file system that looks like:  
```
.
├── node_modules
│   └── DoubleCheck
│       ├── README.md
│       ├── doubleCheck.js
│       ├── doubleCheckDatabaseTest.db
│       ├── login.js
│       ├── node_modules
│       │   └── sqlite3
│       │       ├── ...
│       ├── package.json
│       ├── register.js
│       ├── scripts
│       │   ├── createFile.js
│       │   └── removeFile.js
│       └── tests
│           ├── nodeForm.js
│           ├── register.html
│           ├── test.html
│           └── testing.js
├── testing.js
```
##Usage

**Note:** the module must be [installed](#installing) before use.

```js
var dc = require('DoubleCheck');
```
This will givue you functions avaliable to it. These are avaliable checking the API
of the system.

## Dependencies
- sqlite3

## API

See the [API documentation](https://github.com/ckbeatty/DoubleCheck/wiki/Double-Check-API) in the wiki.

## Contributors

* [Cameron Beatty](https://github.com/ckbeatty)

## License

`DoubleCheck` is [ISC](http://opensource.org/licenses/ISC)
