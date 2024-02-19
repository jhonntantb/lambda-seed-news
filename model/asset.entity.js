const EntitySchema = require('typeorm').EntitySchema;

module.exports = new EntitySchema({
  name: 'Asset', // Will use table name `category` as default behaviour.
  tableName: 'asset', // Optional: Provide `tableName` property to override the default behaviour for table name.
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    symbol: {
      type: 'varchar',
    },
    name: {
      type: 'varchar',
    },
    logo: {
      type: 'varchar',
    },
  },
  relations: {
    assetType: {
      target: 'AssetType',
      type: 'many-to-one',
      joinColumn: { name: 'type_id', referencedColumnName: 'id' },
    },
  },
});
