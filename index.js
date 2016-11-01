'use strict';

var QueryCreator = function QueryCreator() {
	var self = {};
	var prepend = '';

	self._next = function () {
		var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

		prepend += x;
		return self;
	};
	self._join = function (items) {
		var sep = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ',';
		var container = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

		var ret = items;
		if (ret.constructor == Array) {
			ret = ret.join(sep);
		}
		return ret;
	};

	self.create = function (name, columns) {
		var columnsText = new Array();
		for (var i in columns) {
			columnsText.push(i + ' ' + columns[i].toUpperCase());
		}
		return self._next('CREATE TABLE ' + name + ' (' + self._join(columnsText) + ')');
	};
	self.drop = function (name) {
		return self._next('DROP TABLE IF EXISTS ' + name);
	};

	self.select = function (fields, tables) {
		return self._next('SELECT ' + self._join(fields) + ' FROM ' + self._join(tables));
	};
	self.insert = function (table, values) {
		var valuesText = new Array();
		var columnsText = new Array();
		for (var i in values) {
			columnsText.push(i);
			if (typeof values[i] == 'number') {
				valuesText.push(values[i]);
			} else {
				valuesText.push('"' + values[i].toString() + '"');
			}
		}
		return self._next('INSERT INTO ' + table + '(' + self._join(columnsText) + ') VALUES(' + self._join(valuesText) + ')');
	};
	self.replace = function (table, values) {
		var valuesText = new Array();
		var columnsText = new Array();
		for (var i in values) {
			columnsText.push(i);
			if (typeof values[i] == 'number') {
				valuesText.push(values[i]);
			} else {
				valuesText.push('"' + values[i].toString() + '"');
			}
		}
		return self._next('REPLACE INTO ' + table + '(' + self._join(columnsText) + ') VALUES(' + self._join(valuesText) + ')');
	};
	self.update = function (table, values) {
		var valuesText = new Array();
		for (var i in values) {
			if (typeof values[i] == 'number') {
				valuesText.push(i + ' = ' + values[i]);
			} else {
				valuesText.push(i + ' = "' + values[i].toString() + '"');
			}
		}
		return self._next('UPDATE ' + table + ' SET ' + self._join(valuesText));
	};

	self.delete = function (table) {
		return self._next('DELETE FROM ' + table);
	};

	self.where = function (condition) {
		var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

		condition = condition.split('?');
		if (condition.length - 1 != params.length) {
			throw 'Error in params and ?s length';
		}
		var ret = condition[0];
		for (var i = 1; i < condition.length; i++) {
			if (typeof params[i - 1] == 'number') {
				ret += params[i - 1] + condition[i];
			} else {
				ret += '"' + params[i - 1] + '"' + condition[i];
			}
		}
		return self._next(' WHERE ' + ret);
	};
	self.and = function (condition) {
		return self._next(' AND ' + condition);
	};
	self.or = function (condition) {
		return self._next(' OR ' + condition);
	};
	self.groupBy = function () {
		var fields = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '*';

		return self._next(' GROUP BY ' + self._join(fields));
	};
	self.orderBy = function (field) {
		var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

		return self._next(' ORDER BY ' + field + ' ' + type.toUpperCase());
	};
	self.join = function (table, on) {
		return self._next(' JOIN ' + table + ' ON ' + on);
	};
	self.innerJoin = function (table, on) {
		return self._next(' INNER JOIN ' + table + ' ON ' + on);
	};
	self.outerJoin = function (table, on) {
		return self._next(' OUTER JOIN ' + table + ' ON ' + on);
	};
	self.leftJoin = function (table, on) {
		return self._next(' LEFT JOIN ' + table + ' ON ' + on);
	};
	self.rightJoin = function (table, on) {
		return self._next(' RIGHT JOIN ' + table + ' ON ' + on);
	};
	self.limit = function (from, to) {
		var limitText = typeof to == 'undefined' ? from : from + ', ' + to;
		return self._next(' LIMIT ' + limitText);
	};
	self.val = function (semi) {
		semi = typeof semi == 'undefined' ? true : semi;
		var query = prepend.trim() + (semi ? ';' : '');
		return query;
	};
	return self;
};

exports.new = function () {
	return new QueryCreator();
};