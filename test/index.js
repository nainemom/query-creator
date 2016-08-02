var qb = require('../index.js');
var log = console.log;

qb.new().select('*', 'myTable').where('a = ?', [2]).val(log);


/*
let query = new QueryBuilder().select('*', 'myTable');
console.log('hi');*/