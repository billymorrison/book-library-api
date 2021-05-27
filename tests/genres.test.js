/* eslint-disable no-console */
const { expect } = require('chai');
const request = require('supertest');
const { Genre } = require('../src/models');
const app = require('../src/app');

describe('/genres', () => {
  before(async () => Genre.sequelize.sync());

  describe('with no records in the database', () => {
    beforeEach(async () => {
      await Genre.destroy({ where: {} });
    });
    describe('POST /genres', () => {
      it('creates a new genre in the database', async () => {
        const response = await request(app).post('/genres').send({
          name: 'Science Fiction'
        });
        const newGenreRecord = await Genre.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(201);
        expect(response.body.name).to.equal('Science Fiction');
        expect(newGenreRecord.name).to.equal('Science Fiction');
      });
      describe('throws an error if data is missing', () => {

        it('throws an error if name is missing', async () => {
          const response = await request(app).post('/genres').send();

          expect(response.status).to.equal(400)
          expect(response.body.error).to.equal('Submissions must contain a name');
        })
      })
      describe('throws an error if data is incorrect', () => {

        it('throws an error if name is a duplicate', async () => {
          const response = await request(app).post('/genres').send({
            name: 'Science Fiction',
          });
          const response2 = await request(app).post('/genres').send({
            name: 'Science Fiction',
          });

          expect(response2.status).to.equal(400)
          expect(response2.body.error).to.equal('genres do not allow duplicates');
        })
      })
    });
  });

  describe('with records in the database', () => {
    let genres;

    beforeEach(async () => {
      await Genre.destroy({ where: {} });

      genres = await Promise.all([
        Genre.create({
          name: 'Science Fiction',
        }),
        Genre.create({ 
          name: 'Fantasy', 
        }),
        Genre.create({ 
          name: 'Adventure', 
        })
      ]);
    });

    describe('GET /genres', () => {
      it('gets all genre records', async () => {
        const response = await request(app).get('/genres');

        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(3);

        response.body.forEach((genre) => {
          const expected = genres.find((a) => a.id === genre.id);

          expect(genre.name).to.equal(expected.name);
        });
      });
    });

    describe('GET /genres/:id', () => {
      it('gets genres record by id', async () => {
        const genre = genres[0];
        const response = await request(app).get(`/genres/${genre.id}`);

        expect(response.status).to.equal(200);
        expect(response.body.name).to.equal(genre.name);
      });

      it('returns a 404 if the genre does not exist', async () => {
        const response = await request(app).get('/genres/12345');

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The genre could not be found.');
      });
    });

    describe('PATCH /genres/:id', () => {
      it('updates genres name by id', async () => {
        const genre = genres[0];
        const response = await request(app)
          .patch(`/genres/${genre.id}`)
          .send({ name: 'New Genre' });
        const updatedGenreRecord = await Genre.findByPk(genre.id, {
          raw: true,
        });

        expect(response.status).to.equal(200);
        expect(updatedGenreRecord.name).to.equal('New Genre');
      });

      it('returns a 404 if the genre does not exist', async () => {
        const response = await request(app)
          .patch('/genres/12345')
          .send({ genre: 'Blob' });

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The genre could not be found.');
      });
    });

    describe('DELETE /genres/:id', () => {
      it('deletes genre record by id', async () => {
        const genre = genres[0];
        const response = await request(app).delete(`/genres/${genre.id}`);
        const deletedGenre = await Genre.findByPk(genre.id, { raw: true });
        

        expect(response.status).to.equal(204);
        expect(deletedGenre).to.equal(null);
      });

      it('returns a 404 if the genre does not exist', async () => {
        const response = await request(app).delete('/genres/12345');
        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The genre could not be found.');
      });
    });
  })
})