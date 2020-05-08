interface ICleanabel {
  [key: string]: unknown;
  schema?: string | { name: string };
  table?: string | { name: string };
}

export function cleanClass(object: ICleanabel): object {
  const coppyObject = { ...object };

  // eslint-disable-next-line no-underscore-dangle
  delete coppyObject._mysqlConnection;

  if (typeof coppyObject?.schema === 'object') {
    coppyObject.schema = coppyObject.schema.name;
  }

  if (typeof coppyObject?.table === 'object') {
    coppyObject.table = coppyObject.table.name;
  }

  return coppyObject;
}
