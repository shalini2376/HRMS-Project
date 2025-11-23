'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Create Organisation
    const org = await queryInterface.bulkInsert(
      'Organisations',
      [
        {
          name: 'Evallo TechWorks',
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ],
      { returning: true }
    );

    // For SQLite returning: true may not work, so fetch orgId manually
    const [orgRow] = await queryInterface.sequelize.query(
      `SELECT id FROM Organisations ORDER BY id DESC LIMIT 1`
    );
    const orgId = orgRow[0].id;

    // 2. Create Admin User
    await queryInterface.bulkInsert('Users', [
      {
        organisationId: orgId,
        name: 'Admin User',
        email: 'admin@example.com',
        passwordHash: '$2b$10$2yRyKQgiO75oPVb58oe9MO7ROdrLCVwjPJ/P2WxuTlVdKSKdXARW6', 
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // 3. Create Teams
    await queryInterface.bulkInsert('Teams', [
      {
        organisationId: orgId,
        name: 'Engineering',
        description: 'Handles product development',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        organisationId: orgId,
        name: 'Testing',
        description: 'Handles QA & testing',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // 4. Create Employees
    await queryInterface.bulkInsert('Employees', [
      {
        organisationId: orgId,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '1234567890',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        organisationId: orgId,
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        phone: '9876543210',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // 5. Optionally log an action
    await queryInterface.bulkInsert('Logs', [
      {
        organisationId: orgId,
        userId: 1,
        action: 'seed_data_inserted',
        meta: JSON.stringify({ note: 'Initial seed data added' }),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Logs', null, {});
    await queryInterface.bulkDelete('Employees', null, {});
    await queryInterface.bulkDelete('Teams', null, {});
    await queryInterface.bulkDelete('Users', null, {});
    await queryInterface.bulkDelete('Organisations', null, {});
  }
};
