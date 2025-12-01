import type { Prisma } from "@workspace/db";
import { FileOutputType } from "@workspace/orpc-contract";

export type FileWithRelations = Prisma.FileGetPayload<{}>;

const mapFileToOutput = (file: FileWithRelations): FileOutputType => {
  return {
    id: file.id,
    key: file.key,
    url: file.url,
    name: file.name,
    mimeType: file.mimeType,
    size: file.size,
    uploadedAt: file.uploadedAt,
    uploaderId: file.uploaderId,
  };
};

export default mapFileToOutput;
