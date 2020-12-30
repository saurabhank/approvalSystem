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
            insertArr = approvers.map(el => {
                return {
                    levelId: el.levelId,
                    userId: el.userId,
                    status: el.status,
                    id: el.levelId + '_' + el.userId
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

anyone.prototype.approve = function () {
    return new Promise(async (resolve, reject) => {
        try {
            let newApprovalLevel = new approvalLevelObj(this.levelId)
            let approvalLevelData = await newApprovalLevel.getLevelData();
            if (approvalLevelData.levelNo == approvalLevelData.currentLevel && approvalLevelData.status != 2) {
                let allApprovers = await this.getApprovers(approvalLevelData.workFlowId)
                allApprovers = allApprovers.map(el => {
                    return el.userId
                });
                if (allApprovers.indexOf(this.userId) > -1) {
                    await dbUtils.updateData('anyoneApprovals', { status: this.status }, 'anyoneApprovals.userId = ?',
                        this.userId);
                    let newWorkflow = new workflow(approvalLevelData.workFlowId);
                    await newWorkflow.updateCurrentLevel(approvalLevelData.currentLevel+1)
                    if (this.status == 2) {
                        await newWorkflow.updateStatus(2)
                    }
                    resolve("STATUS_UPDATED");
                } else {
                    reject("UNAUTHORISED_USER");
                }
            } else {
                if (approvalLevelData.status == 2) {
                    resolve("WORKFLOW ALREADY TERMINATED")
                } else {
                    reject("INVALID_REQUEST");
                }
            }
        } catch (e) {
            reject(e);
        }

    });

}

anyone.prototype.getApprovers = function (workflowId) {
    return new Promise(async (resolve, reject) => {
        try {
            let approversData = await dbUtils.getData('workFlows,workFlowLevels,anyoneApprovals',
                'anyoneApprovals.*',
                'workFlows.workFlowId = ? and ' +
                'workFlows.workFlowId = workFlowLevels.workFlowId and ' +
                'anyoneApprovals.levelId = workFlowLevels.levelId '
                , workflowId)
            resolve(approversData)
        }
        catch (e) { reject(e) }
    })

}


module.exports = anyone;