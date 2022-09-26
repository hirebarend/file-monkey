import axios from 'axios';
import * as uuid from 'uuid';

export function FileMonkey(username: string, tags: Array<string> = []) {
  return {
    onChange: (event: Event) => onChange(username, tags, event),
  };
}

async function onChange(username: string, tags: Array<string>, event: Event) {
  if (!event.target) {
    return null;
  }

  const htmlInputElement = event.target as HTMLInputElement;

  if (!htmlInputElement.files || !htmlInputElement.files.length) {
    return null;
  }

  const collection = {
    files: [] as Array<{
      collectionId: string;
      contentType: string;
      createdAt: number;
      id: string;
      name: string;
      size: number;
      tags: Array<string>;
      tenantId: string;
      url: string;
    }>,
    id: uuid.v4(),
  };

  for (const file of htmlInputElement.files) {
    const result = await post(username, collection.id, file, tags);

    collection.files.push(result);
  }

  return collection;
}

function post(
  username: string,
  collectionId: string,
  file: File,
  tags: Array<string> = []
): Promise<{
  collectionId: string;
  contentType: string;
  createdAt: number;
  id: string;
  name: string;
  size: number;
  tags: Array<string>;
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
        tags: Array<string>;
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
            tags: Array<string>;
            tenantId: string;
            url: string;
          }>(
            `https://api.filemonkey.io/api/v1/files`,
            fileReader.result as ArrayBuffer,
            {
              auth: {
                password: '',
                username,
              },
              headers: {
                'Content-Type': file.type,
                'X-Collection-ID': collectionId,
                'X-Name': file.name,
              },
              params: {
                tags: [collectionId, ...tags],
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
