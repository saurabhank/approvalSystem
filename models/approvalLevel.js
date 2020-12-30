const dbUtils = require('../utils/dbUtils')

let approvalLevel = function (levelId, workFlowId, levelNo, approvalType) {
    this.levelId = levelId
    this.workFlowId = workFlowId
    this.levelNo = levelNo
    this.approvalType = approvalType
}

approvalLevel.prototype.addLevel = function () {
    return new Promise(async (resolve, reject) => {
        try {
            insertObj = {
                levelId: this.levelId,
                workFlowId: this.workFlowId,
                levelNo: this.levelNo,
                approvalType: this.approvalType
            }
            console.log(insertObj)
            await dbUtils.insertRecords('workFlowLevels', insertObj);
            resolve(insertObj);
        } catch (e) {
            reject(e)
        }
    });
}

approvalLevel.prototype.getLevelData = function () {
    return new Promise(async (resolve, reject) => {
        try {
            let levelData = await dbUtils.getData('workFlowLevels, workFlows',
                'workFlowLevels.*, workFlows.totalLevels, workFlows.currentLevel, workFlows.status',
                'workFlowLevels.levelId = ? and '+
                'workFlowLevels.workFlowId = workFlows.workFlowId', this.levelId);
            resolve(levelData[0]);
        } catch (e) {
            reject(e)
        }
    });
}
approvalLevel.prototype.getLevelRow = function () {
    return new Promise(async (resolve, reject) => {
        try {
            let levelData = await dbUtils.getData('workflowLevels',
                'workflowLevels.*, workflow.totalLevels, workflow.currentLevel, workflow.status',
                'workflowLevels.levelId = ? and '+
                'workflowLevels.workflowId = workflow.id', this.levelId);
            resolve(levelData[0]);
        } catch (e) {
            reject(e)
        }
    });
}


module.exports = approvalLevel