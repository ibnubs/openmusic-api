exports.up = (pgm) => {
    pgm.createTable('albums', {
      id: {
        type: 'VARCHAR(50)',
        primaryKey: true,
      },
      name: {
        type: 'TEXT',
        notNull: true,
      },
      year: {
        type: 'INTEGER',
        notNull: true,
      },
      cover: {
        type: 'varchar(255)',
        notNull: false,
        default: null
      },
      created_at: {
        type: 'TIMESTAMP',
        notNull: true,
        default: pgm.func('current_timestamp'),
      },
      updated_at: {
        type: 'TIMESTAMP',
        notNull: true,
        default: pgm.func('current_timestamp'),
      },
    });
  };
  
  exports.down = (pgm) => {
    pgm.dropTable('albums');
  };
  