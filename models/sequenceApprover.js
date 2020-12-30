const approver = require('./approvers');
const dbUtils = require('../utils/dbUtils');
let sequenceApprover = function (userId, levelId, status, sequence) {
    approver.call(this, userId, levelId, status)
    this.sequence = sequence
}

sequenceApprover.prototype.addApprover = function (sequenceApprovers) {
    return new Promise(async (resolve, reject) => {
        try {
            insertArr = sequenceApprovers.map(el => {
                return {
                    levelId: el.levelId,
                    userId: el.userId,
                    status: el.status,
                    sequence: el.sequence
                }
            });
            await dbUtils.insertRecords('sequentialApprovals', insertArr);
            resolve(insertArr);
        } catch (e) {
            reject(e)
        }
    });
}
sequenceApprover.prototype.getApprovers = function (workflowId) {
    return new Promise(async (resolve, reject) => {
        try {
            let approversData = await dbUtils.getData('workFlows,workFlowLevels,sequentialApprovals',
                'sequentialApprovals.*',
                'workFlows.workFlowId = ? and ' +
                'workFlows.workFlowId = workFlowLevels.workFlowId and ' +
                'sequentialApprovals.levelId = workFlowLevels.levelId '
                , workflowId)
            resolve(approversData)
        }
        catch (e) {
            reject(e)
        }
    })

}

module.exports = sequenceApprover
