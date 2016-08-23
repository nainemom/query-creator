let QueryCreator = function(){
	var self = this;
	let prepend = '';

	self._next = function(x=''){
		prepend+= x;
		return self;
	}
	self._join = function(items, sep = ',', container = ''){
        let ret = items;
		if( ret.constructor == Array ){
            ret = ret.join(sep);
        }
		return ret;
	}

	self.create = function( name, columns ){
		let columnsText = new Array();
		for( let i in columns ){
			columnsText.push( i + ' ' + columns[i].toUpperCase() );
        }
		return self._next('CREATE TABLE '+name+' ('+ self._join(columnsText) +')');
	}
	self.drop = function( name ){
		return self._next('DROP TABLE IF EXISTS '+ name);
	}
	
	self.select = function(fields, tables){
		return self._next('SELECT '+ self._join(fields) +' FROM '+ self._join(tables) );
	}
	self.insert = function( table, values ){
		let valuesText = new Array();
		let columnsText = new Array();
		for( let i in values ){
			columnsText.push(i);
			if( typeof values[i] == 'number' ){
				valuesText.push( values[i] );
            }
			else{
				valuesText.push( '"' + values[i].toString() + '"');
            }
		}
		return self._next('INSERT INTO '+ table +'('+ self._join(columnsText) +') VALUES('+self._join(valuesText)+')');
	}
	self.update = function( table, values ){
		let valuesText = new Array();
		for( let i in values ){
			if( typeof values[i] == 'number' ){
				valuesText.push( i + ' = ' + values[i] );
            }
			else{
				valuesText.push( i + ' = "' + values[i].toString() + '"');
            }
		}
		return self._next('UPDATE '+table+' SET '+self._join(valuesText));
	}
	
	self.delete = function( table ){
		return self._next('DELETE FROM '+table);
	}

	self.where = function(condition, params = []){
		condition = condition.split('?');
		if( condition.length - 1 != params.length ){
			throw 'Error in params and ?s length';
        }
		let ret = condition[0];
		for( let i = 1; i < condition.length; i++ ){
			if( typeof params[i-1] == 'number' ){
				ret+= params[i-1]+condition[i];
            }
			else{
				ret+= '"'+params[i-1]+'"'+condition[i];
            }
		}
		return self._next(' WHERE '+ret);
	}
	self.and = function(condition){
		return self._next(' AND '+condition);
	}
	self.or = function(condition){
		return self._next(' OR '+condition);
	}
	self.groupBy = function(fields='*'){
		return self._next(' GROUP BY '+self._join(fields));
	}
	self.orderBy = function(field, type = ''){
		return self._next(' ORDER BY '+field+' '+type.toUpperCase() );
	}
	self.join = function(table, on){
		return self._next(' JOIN '+table+' ON '+on);
	}
	self.innerJoin = function(table, on){
		return self._next(' INNER JOIN '+table+' ON '+on);
	}
	self.outerJoin = function(table,on){
		return self._next(' OUTER JOIN '+table+' ON '+on);
	}
	self.leftJoin = function(table,on){
		return self._next(' LEFT JOIN '+table+' ON '+on);
	}
	self.rightJoin = function(table,on){
		return self._next(' RIGHT JOIN '+table+' ON '+on);
	}
	self.limit = function(from,to){
		let limitText = typeof to == 'undefined'? from: (from + ', ' + to);
		return self._next(' LIMIT '+limitText);
	}
	self.val = function(callback){
        let query = prepend.trim() + ';';
        if( typeof callback == 'function' ){
            callback(query);
        }
		return query;
	}
}

exports.new = function(){
    return new QueryCreator();
}
