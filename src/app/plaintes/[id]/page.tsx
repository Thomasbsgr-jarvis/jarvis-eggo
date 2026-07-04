import { Complaint, Files, FilesList, Messages } from "@/lib/complaint/types";
import { apiFetch } from "@/lib/http/fetch";
import logger from "@/lib/logger";
import { getAccessCookie } from "@thomasbsgr-jarvis/jarvis-auth-next/server";
import { notFound, redirect } from "next/navigation";
import Sidebar from "./components/Sidebar";
import Chat from "./components/Chat";
import MessageInput from "./components/MessageInput";
import { User } from "@thomasbsgr-jarvis/jarvis-auth-next";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const token = await getAccessCookie();
  if (!token) redirect("/auth");

  const resComplaint = await apiFetch<Complaint>(`/eggo/complaints/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!resComplaint.ok) {
    if (resComplaint.status === 404 || resComplaint.status === 401)
      return notFound();
    logger.warn({ err: resComplaint.error }, "GetComplaint error:");
    redirect("/");
  }

  const resUser = await apiFetch<User>(`/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!resUser.ok) {
    if (resUser.status !== 404) {
      logger.warn({ err: resUser.error }, "Me error:");
    }
    redirect("/");
  }

  const resFiles = await apiFetch<Files>(`/eggo/files/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!resFiles.ok) {
    logger.warn({ err: resFiles.error }, "GetFiles error:");
    redirect("/");
  }

  const user: User = resUser.data;
  const files: Files = resFiles.data;

  const filesList: FilesList = (files ?? []).map((f) => ({
    name: f.name,
  }));

  const messages: Messages = [
    {
      id: "1",
      complaint_id: "d0d983b5-dbde-4faf-86e5-d0df52e975c8",
      role: "user",
      content: "Coucou",
      created_at: "23 juin",
    },
  ];

  return (
    <>
      <div className="absolute inset-0 size-full flex flex-col px-6 max-lg:p-6">
        <div className="max-w-[1440px] min-h-0 overflow-y-auto w-full flex-1 mx-auto lg:gap-8 lg:pt-24 max-lg:mt-18 lg:grid max-lg:space-y-8 lg:grid-cols-[300px_1fr]">
          <Sidebar filesList={filesList} />
          <Chat messages={messages} fullName={user.fullName} />
        </div>
        <MessageInput filesList={filesList} />
      </div>
    </>
  );
}
