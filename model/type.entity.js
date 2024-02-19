const EntitySchema = require('typeorm').EntitySchema;

module.exports = new EntitySchema({
  name: 'AssetType',
  tableName: 'asset_type',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    code: {
      type: 'varchar',
    },
    name: {
      type: 'varchar',
    },
  },
});
