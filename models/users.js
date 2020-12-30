const dbUtils = require('../utils/dbUtils')

let users = function (userId, name) {
    this.userId = userId
    this.name = name
}

users.prototype.addUser = function () {
    return new Promise(async (resolve, reject)=> {
        try {
            insertObj = {
                userId: this.userId,
                name: this.name
            }
            await dbUtils.insertRecords('users', insertObj);
            resolve(insertObj);
        } catch (e) {
            reject(e)
        }   
    });
    
}

users.prototype.getUsers = function () {
    return new Promise(async (resolve, reject)=> {
        try {
            let allUsers = await dbUtils.getData('users','*','','' );
            resolve(allUsers);
        } catch (e) {
            reject(e)
        }   
    });
    
}
module.exports = users