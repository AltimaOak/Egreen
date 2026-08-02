const express = require('express');
const { list, getById } = require('../controllers/brandController');

const router = express.Router();

router.get('/', list);
router.get('/:id', getById);

module.exports = router;
