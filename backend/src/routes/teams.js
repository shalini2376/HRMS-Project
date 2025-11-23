const express = require('express');
const router = express.Router();
const {authMiddleware} = require('../middlewares/authMiddleware')

const {
  listTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
  assignEmployeeToTeam,
  unassignEmployeeFromTeam,
} = require('../controllers/teamController');

// All team routes are protected
router.use(authMiddleware);

// GET /api/teams
router.get('/', listTeams);

// GET /api/teams/:id
router.get('/:id', getTeamById);

// POST /api/teams
router.post('/', createTeam);

// PUT /api/teams/:id
router.put('/:id', updateTeam);

// DELETE /api/teams/:id
router.delete('/:id', deleteTeam);

// Assignment
// POST /api/teams/:teamId/assign
router.post('/:teamId/assign', assignEmployeeToTeam);

// unassign
// DELETE /api/teams/:teamId/unassign
router.delete('/:teamId/unassign', unassignEmployeeFromTeam);

module.exports = router;