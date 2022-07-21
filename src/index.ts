import axios from 'axios';
import * as uuid from 'uuid';

export function FileMonkey(username: string, password: string) {
  return {
    onChange: (
      fn: (collection: {
        files: Array<{
          collectionId: string;
          contentType: string;
          createdAt: number;
          id: string;
          name: string;
          size: number;
          tenantId: string;
          url: string;
        }>;
        id: string;
      }) => void
    ) => onChange(username, password, fn),
  };
}

function onChange(
  username: string,
  password: string,
  fn: (collection: {
    files: Array<{
      collectionId: string;
      contentType: string;
      createdAt: number;
      id: string;
      name: string;
      size: number;
      tenantId: string;
      url: string;
    }>;
    id: string;
  }) => void
) {
  return async (event: Event) => {
    if (!event.target) {
      return;
    }

    const htmlInputElement = event.target as HTMLInputElement;

    if (!htmlInputElement.files) {
      return;
    }

    const collection = {
      files: [] as Array<{
        collectionId: string;
        contentType: string;
        createdAt: number;
        id: string;
        name: string;
        size: number;
        tenantId: string;
        url: string;
      }>,
      id: uuid.v4(),
    };

    for (const file of htmlInputElement.files) {
      const result = await post(username, password, collection.id, file);

      collection.files.push(result);
    }

    fn(collection);
  };
}

function post(
  username: string,
  password: string,
  collectionId: string,
  file: File
): Promise<{
  collectionId: string;
  contentType: string;
  createdAt: number;
  id: string;
  name: string;
  size: number;
  tenantId: string;
  url: string;
}> {
  return new Promise(
    (
      resolve: (data: {
        collectionId: string;
        contentType: string;
        createdAt: number;
        id: string;
        name: string;
        size: number;
        tenantId: string;
        url: string;
      }) => void,
      reject: (error: Error) => void
    ) => {
      const fileReader: FileReader = new FileReader();

      fileReader.onload = async () => {
        if (!fileReader.result) {
          return;
        }

        try {
          const response = await axios.post<{
            collectionId: string;
            contentType: string;
            createdAt: number;
            id: string;
            name: string;
            size: number;
            tenantId: string;
            url: string;
          }>(
            `https://api.filemonkey.io/api/v1/files`,
            fileReader.result as ArrayBuffer,
            {
              auth: {
                password,
                username,
              },
              headers: {
                'Content-Type': file.type,
                'X-Collection-ID': collectionId,
                'X-Name': file.name,
              },
            }
          );

          resolve(response.data);
        } catch (error) {
          reject(error as Error);
        }
      };

      fileReader.readAsArrayBuffer(file);
    }
  );
}
