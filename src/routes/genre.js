const express = require('express')

const router = express.Router();
const genreControllers = require('../controllers/genres')

router
    .route('/')
    .get(genreControllers.list)
    .post(genreControllers.create);

router
    .route('/:id')
    .get(genreControllers.find)
    .patch(genreControllers.update)
    .delete(genreControllers.delete);

module.exports = router;