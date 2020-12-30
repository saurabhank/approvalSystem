const approver = require('./approvers')

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
sequenceApprover.prototype.getApprovers = async function (workflowId) {
    let approversData = await dbUtils.getData('workFlows,workFlowLevels,sequentialApprovals', '*',
        'workFLows.workFlowId = ? and ' +
        'workFlows.workFlowId = workFlowLevels.workFlowId and ' +
        'sequentialApprovals.levelId = workFlowLevels.levelId '
        , workflowId)
    resolve(approversData)
}
