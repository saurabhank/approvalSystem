const approver = require('./approvers')
const dbUtils = require('../utils/dbUtils');

let roundRobin = function (user, levelId, status) {
    approver.call(this, user, levelId, status)
}

roundRobin.prototype.addApprover = function (approvers) {
    return new Promise(async (resolve, reject) => {
        try {
            insertArr = approvers.map(el => {
                return {
                    levelId: el.levelId,
                    userId: el.userId,
                    status: el.status,
                    id: el.userId + '_' + el.levelId
                }
            })
            await dbUtils.insertRecords('roundRobinApprovals', insertArr);
            resolve(insertArr);
        } catch (e) {
            reject(e)
        }
    });
}

roundRobin.prototype.approve = async function (status) {
    let newApprovalLevel = new approvalLevelObj(this.levelId)
    let approvalLevelData = await newApprovalLevel.getLevelData();
    if (approvalLevelData.levelNo == (approvalLevelData.currentLevel + 1) && approvalLevelData.status != 2) {
        let allApprovers = await this.getApprovers()
        allUsers = allApprovers.map(el => { return el.userId });
        if (allUsers.indexOf(user.userId) > -1) {
            await dbUtils.updateData('roundRobinApprovals', { status: status }, 'roundRobinApprovals.userId = ?',
                user.userId);
            let newWorkflow = new workflow(approvalLevelData.workflowId);
            if (status == 2) {
                await newWorkflow.updateStatus(2)
            } else {
                this.checkAndUpdateLevel(newWorkflow);
            }
        } else {
            //unauthorised user
            console.log("unauthorised user");
        }
    } else {
        //invalid request
        console.log("invalid requests  ");
    }

}



roundRobin.prototype.checkAndUpdateLevel = async function (workflow) {
    let approversData = await dbUtils.getData('roundRobinApprovals', '*', 'roundRobinApprovals.levelId = ?',
        this.levelId)
    let flag = 1
    approversData.map(el => {
        if (el.status == 0) {
            flag = 0
        }
    });
    if (flag == 0) {
        workflow.updateStatus()
    }
}

roundRobin.prototype.getApprovers = function (workFlowId) {
    return new Promise(async (resolve, reject) => {
        try {
            let approversData = await dbUtils.getData('workFlows,workFlowLevels,roundRobinApprovals',
                'roundRobinApprovals.*',
                'workFlows.workFlowId = ? and ' +
                'workFlows.workFlowId = workFlowLevels.workFlowId and ' +
                'roundRobinApprovals.levelId = workFlowLevels.levelId '
                , workFlowId)
            resolve(approversData)
        } catch (e) {
            reject(e);
        }
    })

}


module.exports = roundRobin;