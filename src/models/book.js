module.exports = (connection, DataTypes) => {
    const schema = {
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      author: {
        type: DataTypes.STRING,
        allowNull: false
      },
      ISBN: DataTypes.STRING
    };
  
    const BookModel = connection.define('Book', schema);

    return BookModel;
  };