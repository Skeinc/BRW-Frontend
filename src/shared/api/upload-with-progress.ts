import { buildApiUrl, parseErrorText } from './http-client';
import { ApiError } from './types';

/** POSTs multipart `FormData` and reports upload progress (0-100); `fetch` cannot do the latter. */
export function uploadWithProgress<T>(
  path: string,
  body: FormData,
  onProgress?: (percent: number) => void,
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open('POST', buildApiUrl(path));
    request.withCredentials = true;
    request.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        onProgress?.(Math.round((event.loaded / event.total) * 100));
      }
    });
    request.addEventListener('load', () => {
      if (request.status >= 200 && request.status < 300) {
        try {
          resolve(JSON.parse(request.responseText) as T);
        } catch {
          reject(new ApiError(request.status, { code: 'HTTP_ERROR', message: 'Invalid response body' }));
        }
        return;
      }
      reject(new ApiError(request.status, parseErrorText(request.responseText, request.statusText)));
    });
    request.addEventListener('error', () =>
      reject(new ApiError(0, { code: 'NETWORK_ERROR', message: 'Network error' })),
    );
    request.addEventListener('abort', () =>
      reject(new ApiError(0, { code: 'NETWORK_ERROR', message: 'Upload aborted' })),
    );
    request.send(body);
  });
}
