import { Request } from 'express';

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

export async function getBody(res: Request): Promise<{[key: string]: unknown}> {
  return new Promise(resolve => resolve(res.body));
}

// eslint-disable-next-line max-len
export async function testForToken(object: {[key: string]: unknown}, connection: {[key: string]: unknown}): Promise<{[key: string]: unknown; token: string}> {
  return new Promise((resolve, reject) => {
    if (!object.token) {
      reject(new Error('NO TOKEN'));

      return;
    }

    if (typeof object.token !== 'string') {
      reject(new Error('NO TOKEN IS NO STRING'));

      return;
    }

    if (!connection[object.token]) {
      reject(new Error('TOKEN NOT FOUND'));

      return;
    }

    const returnObject = {
      ...object,
      token: object.token
    };

    resolve(returnObject);
  });
}

