const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  adminId: String,
  adminPassword: String

},
{
    collection: 'adminCollection' // Custom collection name
});

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin