import { UserDeactivatedMenuModals, UsersPageModals } from '@/src/types/modal';
import { UserAndSupportConversationDTO } from '@/src/types/UserAndSupportConversationDTO';
import UserReplyMessageToSupport from '../../ui/UserReplyMessageToSupport';
import SupportReplyMessageToUser from '../../ui/SupportReplyMessageToUser';
import UserMessageToSupport from '../../ui/UserMessageToSupport';
import SupportMessageToUser from '../../ui/SupportMessageToUser';
import SendMessageToUser from '../../ui/SendMessageToUser';

type Props = {
  type: 'MESSAGE_FROM_USER';
  message: UserAndSupportConversationDTO | null;
  setActiveModal: React.Dispatch<React.SetStateAction<UsersPageModals | null>>;
  setSelectedMessage: React.Dispatch<React.SetStateAction<UserAndSupportConversationDTO | null>>;
} | {
  type: 'MESSAGE_REPLY';
  message: UserAndSupportConversationDTO | null;
  replyMessage: string;
  error: string;
  setReplyMessage: React.Dispatch<React.SetStateAction<string>>
  setActiveModal: React.Dispatch<React.SetStateAction<UsersPageModals | null>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
} | {
  type: 'USER_MESSAGE';
  conversations: UserAndSupportConversationDTO[];
  setSelectedConversation: React.Dispatch<React.SetStateAction<UserAndSupportConversationDTO | null>>
  setActiveModal: React.Dispatch<React.SetStateAction<UserDeactivatedMenuModals | null>>
} | {
  type: 'USER_REPLY';
  conversations: UserAndSupportConversationDTO[];
  selectedConversation: UserAndSupportConversationDTO | null;
  setActiveModal: React.Dispatch<React.SetStateAction<UserDeactivatedMenuModals | null>>
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
  replySupportMessage: string;
  setReplySupportMessage: React.Dispatch<React.SetStateAction<string>>;
} | {
  type: 'SEND_MESSAGE_TO_USER';
  setActiveModal: React.Dispatch<React.SetStateAction<UsersPageModals | null>>
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
  sendMessage: string;
  setSendMessage: React.Dispatch<React.SetStateAction<string>>;
}

const UserMessage = (props:Props) => {

  const { type } = props;

  switch (type) {
    case 'MESSAGE_FROM_USER'       : return <UserMessageToSupport      {...props}/>
    case 'MESSAGE_REPLY'           : return <SupportMessageToUser      {...props}/>
    case 'USER_MESSAGE'            : return <SupportReplyMessageToUser {...props}/>
    case 'SEND_MESSAGE_TO_USER'    : return <SendMessageToUser         {...props}/>
    case 'USER_REPLY'              : return <UserReplyMessageToSupport {...props}/>
  }
}

export default UserMessage