import { Injectable } from '@nestjs/common';
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { v4 as uuid } from 'uuid';
import { FileUpload } from 'graphql-upload';
import * as sharp from 'sharp';

@Injectable()
export class UploadService {
  private s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  async uploadFile(file: FileUpload): Promise<string> {
    const { createReadStream, filename, mimetype } = file;
    const fileKey = `avatar/${uuid()}-${filename}`;

    const resizedImageBuffer = await this.resizeAvatar(createReadStream());

    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileKey,
      Body: resizedImageBuffer,
      ContentType: mimetype,
    };

    const upload = new Upload({
      client: this.s3Client,
      params: uploadParams,
    });

    try {
      const result = await upload.done();
      const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${fileKey}`;
      console.log('File uploaded successfully:', fileUrl);
      return fileUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Failed to upload file');
    }
  }

  private async resizeAvatar(imageStream: NodeJS.ReadableStream): Promise<Buffer> {
    const width = 300;
    const height = 300;

    return new Promise<Buffer>((resolve, reject) => {
        const chunks: Buffer[] = [];
        imageStream.on('data', (chunk) => chunks.push(chunk));
        imageStream.on('end', async () => {
          try {
            const buffer = Buffer.concat(chunks);
            const resizedBuffer = await sharp(buffer)
                .resize(width, height, {
                    fit: sharp.fit.cover,
                    kernel: sharp.kernel.lanczos3,
                })
                .jpeg({ quality: 90 })
                .png({ compressionLevel: 8 })
                .sharpen()
                .toBuffer();
            resolve(resizedBuffer);
          } catch (error) {
            reject(error);
          }
        });
        imageStream.on('error', reject);
    });
  }
}
