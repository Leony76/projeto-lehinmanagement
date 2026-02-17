export type UserAndSupportConversationDTO = {
  conversationId: number;
  sender: {
    message: string;
    sentAt: string;
    subject: string | null;
  },

  replier: {
    reply: string | null | undefined;
    repliedAt: string | null | undefined;
    name: string | null | undefined;
  },
}