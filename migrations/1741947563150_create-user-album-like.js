exports.up = (pgm) => {
    pgm.createTable('user_album_likes', {
        id: { type: 'text', primaryKey: true },
        user_id: {
          type: 'text',
          references: 'users(id)',
          notNull: true,
          onDelete: 'CASCADE',
        }, // Foreign key reference to users table
        album_id: {
          type: 'text',
          references: 'albums(id)',
          notNull: true,
          onDelete: 'CASCADE',
        }, // Foreign key reference to albums table
      });
  };
  
  exports.down = (pgm) => {
    pgm.dropConstraint('user_album_likes', 'user_album_likes_user_id_fkey');
    pgm.dropConstraint('user_album_likes', 'user_album_likes_album_id_fkey');

    pgm.dropTable('user_album_likes');
  };
  