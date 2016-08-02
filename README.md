# Sql Query Creator
_A small nodejs module to create nice SQL queries without any dependency_

# Install
```bash
npm install query-creator
```
And then, import it:
```js
const qc = require("query-creator");
```

# Usage
```js
let query = qc.new()
.select([
    'fieldOne',
    'fieldTwo'
], 'myTable')
.where( 'fieldOne = ?', [4])
.groupBy( 'fieldTwo' )
.val();
// now, query variable is :
// SELECT fieldOne, fieldTwo FROM myTable WHERE fieldOne = 4 GROUP BY fieldTwo;
```
