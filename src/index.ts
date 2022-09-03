import axios from 'axios';
import * as uuid from 'uuid';

export function FileMonkey(username: string) {
  return {
    onChange: (event: Event) => onChange(username, event),
  };
}

async function onChange(username: string, event: Event) {
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
    const result = await post(username, collection.id, file);

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
