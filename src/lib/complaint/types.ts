export type NewComplaintResult =
  | { success: true, message: string, id: string }
  | { success: false, error: string }

export type NewComplaintData = { id: string }

export type Complaint = {
  id: string
  userId: string
  folderId: string
  createdAt: string
}

export type FilesList = { name: string; }[]

export type Messages = {
  id: string,
  complaint_id: string,
  role: string,
  content: string,
  created_at: string
}[]

export type Files = {
  id: number;
  complaintId: string;
  hash: string;
  name: string;
  url: string;
  createdAt: string;
}[]
