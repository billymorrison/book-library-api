const express = require('express')

const router = express.Router();
const authorControllers = require('../controllers/authors')

router
    .route('/')
    .get(authorControllers.list)
    .post(authorControllers.create);

router
    .route('/:id')
    .get(authorControllers.find)
    .patch(authorControllers.update)
    .delete(authorControllers.delete);

module.exports = router;