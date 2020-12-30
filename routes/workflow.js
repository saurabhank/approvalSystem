const express = require('express');
const router = express.Router();
const workflow = require('../models/workflow');
const levels = require('../models/approvalLevel');


router.post('/add', async (req, res, next) => {
    try {
        let workFlowId = req.body.workFlowId;
        let totalLevels = req.body.totalLevels;

        let newWorkFlow = new workflow(workFlowId, totalLevels)
        await newWorkFlow.addWorkFlow();
        res.json({
            success: true,
            msg: "workflow added"
        });
    }
    catch (e) {
        __error("ERROR WHILE ADDING WORKFLOW", e);
        res.json({
            success: false,
            msg: "UNABLE TO CREATE WORKFLOW"
        });
    }
});

router.get('/get', async (req, res, next) => {
    try {
        let newWorkFlow = new workflow()
        let workFlows = await newWorkFlow.getWorkFlows();
        res.json({
            success: false,
            msg: workFlows
        })
    }
    catch (e) {
        __error("ERROR WHILE GETTING LEVELS", e);
        res.json({
            success: false,
            msg: "UNABLE TO GETTING WORKFLOW LEVELS"
        });
    }
});

router.post('/add/levels', async (req, res, next) => {
    try {
        let workFlowId = req.body.workFlowId;
        let newWorkFlow = new workflow(workFlowId);
        let allLevels = await newWorkFlow.getLevels();
        let currentCount = allLevels.length
        
        let levelNo = parseInt(currentCount) + 1;
        let approvalType = req.body.approvalType
        let levelId = levelNo +'_'+ workFlowId
        let newLevel = new levels(levelId, workFlowId, levelNo, approvalType)

        await newLevel.addLevel();
        res.json({
            success: true,
            msg: "LEVEL ADDED"
        });
    }
    catch (e) {
        __error("ERROR WHILE ADDING LEVELS", e);
        res.json({
            success: false,
            msg: "UNABLE TO CREATE WORKFLOW LEVEL"
        });
    }
});


router.post('/get/levels', async (req, res, next) => {
    try {
        let workFlowId = req.body.workFlowId;
        let newWorkFlow = new workflow(workFlowId);
        let allLevels = await newWorkFlow.getLevels();
        res.json({
            success: true,
            msg: allLevels
        });
    }
    catch (e) {
        __error("ERROR WHILE GETTING LEVELS", e);
        res.json({
            success: false,
            msg: "UNABLE TO GET WORKFLOW LEVEL"
        });
    }
});




module.exports = router;