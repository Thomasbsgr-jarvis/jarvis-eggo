import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"

const s3 = new S3Client({
  region: "eu-central-1",
  endpoint: "https://fsn1.your-objectstorage.com",
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
})

export async function sendFile(buffer: Buffer<ArrayBuffer>, fileName: string, key: string, contentType: string) {
  await s3.send(new PutObjectCommand({
    Bucket: "jarvis-eggo",
    Key: key,
    Body: buffer,
    ContentType: contentType,
  }))
}
