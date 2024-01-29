const EntitySchema = require("typeorm").EntitySchema

module.exports =new EntitySchema({
  name: "Pulse", // Will use table name `category` as default behaviour.
  tableName: "pulse", // Optional: Provide `tableName` property to override the default behaviour for table name.
  columns: {
      id:{
        primary: true,
        type: "int",
        generated: true,
      },
      source: {
        type: "varchar",
      },
      asset_id:{
        type: 'int'
      }, 
      url: {
        type: 'varchar'
      },
      title:{
        type: 'varchar'
      },
      description:{
      type: 'text'
      },
    published_at: {
      type: 'date'
    },
  },
  relations:{
    assetId: {
      target: 'Asset',
      type: 'many-to-one',
      joinColumn: { name: 'asset_id', referencedColumnName: 'id' },
      cascade: true,
    }
  }
})
