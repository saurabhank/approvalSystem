const dbfunction = require('./db-functions');

module.exports.getData = (table, search, condition, conditionData) => {
    return new Promise((resolve, reject) => {
        try {
            let Dbfunction = new dbfunction();
            Dbfunction.select(table, search, condition, conditionData);
            Dbfunction.on('selected', async (err, rows) => {
                if (!err) {
                    resolve(rows);
                }
                else {
                    reject(err);
                }
            });
            Dbfunction.on('error', (err, value) => {
                if (err == 'NO_ROW') {
                    resolve([]);
                }
                reject(err);
            });
        }
        catch (e) {
            // if (e == 'NO_ROW') {
            //     resolve([]);
            // }
            reject(e);
        }
    });
}
module.exports.updateData = (table, changes, condition, conditionData) => {
    return new Promise((resolve, reject) => {
        try {
            let Dbfunction = new dbfunction();
            Dbfunction.updateRecords(table, changes, condition, conditionData);
            Dbfunction.on('updated', async (err, rows) => {
                if (!err) {
                    resolve(rows);
                }
            });
            Dbfunction.on('error', (err, value) => {
                if (err == 'NO_ROW') {
                    resolve([]);
                }
                else {
                    reject(err);
                }
            });
        }
        catch (e) {
            reject(e);
        }
    });
}
exports.insertRecords = (table, records) => {
    return new Promise((resolve, reject) => {
        try {
            let Dbfunction = new dbfunction();
            Dbfunction.insertRecords(table, records);
            Dbfunction.on('inserted', async (err, value) => {
                if (!err) {
                    resolve(value);
                }
                else {
                    reject(err);
                }
            });
            Dbfunction.on('error', (err, value) => {
                reject(err);
            });
        }
        catch (e) {
            reject(e);
        }
    });
}
exports.insertDuplicateRecords = (table, records) => {
    return new Promise((resolve, reject) => {
        try {
            let Dbfunction = new dbfunction();
            Dbfunction.insertDuplicateRecords(table, records);
            Dbfunction.on('inserted', async (err, value) => {
                if (!err) {
                    resolve(value);
                }
                else {
                    reject(err);
                }
            });
            Dbfunction.on('error', (err, value) => {
                reject(err);
            });
        }
        catch (e) {
            reject(e);
        }
    });
}
