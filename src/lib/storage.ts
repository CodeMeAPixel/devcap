import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Initialize S3 client with provider-specific configuration
const s3Client = new S3Client({
  region: process.env.S3_REGION || 'us-east-1',
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
  },
  forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true', // Required for many S3-compatible services
});

export async function uploadToS3(
  file: Buffer, 
  fileName: string, 
  contentType: string
): Promise<string> {
  try {
    const params = {
      Bucket: process.env.S3_BUCKET_NAME || '',
      Key: fileName,
      Body: file,
      ContentType: contentType,
    };

    // Upload file
    await s3Client.send(new PutObjectCommand(params));

    // Return public URL
    // This constructs a URL that works with most S3-compatible services
    const baseUrl = process.env.S3_PUBLIC_URL || 
      `https://${process.env.S3_BUCKET_NAME}.${process.env.S3_ENDPOINT?.replace(/^https?:\/\//, '')}`;
    
    return `${baseUrl}/${fileName}`;
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw error;
  }
}
