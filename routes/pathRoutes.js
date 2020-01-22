const express = require('express');
const router = express.Router();

const {checkToken, authorize} = require('../middleware/auth');
const pathController = require('../controllers/path');


router.get('/',checkToken, authorize('user', 'admin'), pathController.getAllPaths);
router.post('/create',checkToken, pathController.createPath);
router.get('/:id',checkToken, pathController.getPath);
router.put('/:id', checkToken, pathController.updatePath);
router.delete('/:id', checkToken, authorize('user'), pathController.deletePath);
router.get('/search/:name', checkToken, pathController.searchForPath);

module.exports = router;
