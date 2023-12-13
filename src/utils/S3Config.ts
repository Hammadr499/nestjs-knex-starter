import {
  DeleteObjectCommand,
  DeleteObjectCommandOutput,
  PutObjectCommand,
  PutObjectCommandOutput,
  S3,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  private readonly s3: S3;
  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3({
      region: this.configService.get('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });
  }

  uploadFile(
    filename: string,
    fileContent: Buffer,
    contentType: string,
  ): Promise<PutObjectCommandOutput> {
    const params = {
      Bucket: this.configService.get('AWS_BUCKET_NAME'),
      Key: filename,
      Body: fileContent,
      ContentType: contentType,
    };

    return this.s3.send(new PutObjectCommand(params));
  }

  deleteFile(filename: string): Promise<DeleteObjectCommandOutput> {
    filename = filename
      .split(`${this.configService.get('AWS_BUCKET_BASE_URL')}`)
      .pop();
    const params = {
      Bucket: this.configService.get('AWS_BUCKET_NAME'),
      Key: filename,
    };

    return this.s3.send(new DeleteObjectCommand(params));
  }
}
