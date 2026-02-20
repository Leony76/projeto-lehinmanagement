import { primaryColorScrollBar } from '@/src/styles/scrollBar.style';
import { UserDeactivatedMenuModals } from '@/src/types/modal';
import { UserAndSupportConversationDTO } from '@/src/types/UserAndSupportConversationDTO';
import NoContentFoundMessage from './NoContentFoundMessage';
import SupportReplyMessageToUserCard from './SupportReplyMessageToUserCard';

type Props = {
  conversations: UserAndSupportConversationDTO[];
  setSelectedConversation: React.Dispatch<React.SetStateAction<UserAndSupportConversationDTO | null>>
  setActiveModal: React.Dispatch<React.SetStateAction<UserDeactivatedMenuModals | null>>
}

const SupportReplyMessageToUser = (props:Props) => {

  return (
    <>
    <div className='space-x-4 mb-1'>
      <span className='text-gray'>
        Contagem: <span className='text-yellow'>{props.conversations.length}</span>
      </span>

      <span className='text-gray'>
        Respondidas: <span className='text-green-200'>{props.conversations.reduce((acc, cur) => 
          cur.replyMessage !== null
            ? acc + 1
            : acc
        , 0)}
        </span>
      </span>

      <span className='text-gray'>
        Não respondidas: <span className='text-red'>{props.conversations.reduce((acc, cur) => 
          cur.replyMessage === null 
            ? acc + 1
            : 0
        , 0)}
        </span>
      </span>
    </div>

    <div className={`flex flex-col gap-3 max-h-[50vh] overflow-y-auto ${primaryColorScrollBar} pr-2`}>
      {props.conversations.length > 0 ? (
        props.conversations.map((conversation) => (
          <SupportReplyMessageToUserCard
            key={conversation.id}
            conversation={conversation}
            setSelectedConversation={props.setSelectedConversation}
            setActiveModal={props.setActiveModal}
          />               
        ))
      ) : (
        <NoContentFoundMessage text={'Nada'}/>
      )}
    </div>
    </>
  )
}

export default SupportReplyMessageToUser