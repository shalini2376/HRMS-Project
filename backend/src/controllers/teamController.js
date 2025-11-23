
const { Team, Employee, EmployeeTeam } = require('../../models');
const { logAction } = require('../utils/logHelper');

// GET /api/teams
// List all teams for this organisation
async function listTeams(req, res) {
  try {
    const orgId = req.user.orgId;

    const teams = await Team.findAll({
      where: { organisationId: orgId },
      include: [{ model: Employee, through: { attributes: [] } }]
    });

    return res.json(teams);
  } catch (err) {
    console.error('listTeams error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

// GET /api/teams/:id
async function getTeamById(req, res) {
  try {
    const orgId = req.user.orgId;
    const { id } = req.params;

    const team = await Team.findOne({
      where: { id, organisationId: orgId },
      include: [{ model: Employee, through: { attributes: [] } }]
    });

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    return res.json(team);
  } catch (err) {
    console.error('getTeamById error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

// POST /api/teams
// Body: { name, description }
async function createTeam(req, res) {
  try {
    const orgId = req.user.orgId;
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'name is required' });
    }

    const team = await Team.create({
      organisationId: orgId,
      name,
      description,
    });

    logAction(req, 'team_created', { teamId: team.id });
    return res.status(201).json(team);
  } catch (err) {
    console.error('createTeam error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

// PUT
// updateTeam  /api/teams/:id
async function updateTeam(req, res) {
  try {
    const orgId = req.user.orgId;
    const { id } = req.params;
    const { name, description } = req.body;

    const team = await Team.findOne({
      where: { id, organisationId: orgId },
    });

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    if (name !== undefined) team.name = name;
    if (description !== undefined) team.description = description;

    await team.save();

    logAction(req, 'team_updated', { teamId: team.id });
    return res.json(team);
  } catch (err) {
    console.error('updateTeam error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

// deleteTeam api/teams/:id
async function deleteTeam(req, res) {
  try {
    const orgId = req.user.orgId;
    const { id } = req.params;

    const team = await Team.findOne({
      where: { id, organisationId: orgId },
    });

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    await team.destroy();

    logAction(req, 'team_deleted', { teamId: id });
    return res.json({ message: 'Team deleted' });
  } catch (err) {
    console.error('deleteTeam error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

// POST /api/teams/:teamId/assign
// Body: { employeeId }
async function assignEmployeeToTeam (req, res) {
    try{
        const orgId = req.user.orgId;
        const {teamId} = req.params; 
        const {employeeId} = req.body

        if (!employeeId) {
            return res.status(400).json({message: 'employeeId is required'});
        }

        // 1) Check team belongs to this organisation
        const team  = await Team.findOne({
            where: {id: teamId, organisationId: orgId},
        });

        if (!team) {
            return res.status(404).json({message: 'Team not found'});
        }

        // 2) check employee belongs to this organisation
        const employee = await Employee.findOne({
            where: {id: employeeId, organisationId: orgId},
        });

        if(!employee){
            return res.status(404).json({message: 'Employee not found'});
        }

        // 3) check if already assigned
        const existing = await EmployeeTeam.findOne({
            where: {employeeId, teamId},
        });

        if(existing){
            return res.status(200).json({message: 'Employee is already in this team'});
        }

        // 4) Create link row
        const link = await EmployeeTeam.create({
            employeeId,
            teamId,
        });
        logAction(req, 'employee_assigned_to_team', {
            employeeId,
            teamId,
        });
        return res.status(201).json({
            message: 'Employee assigned to team',
            assignment: link,
        });
    }catch (err) {
        console.error('assignEmployeeToTeam', err)
        return res.status(500).json({message: 'Server error'});
    }
}

// DELETE /api/teams/:teamId/unassign
// Body: { employeeId }

async function unassignEmployeeFromTeam(req, res) {
    try {
        const orgId = req.user.orgId;
        const {teamId} = req.params;
        const {employeeId} = req.body;

        if(!employeeId){
            return res.status(400).json({message: 'employeeId is required'});
        }

        // 1) Check team belongs to org
        const team = await Team.findOne({
            where: {id: teamId, organisationId: orgId},
        });

        if (!team) {
            return res.status(404).json({message: 'Team not found'});
        }

        // 2) Check employee belongs to org
        const employee = await Employee.findOne({
        where: { id: employeeId, organisationId: orgId },
        });

        if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
        }

        // 3) Find the assignment row
        const existing = await EmployeeTeam.findOne({
        where: { employeeId, teamId },
        });

        if (!existing) {
        return res.status(404).json({ message: 'Employee is not in this team' });
        }
        await existing.destroy();

        logAction(req, 'employee_unassigned_from_team', {
            employeeId,
            teamId,
        });
        return res.json({ message: 'Employee removed from team' });
        } catch (err) {
            console.error('unassignEmployeeFromTeam error:', err);
            return res.status(500).json({ message: 'Server error' });
        }
    }

module.exports = {
  listTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
  assignEmployeeToTeam,
  unassignEmployeeFromTeam,
};
