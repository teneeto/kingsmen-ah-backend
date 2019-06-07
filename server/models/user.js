import bcrypt from 'bcrypt';
import { config } from 'dotenv';

config();

const SALT_ROUNDS = Number(process.env.SALT);

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.CITEXT,
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.CITEXT,
      allowNull: false,
      unique: true
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: true
    },
    middlename: {
      type: DataTypes.STRING,
      allowNull: true
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    hooks: {
      beforeCreate: user => User.hashPassword(user),
      beforeUpdate: user => User.hashPassword(user)
    }
  });

  User.associate = (models) => {
    const {
      Follower, Article, Profile, Social, ReportArticle, Rating, PasswordReset,
      ArticleLike, CommentLike, Permission
    } = models;

    User.hasOne(Profile, {
      foreignKey: 'userId',
      as: 'profile'
    });

    User.hasMany(Follower, {
      foreignKey: 'followingId',
      as: 'following',
    });

    User.hasMany(Follower, {
      foreignKey: 'followerId',
      as: 'follower',
    });
    User.hasMany(Article, {
      foreignKey: 'userId',
      as: 'author',
    });

    User.hasMany(Social, {
      foreignKey: 'userId',
      as: 'social'
    });

    User.hasMany(Rating, {
      foreignKey: 'userId',
      as: 'social'
    });

    User.hasMany(ReportArticle, {
      foreignKey: 'userId'
    });

    User.hasOne(PasswordReset, {
      foreignKey: 'userId'
    });

    User.hasMany(ArticleLike, {
      foreignKey: 'userId'
    });

    User.hasMany(CommentLike, {
      foreignKey: 'userId'
    });

    User.belongsToMany(Permission, {
      through: 'UsersPermission',
      as: 'permission',
      foreignKey: 'userId'
    });
  };

  User.hashPassword = async (user) => {
    const hash = await bcrypt.hash(user.dataValues.password, SALT_ROUNDS);
    await user.setDataValue('password', hash);
  };

  return User;
};
