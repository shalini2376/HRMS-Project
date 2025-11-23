const {Employee, Team} = require('../../models')
const { logAction } = require('../utils/logHelper');

// GET /api/employees
// List all employees for the logged-in user's organisation
async function listEmployees(req, res) {
    try {
        const orgId = req.user.orgId

        const employees = await Employee.findAll({
            where: {organisationId: orgId},
            include: [{
                    model: Team,
                    through: { attributes: [] }  // hide join table (EmployeeTeam)
                }]
        })
        return res.json(employees);
    } catch (err) {
        console.error('listEmployees error:', err)
        return res.status(500).json({message: 'Server error'});
    }
}

// GET /api/employees/:id
async function getEmployeeById(req, res) {
  try {
    const orgId = req.user.orgId;
    const { id } = req.params;

    const employee = await Employee.findOne({
      where: { id, organisationId: orgId },
      include: [{
                    model: Team,
                    through: { attributes: [] }  // hide join table (EmployeeTeam)
                }]
    });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    return res.json(employee);
  } catch (err) {
    console.error('getEmployeeById error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

// POST /api/employees
// Body: { firstName, lastName, email, phone }
async function createEmployee(req, res) {
  try {
    const orgId = req.user.orgId;
    const { firstName, lastName, email, phone } = req.body;

    if (!firstName || !lastName) {
      return res.status(400).json({ message: 'firstName and lastName are required' });
    }

    const employee = await Employee.create({
      organisationId: orgId,
      firstName,
      lastName,
      email,
      phone,
    });

    await logAction(req, 'employee_created', { 
        employeeId: employee.id, 
        firstName: employee.firstName,
        lastName: employee.lastName, 
    });    
    return res.status(201).json(employee);
  } catch (err) {
    console.error('createEmployee error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

// PUT /api/employees/:id
// Body: { firstName?, lastName?, email?, phone? }  (partial allowed)
async function updateEmployee(req, res) {
    try{
        const  orgId = req.user.orgId;
        const {id} = req.params;
        const {firstName, lastName, email, phone} = req.body;

        const employee = await Employee.findOne({
            where: {id, organisationId: orgId},
        });
        if (!employee) {
            return res.status(404).json({message: 'Employee not found'});
        }

        // Update only fields sent in body
        if (firstName !== undefined) employee.firstName = firstName;
        if (lastName  !== undefined) employee.lastName  = lastName ;
        if (email !== undefined) employee.email = email;
        if (phone !== undefined) employee.phone = phone;

        await employee.save();
        logAction(req, 'employee_updated', { 
            employeeId: employee.id,
            firstName: employee.firstName,
            lastName: employee.lastName, 
        });
        return res.json(employee);
    } catch (err) {
        console.error('updateEmployee error:', err);
        return res.status(500).json({message: 'Server error'});
    }
}

// Implement deleteEmployee
// DELETE /api/employees/:id
async function deleteEmployee(req, res) {
  try {
    const orgId = req.user.orgId ;
    const {id} = req.params;

    const employee = await Employee.findOne({
        where: {id, organisationId: orgId},
    });
     if(!employee) {
        return res.status(404).json({message: 'Employee not found'});
     }

     await employee.destroy();
     logAction(req, 'employee_deleted', { 
        employeeId: id,
    });
     return res.json({message: 'Employee deleted'});
  } catch(err) {
    console.error('deleteEmployee error:', err);
    return res.status(500).json({message: 'Server error'});
  }
}

module.exports = {
  listEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};