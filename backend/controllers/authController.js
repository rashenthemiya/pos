const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models');

exports.register = async (req, res, next) => {
  try {
    const { username, password, full_name, role, email, phone } = req.body;
    if (!username || !password || !role) {
      return res.status(400).json({ message: 'Username, password, and role are required.' });
    }
    // Only allow registration if user does not already exist
    const existing = await req.shopDb.models.User.findOne({ where: { username } });
    if (existing) {
      return res.status(409).json({ message: 'Username already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await req.shopDb.models.User.create({
      username,
      password: hashedPassword,
      full_name,
      role,
      email,
      phone
    });
    res.status(201).json({ message: 'User registered successfully', user: { user_id: user.user_id, username: user.username, role: user.role } });
  } catch (err) {
    next(err);
  }
};

// On first run, create a default manager user if no users exist
exports.ensureDefaultManager = async (shopDb) => {
  const userCount = await shopDb.models.User.count();
  if (userCount === 0) {
    const defaultManager = {
      username: 'admin',
      password: await bcrypt.hash('admin123', 10),
      full_name: 'Default Manager',
      role: 'manager',
      email: '',
      phone: ''
    };
    await shopDb.models.User.create(defaultManager);
    console.log('Default manager user created for shop DB');
  }
};
exports.login = async (req, res, next) => {
  try {
    const { username, password, shop_db } = req.body;
    if (!username || !password || !shop_db) {
      return res.status(400).json({ message: 'Username, password, and shop_db are required.' });
    }
    // Ensure default manager exists for this shop DB
    await exports.ensureDefaultManager(req.shopDb);
    const user = await req.shopDb.models.User.findOne({ where: { username } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ user_id: user.user_id, role: user.role, username: user.username, shop_db }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { user_id: user.user_id, username: user.username, role: user.role, shop_db } });
  } catch (err) {
    next(err);
  }
};
