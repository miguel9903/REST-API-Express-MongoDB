const { Router } = require('express');
const { check } = require('express-validator');

const { validateFields } = require('../middlewares/validateFields');
const { validateRole, 
        existEmail, 
        existUserId,
        validateQueryParam } = require('../helpers/db-validators');

const router = Router();
const userController = require('../controllers/user');

router.get('/', userController.getUsers);

router.get('/:id', [
    check('id', 'Invalid id').isMongoId(),
    check('id').custom((user) => existUserId(user)),
    validateFields
], userController.getUser);

router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('password', 'The password must be at least 6 characters').isLength({ min: 6 }),
    check('email', 'Invalid email').isEmail(),
    check('email').custom((email) => existEmail(email)),
    check('role').custom((role) => validateRole(role)),
    validateFields
], userController.createUser);

router.put('/:id', [
    check('id', 'Invalid id').isMongoId(),
    check('id').custom((user) => existUserId(user)),
    check('role', 'Role is required').not().isEmpty(),
    check('role').custom((role) => validateRole(role)),
    validateFields
], userController.updateUser);

router.delete('/:id', [
    check('id', 'Invalid id').isMongoId(),
    check('id').custom((user) => existUserId(user)),
    validateFields
] , userController.deleteUser);

module.exports = router;