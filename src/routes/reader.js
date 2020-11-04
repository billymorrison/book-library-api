const express = require('express')

const router = express.Router();
const readerControllers = require('../controllers/readers')

router
    .route('/')
    .get(readerControllers.list)
    .post(readerControllers.create);

router
    .route('/:id')
    .get(readerControllers.find)
    .patch(readerControllers.update)
    .delete(readerControllers.delete);

module.exports = router;