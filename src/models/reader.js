module.exports = (connection, DataTypes) => {
    const schema = {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: {
            args: true,
            msg: 'email field must be a valid email address'
          }
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [8, 64],
            msg: 'password field must be at least 8 characters long'
          }
        }
      },
    };
  
    const ReaderModel = connection.define('Reader', schema);

    return ReaderModel;
  };