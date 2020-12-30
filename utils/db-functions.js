var EventEmitter = require('events').EventEmitter
var util = require('util')
var dbfunction = function () {
  EventEmitter.call(this)
}
util.inherits(dbfunction, EventEmitter)
/**
 *
 * @param {string} table
 * @param {string} condition
 * @param {object} data : condition object
 * @returns {Boolean}
 */
dbfunction.prototype.showTables = function () {
  var self = this
  try {
    if (__connect) {
      __connect.query('SHOW TABLES', [], function (error, tables) {
        if (!error) {
          return self.emit('tables', tables)
        } else {
          return self.emit('error', error)
        }
      })
    } else {
      return self.emit('error', 'OBJECT_NOT_DEFINED')
    }
  } catch (error) {
    return self.emit('error', error)
  }
}
/**
*
* @param {string} table : table name
* @param {object} changes  : can be an array of rows to change
* each row is given by an object  key as column name ans value as value
* @param {string} condition
* @param {object} condition_data : can be an array or string
* @returns {boolean}
*/
dbfunction.prototype.updateRecords = function (table, changes, condition, condition_data) {
  var self = this
  var update_data = []
  var update = 'UPDATE ' + table + ' SET '
  // changes = sanitizeJSON(changes);
  for (var key in changes) {
    update += '`' + key + '`=?,'
    update_data.push(changes[key])
  }
  if (typeof (condition_data) === 'string') {
    update_data.push(condition_data)
  } else if (typeof (condition_data) === 'object') { // hoping for no errors
    update_data = update_data.concat(condition_data)
  }
  update = update.slice(0, -1) // for removing last comma separator
  if (condition !== '') {
    update += ' WHERE ' + condition
  }
  console.log(update);
  try {
    if (__connect) {
      __connect.query(update, update_data, function (error, rows) {
        if (!error) {
          if (rows.affectedRows == 0) {
            return self.emit('error', 'NO_ROW');
          }
          return self.emit('updated', null, rows)
        } else {
          return self.emit('error', error)
        }
      })
    } else {
      return self.emit('error', 'OBJECT_NOT_DEFINED')
    }
  } catch (error) {
    return self.emit('error', error)
  }
}
/**
 *
 * @param {string} table
 * @param {object} records
 * @returns {Boolean}
 */
dbfunction.prototype.insertRecords = function (table, records) { // for inserting data into table
  var self = this
  if (Array.isArray(records) === false) {
    records = [records]
  }
  var keys = Object.keys(records[0])
  var values = records.map(obj => keys.map(key => obj[key]))
  var sql = 'INSERT INTO ' + table + ' (' + keys.join(',') + ') VALUES ?'
  try {
    if (__connect) {
      __connect.query(sql,
        [values], function (error) {
          if (!error) {
            return self.emit('inserted', null, true)
          } else {
            __error('table : ' + table, error)
            return self.emit('error', error)
          }
        })
    } else {
      __error("INSERT ERROR", "OBJECT_NOT_DEFINED");
      return self.emit('error', 'OBJECT_NOT_DEFINED')
    }
  } catch (error) {
    __error('table : ' + table + 'try error', error)
    return self.emit('error', error)
  }
}
/**
 *
 * @param {string} table
 * @param {object} records
 * @returns {Boolean}
 */
dbfunction.prototype.insertDuplicateRecords = function (table, records) { // for inserting data into table
  var self = this
  if (Array.isArray(records) === false) {
    records = [records]
  }
  var keys = Object.keys(records[0])
  var values = records.map(obj => keys.map(key => obj[key]))
  var duplicates = keys.map(key => key + '=VALUES(' + key + ')')
  var sql = 'INSERT INTO ' + table + ' (' + keys.join(',') + ') VALUES ? ON DUPLICATE KEY UPDATE ' + duplicates
  try {
    if (__connect) {
      __connect.query(sql,
        [values], function (error) {
          if (!error) {
            return self.emit('inserted', null, true)
          } else {
            __error('table : ' + table, error)
            return self.emit('error', error)
          }
        })
    } else {
      return self.emit('error', 'OBJECT_NOT_DEFINED')
    }
  } catch (error) {
    __error('table : ' + table + 'try error', error)
    return self.emit('error', error)
  }
}
/**
 *
 * @param {string} table
 * @param {object} records
 * @returns {Boolean}
 */
