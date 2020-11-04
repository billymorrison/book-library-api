const express = require('express');
const readerRouter = require('./routes/reader')
const bookRouter = require('./routes/book')

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).send('hello world');
})

app.use('/readers', readerRouter);
app.use('/books', bookRouter);
// app.post('/readers', readerControllers.create);
// app.get('/readers', readerControllers.list);
// app.get('/readers/:id', readerControllers.find);
// app.patch('/readers/:id', readerControllers.update);
// app.delete('/readers/:id', readerControllers.deleteReader);

module.exports = app;