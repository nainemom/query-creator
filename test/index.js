var qc = require('../index.js');
var log = console.log;

qc.new().select('*', 'myTable').where('a = ?', [2]).val(log);
