const Sequelize = require('sequelize');
const ReaderModel = require('./reader');
const BookModel = require('./book');
const GenreModel = require('./genre');
const AuthorModel = require('./author');

const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env;

const setupDatabase = () => {
  const connection = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'mysql',
    logging: false,
  })

  const Reader = ReaderModel(connection, Sequelize);
  const Book = BookModel(connection, Sequelize);
  const Genre = GenreModel(connection, Sequelize);
  const Author = AuthorModel(connection, Sequelize);
  
  Genre.hasMany(Book)
  Book.belongsTo(Genre)

  connection.sync({ alter: true })
    
  return {
      Reader,
      Book,
      Genre,
      Author
  };
};

module.exports = setupDatabase();