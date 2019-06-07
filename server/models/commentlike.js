module.exports = (sequelize, DataTypes) => {
  const CommentLike = sequelize.define('CommentLike', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    commentId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});

  CommentLike.associate = (models) => {
    const { User, Comment } = models;

    CommentLike.belongTo(User, {
      foreignKey: 'userId',
      as: 'user'
    });

    CommentLike.belongsTo(Comment, {
      foreignKey: 'commentId',
      as: 'comments'
    });
  };

  return CommentLike;
};
