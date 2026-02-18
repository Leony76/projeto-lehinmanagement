import { SupportMessageType, Role, SupportMessageSentBy } from "@prisma/client";

export type UserAndSupportConversationDTO = {
  id: number;
  sentAt: string;
  type: SupportMessageType;
  subject: string | null;
  message: string;
  sender: {
    name: string | null;
    role: Role | null;
  };

  sentBy: SupportMessageSentBy;
  
  repliedAt: string | undefined;
  replyMessage: string | null;
  replier?: {
    name: string | null | undefined;
    role: Role | null | undefined;
  };

  // conversationId: number;
  // sender: {
  //   message: string;
  //   sentAt: string;
  //   subject: string | null;
  // },

  // replier: {
  //   reply: string | null | undefined;
  //   repliedAt: string | null | undefined;
  //   name: string | null | undefined;
  // },
}
