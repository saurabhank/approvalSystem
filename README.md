

# Approval System
An approval system written in node js and mysql as database

**AIM**
Problem Definition: ​ In any organization, onboarding a new vendor or making payments to a
vendor goes from a different approval process at different levels. We want you to solve this
business problem. Your solution should allow users to configure the workflow and save it into
Database. For each action taken by an individual user at all levels should be logged into the
Database. Finally, we will have a result of approval workflow as ​ Active ​ , ​ Terminated ​ or ​ Executed ​ .
The approval workflow has mainly four components: Users, Approval Actions, Type of
Approvals and Approval Levels.
Definition of final results:
Active: Workflow is active and somebody is required to approve at any level
Terminated: Workflow was terminated as one of the approvers has Rejected the approval
Executed: All users have approved
Technologies to be used: ​ Node.js, MongoDB and any other if you prefer
List of Users who can be the part of approval matrix
1. Elsa Ingram
2. Paul Marsh
3. D Joshi
4. Nick Holden
5. John
Approval Actions:
1. Approve​ : This action will be marked as approved and the workflow will be active so that
the next person in the approval workflow can take the approval actions.
2. Reject​ : This action will be marked as rejected and the workflow will be terminated.
3. Reject & Remove from workflow​ : This action will be marked as rejected but will be active
so that the next person in the approval workflow can take the approval actions.
Type of Approvals
1. Sequential: In this type of approval, ​ all users​ have to take the approval action in
sequential order​ as configured. E.g. If ​ Elsa Ingram ​ and ​ Nick Holden ​ have been added
as approvers for ​ Sequential​ , it is required to first get the action taken by Elsa Ingram and
then Nick Holden will have the option to take approval action.
2. Round-robin: In this type of approval, ​ all users​ have to take the approval action in ​ any
order​ as configured. E.g. If ​ Elsa Ingram ​ and ​ Nick Holden ​ have been added as
approvers for ​ Round-robin​ , it is required to get the action taken by Elsa Ingram and Nick
Holden.
3. Any one: In this type of approval, ​ any user​ can take the approval action in ​ any order​ as
configured. E.g. If ​ Elsa Ingram ​ and N
ick Holden ​ have been added as approvers for ​ Any
one​ , it is required to get the action taken by Elsa Ingram or Nick Holden.Approval Levels​ : We can add ​ n ​ number of levels having any type of approvals. Each level can
be executed accordingly. For example see below how levels and approvers are added and what type of action can be taken:

**Example 1** 


Level -1 (Sequential)
| Users | Approval Action | Workflow  Status |
| --- | --- | --- |
|Elsa  Ingram | Approved | Active|
|Nick  Holden | Approved | Active|

Level -2 (Round-robin)
|Users | Approval Action | Workflow Status|
| --- | --- | --- |
| Paul Marsh | Approved | Active |
| D Joshi |Approved | Active |
| John | Rejected | Terminated |

Level -3 (Any-one)
| Users | Approval Action | Workflow Status |
| --- | --- | --- |
| Nick Holden |  -- |  Terminated | 
| John | -- | Terminated | 

*Final Result: This workflow was terminatedExample 2*

**Example 2**

Level -1 (Sequential)
| Users | Approval Action | Workflow Status |
| --- | --- | --- |
| Elsa Ingram |  Approved Active | 
| Nick Holden | Reject & Remove from workflow |  Active | 

Level -2 (Any-one)

| Users | Approval Action | Workflow Status |
| --- | --- | --- |
| Nick Holden | Approved | Active
| John |  -- |  -- |

Level -3 (Round-robin)

| Users | Approval Action | Workflow Status |
| --- | --- | --- |
| Paul Marsh | Approved | Active | 
| D Joshi | Approved | Active | 
| John | Approved | Active | 

*Final Result: This workflow was executed successfully*



schema


users : { name , userId } 


approval types : enum { sequential, roundRobin, anyOne }


workFlow { workFlowId, totalLevels, currentLevel, status }


workflow levels { levelId, workFlowId, levelNo, approvalType }


sequentialApprovals { levelId , userId, sequence, status }


roundRobinApprovals  { levelId , userId, status }


anyOneApprovals {levelId , userId, status }

