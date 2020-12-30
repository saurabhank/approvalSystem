const express = require('express');
const router = express.Router();
const anyone = require('../models/anyone');
const roundRobin = require('../models/roundRobin');
const sequence = require('../models/sequenceApprover');
const level = require('../models/approvalLevel');
const workflow = require('../models/workflow');

router.post('/add', async (req, res, next) => {
    try {
        let userIds = req.body.userIds
        let levelId = req.body.levelId
        let newLevel = new level(levelId)
        let levelData = await newLevel.getLevelData();
        let status = 0
        let userIdSeqMap = req.body.userIdSeqMap
        let approvers = []
        let approvalType = levelData.approvalType;
        if (approvalType == 'anyone') {
            approvers = userIds.map(el => {
                return new anyone(el, levelId, status)
            });
            let newAnyone = new anyone()
            await newAnyone.addApprover(approvers);
        }
        else if (approvalType == 'roundRobin') {
            approvers = userIds.map(el => {
                return new roundRobin(el, levelId, status)
            });
            let newRoundRobin = new roundRobin()
            await newRoundRobin.addApprover(approvers);
        } else if (approvalType == 'sequence') {
            approvers = userIdSeqMap.map(el => {
                return new sequence(el.userId, levelId, status, el.sequence)

            });
            let newSequence = new sequence()
            await newSequence.addApprover(approvers);
        } else {
            res.json({ success: false, msg: "INVALID DATA" });
            return
        }
        res.json({ success: true, msg: approvers});

    }
    catch (e) {
        __error("ERROR WHILE ADDING APPROVER", e);
        res.json({
            success: false,
            msg: "UNABLE TO ADD APPROVER"
        });
    }
});

router.post('/get/', async (req, res, next) => {
    try {
        let workFlowId = req.body.workFlowId;
        let newRoundRobin = new roundRobin()
        let roundRobinApprovers = await newRoundRobin.getApprovers(workFlowId)
        let newAnyone = new anyone()
        let anyoneApprovers = await newAnyone.getApprovers(workFlowId)
        let sequence = new sequence()
        sequenceApprovers = sequence.getApprovers(workFlowId)

        resObj = {
            "anyone": anyoneApprovers,
            "roundRobin": roundRobinApprovers,
            "sequence": sequenceApprovers
        }
        res.json({
            success: true,
            msg: resObj
        });
    }
    catch (e) {
        __error("ERROR WHILE GETTING APPROVERS", e);
        res.json({
            success: false,
            msg: "UNABLE TO GET WORKFLOW APPROVERS"
        });
    }
});



module.exports = router;