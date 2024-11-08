export interface FileObject {
  fileName: string;
  fileSize: number;
  mimeType: string;
  fileContent: string;
  fileUrl: string;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getUrlfromImage(previewImage: FileObject): string {
  return previewImage.fileUrl ?? "";
}

export function sizeLength(size: string | undefined): number {
  const sizeMapping: { [key: string]: number } = {
    small: 16,
    medium: 24,
    large: 32,
  };

  return sizeMapping[size ?? "medium"] ?? 24;
}
