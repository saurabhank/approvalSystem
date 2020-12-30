const approver = require('./approvers');
const workflow = require('./workflow');
const approvalLevelObj = require('./approvalLevel');
const dbUtils = require('../utils/dbUtils')

let anyone = function (userId, levelId, status) {
    approver.call(this, userId, levelId, status)
}

anyone.prototype.addApprover = function (approvers) {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(approvers)
            insertArr = approvers.map(el => {
                return {
                    levelId: el.levelId,
                    userId: el.userId,
                    status: el.status,
                    id: el.levelId+'_' + el.userId
                }
            });
            console.log(insertArr)
            await dbUtils.insertRecords('anyoneApprovals', insertArr);
            resolve(insertArr);
        } catch (e) {
            reject(e)
        }
    });
}

anyone.prototype.approve = async function (status) {
    let newApprovalLevel = new approvalLevelObj(this.levelId)
    let approvalLevelData = await newApprovalLevel.getLevelData();
    if (approvalLevelData.levelNo == (approvalLevelData.currentLevel + 1) && approvalLevelData.status != 2) {
        let allApprovers = await this.getApprovers()
        if (allApprovers.indexOf(user.userId) > -1) {
            await dbUtils.updateData('anyoneApprovals', { status: status }, 'anyoneApprovals.userId = ?',
                user.userId);
            let newWorkflow = new workflow(approvalLevelData.workflowId);
            await newWorkflow.updateCurrentLevel()
            if (status == 2) {
                await newWorkflow.updateStatus(2)
            }
        } else {
            // unauthorised user 
        }
    } else {
        //invalid request
    }

}

anyone.prototype.getApprovers = async function (workflowId) {
    let approversData = await dbUtils.getData('workFlows,workFlowLevels,anyoneApprovals', '*',
        'workFLows.workFlowId = ? and ' +
        'workFlows.workFlowId = workFlowLevels.workFlowId and ' +
        'anyoneApprovals.levelId = workFlowLevels.levelId '
        , workflowId)
    resolve(approversData)
}


module.exports = anyone;