dbfunction.prototype.replaceRecords = function (table, records) { // for inserting data into table
  var self = this
  if (Array.isArray(records) === false) {
    records = [records]
  }
  var keys = Object.keys(records[0])
  var values = records.map(obj => keys.map(key => obj[key]))
  var sql = 'REPLACE INTO ' + table + ' (' + keys.join(',') + ') VALUES ?'
  try {
    if (__connect) {
      __connect.query(sql,
        [values], function (error) {
          if (!error) {
            return self.emit('replaced', null, true)
          } else {
            __error('table : ' + table, error)
            return self.emit('error', error)
          }
        })
    } else {
      return self.emit('error', 'OBJECT_NOT_DEFINED')
    }
  } catch (error) {
    __error('table : ' + table + 'try error', error)
    return self.emit('error', error)
  }
}
/**
 *
 * @param {string} table
 * @param {string} search
 * @param {string} condition : conditon used
 * @param {object} condition_data :
 * @returns {Boolean}
 */
dbfunction.prototype.select = function (table,
  search, condition, condition_data) { // get all required rows
  var self = this
  // search = sanitize(search);
  var sql = 'SELECT ' + search + ' FROM ' + table
  if (condition) {
    sql += ' WHERE ' + condition + ' '
    if (Array.isArray(condition_data) === false) {
      if (!condition_data) {
        return self.emit('error', 'NO_CONDITION', null)
      } else {
        // If Just Non-Array Condition Data
        condition_data = [condition_data]
      }
    } else {
      if (condition_data.length === 0) {
        return self.emit('error', 'NO_CONDITION', null)
      }
      // If "Where In" Like Condition
      if (condition.search(/in[\s\t]*\?.*and[\s\t].*\?.*/i) > -1) {
        condition_data = condition_data
      } else if (condition.search(/in[\s\t]*\?/i) > -1) { condition_data = [[condition_data]] }
    }
  }
  try {
    if (__connect) {
      //console.log('select ',condition_data);
      //console.log('select sql ', sql)
      __connect.query(sql, condition_data, function (error, rows) {
        if (!error && rows.length > 0) {
          return self.emit('selected', null, rows)
        } else if (error) {
          __error('dbfunctions:selected', error)
          return self.emit('error', error)
        } else if (rows.length === 0) {
          return self.emit('error', 'NO_ROW', null)
        }
      })
    } else {
      return self.emit('error', 'OBJECT_NOT_DEFINED')
    }
  } catch (error) {
    return self.emit('error', error)
  }
}
/**
 *
 * @param {string} table
 * @param {string} condition
 * @param {object} data : condition object
 * @returns {Boolean}
 */
dbfunction.prototype.deleteRecords = function (table, condition, condition_data) {
  var self = this
  var sql = 'DELETE FROM ' + table + ' WHERE ' + condition
  if (Array.isArray(condition_data) === false) {
    if (!condition_data) {
      return self.emit('error', 'NO_CONDITION', null)
    } else {
      // If Just Non-Array Condition Data
      condition_data = [condition_data]
    }
  } else {
    if (condition_data.length === 0) {
      return self.emit('error', 'NO_CONDITION', null)
    }
    // If "Where In" Like Condition
    if (condition.search(/in[\s\t]*\?/i) > -1) { condition_data = [[condition_data]] }
  }
  try {
    if (__connect) {
      __connect.query(sql, condition_data, function (error) {
        if (!error) {
          return self.emit('deleted', null, true)
        } else {
          return self.emit('error', error)
        }
      })
    } else {
      return self.emit('error', 'OBJECT_NOT_DEFINED')
    }
  } catch (error) {
    return self.emit('error', error)
  }
}

module.exports = dbfunction