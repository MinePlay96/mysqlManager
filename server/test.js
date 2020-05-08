const mysqlConnector = require('./dist/mysqlConnector').default;

const connection = new mysqlConnector({
  host: '127.0.0.1',
  password: '12345678',
  user: 'root'
});

connection.connect()
  .then(async() => connection.getSchemas())
  .then(schemas => {
    schemas.forEach(schema => {
      schema.getTables().then(tables => {
        tables.forEach(table => {
          console.info(`Table: ${table.schema.name}/${table.name}`);
        });
      });
    });
  })
  .catch(console.log);
