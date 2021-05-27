module.exports = (connection, DataTypes) => {
    const schema = {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
    };
  
    const GenreModel = connection.define('Genre', schema);

    return GenreModel;
  };