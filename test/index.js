var qc = require('../index.js');
var log = console.log;
log( qc.new().select('*', 'myTable').where('a = ?', [2]).val() );
