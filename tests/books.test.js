/* eslint-disable no-console */
const { expect } = require('chai');
const request = require('supertest');
const { Book } = require('../src/models');
const app = require('../src/app');

describe('/books', () => {
  before(async () => Book.sequelize.sync());

  describe('with no records in the database', () => {
    describe('POST /books', () => {
      it('creates a new book in the database', async () => {
        const response = await request(app).post('/books').send({
          title: 'The Wind In The Willows',
          author: 'Beatrix Potter',
          genre: 'Family',
          ISBN: 'Big-10912'
        });
        const newBookRecord = await Book.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(201);
        expect(response.body.title).to.equal('The Wind In The Willows');
        expect(newBookRecord.title).to.equal('The Wind In The Willows');
        expect(newBookRecord.author).to.equal('Beatrix Potter');
        expect(newBookRecord.genre).to.equal('Family');
        expect(newBookRecord.ISBN).to.equal('Big-10912');
      });
    });
    describe('throws an error if data is missing', () => {

      it('throws an error if title is missing', async () => {
        const response = await request(app).post('/books').send({
          author: 'bob skin',
          genre: 'pleasant'
        });

        expect(response.status).to.equal(400)
        expect(response.body.error).to.equal('Submissions must contain title and author');
      })
      it('throws an error if author is missing', async () => {
        const response = await request(app).post('/books').send({
          title: 'The life of Bob Skins',
          ISBN: 'fjfgkadlld'
        });

        expect(response.status).to.equal(400)
        expect(response.body.error).to.equal('Submissions must contain title and author');
      })
    })
  });

  describe('with records in the database', () => {
    let books;

    beforeEach(async () => {
      await Book.destroy({ where: {} });

      books = await Promise.all([
        Book.create({
          title: 'The Wind In The Willows',
          author: 'Beatrix Potter',
          genre: 'Family',
          ISBN: 'Big-10912'
        }),
        Book.create({ 
          title: 'Harry Potter',
          author: 'JK Rowling',
          genre: 'Adventure',
          ISBN: 'Big-18763'
        }),
        Book.create({ 
          title: 'A Brief History of Time',
          author: 'Stephen Hawking',
          genre: 'Science',
          ISBN: 'Big-73834'
        }),
      ]);
    });

    describe('GET /books', () => {
      it('gets all books records', async () => {
        const response = await request(app).get('/books');

        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(3);

        response.body.forEach((book) => {
          const expected = books.find((a) => a.id === book.id);

          expect(book.title).to.equal(expected.title);
          expect(book.author).to.equal(expected.author);
          expect(book.genre).to.equal(expected.genre);
          expect(book.ISBN).to.equal(expected.ISBN);
        });
      });
    });

    describe('GET /books/:id', () => {
      it('gets books record by id', async () => {
        const book = books[0];
        const response = await request(app).get(`/books/${book.id}`);

        expect(response.status).to.equal(200);
        expect(response.body.title).to.equal(book.title);
        expect(response.body.genre).to.equal(book.genre);
      });

      it('returns a 404 if the book does not exist', async () => {
        const response = await request(app).get('/books/12345');

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The book could not be found.');
      });
    });

    describe('PATCH /books/:id', () => {
      it('updates books genre by id', async () => {
        const book = books[0];
        const response = await request(app)
          .patch(`/books/${book.id}`)
          .send({ genre: 'Horror' });
        const updatedBookRecord = await Book.findByPk(book.id, {
          raw: true,
        });

        expect(response.status).to.equal(200);
        expect(updatedBookRecord.genre).to.equal('Horror');
      });

      it('returns a 404 if the book does not exist', async () => {
        const response = await request(app)
          .patch('/books/12345')
          .send({ genre: 'Fashion' });

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The book could not be found.');
      });
    });

    describe('DELETE /books/:id', () => {
      it('deletes book record by id', async () => {
        const book = books[0];
        const response = await request(app).delete(`/books/${book.id}`);
        const deletedBook = await Book.findByPk(book.id, { raw: true });
        

        expect(response.status).to.equal(204);
        expect(deletedBook).to.equal(null);
      });

      it('returns a 404 if the book does not exist', async () => {
        const response = await request(app).delete('/books/12345');
        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The book could not be found.');
      });
    });
  });
});