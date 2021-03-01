const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost:5432/project_3_remember_me', {
  dialect: 'postgres'
});

// Create models here
const User = sequelize.define('user', {
  userEmail: { type: Sequelize.STRING, unique: true },
  passwordDigest: Sequelize.STRING
})

const Contact = sequelize.define('contact', {
  name: Sequelize.TEXT,
  contactInfo: Sequelize.TEXT,
  whereYouMet: Sequelize.TEXT,
  importance: Sequelize.INTEGER,
  conversationDetails: Sequelize.TEXT,
  linkedInFriends: Sequelize.BOOLEAN
})

User.hasMany(Contact);
Contact.belongsTo(User);


module.exports = {
  // Export models
  User: User,
  Contact: Contact,
  sequelize: sequelize
};
