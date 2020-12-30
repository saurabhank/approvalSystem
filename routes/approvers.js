const express = require('express');
const router = express.Router();
const anyone = require('../models/anyone');
const roundRobin = require('../models/roundRobin');
const sequence = require('../models/sequenceApprover');
const level = require('../models/approvalLevel');

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
        res.json({ success: true, msg: approvers });

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
        let newSequence = new sequence()
        sequenceApprovers = await newSequence.getApprovers(workFlowId)

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


router.post('/approve/', async (req, res, next) => {
    try {
        let levelId = req.body.levelId;
        let userId = req.body.userId;
        let status = req.body.status;
        let newLevel = new level(levelId)
        let levelData = await newLevel.getLevelData(levelId);
        if (levelData.approvalType == 'anyone') {
            let newAnyone = new anyone(userId, levelId, status)
            await newAnyone.approve();

        } else if (levelData.approvalType == 'roundRobin') {
            let newRoundRobin = new roundRobin()
        
        } else if (levelData.approvalType == 'sequence') {
            let newSequence = new sequence()
        
        } else {
            res.json({ success: false, msg: "INVALID DATA" })
            return;
        }

        res.json({
            success: true,
            msg: "APPROVAL STATUS UPDATED"
        });
    }
    catch (e) {
        __error("ERROR WHILE UPDATING STATUS ", e);
        res.json({
            success: false,
            msg: e
        });
    }
});



module.exports = router;