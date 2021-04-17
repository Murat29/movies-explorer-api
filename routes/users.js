const router = require('express').Router();
const { getUser, updateNameAndEmail } = require('../controllers/users');

router.get('/users/me', getUser);
router.patch('/users/me', updateNameAndEmail);

module.exports = router;
