const dbUtils = require('../utils/dbUtils')

let workflow = function (workFlowId, totalLevels) {
    this.workFlowId = workFlowId;
    this.totalLevels = totalLevels;
    this.currentLevel = 1;
    this.status = 0
}


workflow.prototype.addWorkFlow = function () {
    return new Promise(async (resolve, reject) => {
        try {
            insertObj = {
                workFlowId: this.workFlowId,
                totalLevels: this.totalLevels,
                currentLevel: 1,
                status: 0
            }
            await dbUtils.insertRecords('workFlows', insertObj);
            resolve(insertObj);
        } catch (e) {
            reject(e)
        }
    });
}


workflow.prototype.getWorkFlows = function () {
    return new Promise(async (resolve, reject) => {
        try {
            let workFlowData = await dbUtils.getData('workFlows', '*', '', '');
            resolve(workFlowData);
        } catch (e) {
            reject(e)
        }
    });
}

workflow.prototype.getLevels = function () {
    return new Promise(async (resolve, reject) => {
        try {
            let workFlowData = await dbUtils.getData('workFlowLevels', '*', 'workFlowLevels.workFlowId = ?',
                this.workFlowId);
            resolve(workFlowData);
        } catch (e) {
            reject(e)
        }
    });
}

workflow.prototype.updateCurrentLevel = function (level) {
    return new Promise(async (resolve, reject) => {
        try {
            let workFlowData = await dbUtils.updateData('workFlows', { currentLevel:level  },
                'workFlows.workFlowId = ?', this.workFlowId);
            resolve(workFlowData);
        } catch (e) {
            reject(e)
        }
    });
}

workflow.prototype.updateStatus = function (status) {
    return new Promise(async (resolve, reject) => {
        try {
            let workFlowData = await dbUtils.updateData('workFlows', { status: status },
                'workFlows.workFlowId = ? ', this.workFlowId);
            resolve(workFlowData);
        } catch (e) {
            reject(e)
        }
    });
}


module.exports = workflow