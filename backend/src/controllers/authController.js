const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {Organisation, User, Log} = require('../../models');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret'

// POST /api/auth/register
// Body: { orgName, adminName, email, password }
exports.register = async (req, res) => {
    try{
        const {orgName, adminName, email, password} = req.body;

        if(!orgName || !adminName || !email || !password) {
            return res.status(400).json({message: 'All fields are required'});
        }

        // Check if user already exists
        const existing = await User.findOne({where: {email}});
        if(existing){
            return res.status(400).json({message: 'User with this email already exists'});
        }

        // create Organisation
        const organisation = await Organisation.create({name: orgName});

        // Hash Password
        const passwordHash  = await bcrypt.hash(password, 10);

        // create admin User
        const user = await User.create({
            organisationId: organisation.id,
            name: adminName,
            email,
            passwordHash,
        });

        // Log the registration
        await Log.create({
            organisationId: organisation.id,
            userId: user.id,
            action: 'user_registered',
            meta: JSON.stringify({ userId: user.id, email: user.email }),
        });

        // generate JWT
        const token = jwt.sign(
            {userId: user.id, orgId: organisation.id},
            JWT_SECRET,
            {expiresIn: '8h'}
        );

        return res.status(201).json({
            message: 'Organisation and admin user created',
            token,
            user: {
            id: user.id,
            name: user.name,
            email: user.email,
            organisationId: organisation.id,
            }
        });
    }catch (err) {
        console.error('Register error', err)
        return res.status(500).json({ message: 'Server error' });
    }
}

// POST /api/auth/login
// Body: { email, password }
exports.login = async (req, res) => {
    try {
        const {email, password} = req.body;

        if(!email || !password) {
            return res.status(400).json({message: 'Email and password required'});
        }

        const user = await User.findOne({where: {email}});

        if(!user){
            return res.status(401).json({message: 'Invalid email or password'});
        }

        const match = await bcrypt.compare(password, user.passwordHash)
        if(!match){
            return res.status(401).json({message: 'Invalid email or password'});
        }

        const token = jwt.sign(
            {userId: user.id, orgId: user.organisationId },
            JWT_SECRET,
            {expiresIn: '8h'}
        );

        // Log the login
        await Log.create({
            organisationId: user.organisationId,
            userId: user.id,
            action: 'user_logged_in',
            meta: JSON.stringify({ userId: user.id, email: user.email }),
        });

        return res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                organisationId: user.organisationId,
            },
        });
    } catch (err) {
        console.error('Login error:', err)
        return res.status(500).json({message: 'Server error'});
    }
}