var mysql = require('mysql')
var plug = __database

var dbConnect = function (callback) {
  var connection = mysql.createConnection(plug)
  /**
     * Connecting to rdbs
     */
  connection.connect(function (err) {
    if (!err) {
      __debug('Database Connection Established') // emit error
      callback(null, connection)
    } else {
      __error('Error Connecting to DB', err)
      callback(err, null)
    }
  })

  // If you're also serving http, display a 503 error.
  connection.on('error', function (err) {
    __error('DB Error', err)
    if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect() // lost due to either server restart, or a
    } else if (err.code === 'ECONNRESET') { // connnection idle timeout (the wait_timeout
      handleDisconnect() // server variable configures this)
    } else {
      throw err
    }
  })
}

function handleDisconnect () {
  var connection = mysql.createConnection(plug)
  // the old one cannot be reused.

  connection.connect(function (err) { // The server is either down
    if (err) { // or restarting (takes a while sometimes).
      __error('Error when connecting to db:', err)
      setTimeout(handleDisconnect, 2000) // We introduce a delay before attempting to reconnect,
    } else {
      __info('Connection established') // emit error
      //
      // return callback(connection);
      __connect = connection
    }// to avoid a hot loop, and to allow our node script to
  }) // process asynchronous requests in the meantime.

  // If you're also serving http, display a 503 error.
  connection.on('error', function (err) {
    __error('DB error', err)
    if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect() // lost due to either server restart, or a
    } else if (err.code === 'ECONNRESET') { // connnection idle timeout (the wait_timeout
      handleDisconnect() // server variable configures this)
    } else {
      throw err
    }
  })
}

module.exports = dbConnect
