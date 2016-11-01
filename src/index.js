let QueryCreator = ()=>{
	var self = {};
	let prepend = '';

	self._next = (x='')=>{
		prepend+= x;
		return self;
	}
	self._join = (items, sep = ',', container = '')=>{
        let ret = items;
		if( ret.constructor == Array ){
            ret = ret.join(sep);
        }
		return ret;
	}

	self.create = ( name, columns )=>{
		let columnsText = new Array();
		for( let i in columns ){
			columnsText.push( i + ' ' + columns[i].toUpperCase() );
        }
		return self._next('CREATE TABLE '+name+' ('+ self._join(columnsText) +')');
	}
	self.drop = ( name )=>{
		return self._next('DROP TABLE IF EXISTS '+ name);
	}
	
	self.select = (fields, tables)=>{
		return self._next('SELECT '+ self._join(fields) +' FROM '+ self._join(tables) );
	}
	self.insert = ( table, values )=>{
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
	self.replace = ( table, values )=>{
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
		return self._next('REPLACE INTO '+ table +'('+ self._join(columnsText) +') VALUES('+self._join(valuesText)+')');
	}
	self.update = ( table, values )=>{
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
	
	self.delete = ( table )=>{
		return self._next('DELETE FROM '+table);
	}

	self.where = (condition, params = [])=>{
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
	self.and = (condition)=>{
		return self._next(' AND '+condition);
	}
	self.or = (condition)=>{
		return self._next(' OR '+condition);
	}
	self.groupBy = (fields='*')=>{
		return self._next(' GROUP BY '+self._join(fields));
	}
	self.orderBy = (field, type = '')=>{
		return self._next(' ORDER BY '+field+' '+type.toUpperCase() );
	}
	self.join = (table, on)=>{
		return self._next(' JOIN '+table+' ON '+on);
	}
	self.innerJoin = (table, on)=>{
		return self._next(' INNER JOIN '+table+' ON '+on);
	}
	self.outerJoin = (table,on)=>{
		return self._next(' OUTER JOIN '+table+' ON '+on);
	}
	self.leftJoin = (table,on)=>{
		return self._next(' LEFT JOIN '+table+' ON '+on);
	}
	self.rightJoin = (table,on)=>{
		return self._next(' RIGHT JOIN '+table+' ON '+on);
	}
	self.limit = (from,to)=>{
		let limitText = typeof to == 'undefined'? from: (from + ', ' + to);
		return self._next(' LIMIT '+limitText);
	}
	self.val = (semi)=>{
		semi = typeof semi == 'undefined'? true: semi;
        let query = prepend.trim() + (semi?';':'');
		return query;
	}
	return self;
}

exports.new = ()=>{
    return new QueryCreator();
}
