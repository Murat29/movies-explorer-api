const router = require('express').Router();
const {
  getUsers,
  getUser,
  updateNameAndAboutUser,
  updateAvatarUsers,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/me', getUser);
router.patch('/users/me', updateNameAndAboutUser);
router.patch('/users/me/avatar', updateAvatarUsers);

module.exports = router;
