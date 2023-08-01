import cloudinary, { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

import { config } from '@root/config';

const log = config.createLogger('cloudinary');

export function uploads(
  file: string,
  public_id?: string,
  overwrite?: boolean,
  invalidate?: boolean
): Promise<UploadApiResponse | UploadApiErrorResponse | undefined> {
  // log.info(file.substring(0, 11));
  if (file.substring(0, 11) === 'data:/image')
    file = file.substring(0, 5) + file.substring(6, file.length);
  return new Promise((resolve) => {
    cloudinary.v2.uploader.upload(
      file,
      { public_id, overwrite, invalidate },
      (
        error: UploadApiErrorResponse | undefined,
        result: UploadApiResponse | undefined
      ) => {
        if (error) resolve(error);
        resolve(result);
      }
    );
  });
}
