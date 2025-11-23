const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');

const {
  listEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} = require('../controllers/employeeController');

// Protect all routes below
router.use(authMiddleware);

// GET /api/employees
router.get('/', listEmployees)

// GET /api/employees/:id
router.get('/:id', getEmployeeById)

// POST /api/employees
router.post('/', createEmployee)

// PUT /api/employee/:id
router.put('/:id', updateEmployee)

// DELETE /api/employees/:id
router.delete('/:id', deleteEmployee)

module.exports = router;
