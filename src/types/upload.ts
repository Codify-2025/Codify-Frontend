export type PresignedPut = {
  method: 'PUT';
  url: string;
  headers?: Record<string, string>;
  s3Key: string;
};

export type PresignedPost = {
  method: 'POST';
  url: string;
  fields: Record<string, string>;
  s3Key: string;
};

export type PresignedResp = PresignedPut | PresignedPost;

export interface UploadMetaReq {
  assignmentId: number;
  fileName: string;
  week: number;
  submissionDate: string;
  studentId: number;
  studentName: string;
  s3Key: string;
  etag?: string;
}

export type UploadStage =
  | 'idle'
  | 'presigning'
  | 'uploading'
  | 'registering'
  | 'done'
  | 'error';

export interface UploadItemState {
  file: File;
  progress: number;
  stage: UploadStage;
  s3Key?: string;
  etag?: string;
  error?: string;
}
