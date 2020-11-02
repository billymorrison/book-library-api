module.exports = (connection, DataTypes) => {
    const schema = {
      name: DataTypes.STRING,
      author: DataTypes.STRING,
    };
  
    const BookModel = connection.define('Book', schema);

    return BookModel;
  };