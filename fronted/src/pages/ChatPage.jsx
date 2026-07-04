
import ActiveTabSwitch from '../components/ActiveTabSwitch.jsx'
import BorderAnimatedContainer from '../components/BorderAnimatedContainer.jsx'
import ChatList from '../components/ChatList.jsx'
import ContactsList from '../components/ContactsList.jsx'
import NoConversationPlaceholder from '../components/NoConversationPlaceholder.jsx'
import ProfilerHeader from '../components/ProfilerHeader.jsx'
import ChatContainer from '../components/ChatContainer.jsx'

import {useChatStore} from "../store/useChatStore.js"

function ChatPage() {
  const {activeTab , selectedUser} = useChatStore()
  return (
  <div className=" relative w-full max-w-6xl h-[800px]">
  <BorderAnimatedContainer>

    
    {/**LEFT SIDE OF CHATPAGE */}
    <div className='w-80 bg-slate-800/50 backdrop-blur-sm  flex flex-col'>
    <ProfilerHeader/>
    <ActiveTabSwitch/>

    <div className=' flex-1 overflow-y-auto p-4 space-y-2'> 
      {activeTab === "chats" ? <ChatList/> : <ContactsList/>}
    </div>
    </div>




    {/**RIGHT SIDE OF CHATPAGE */}
<div className='flex-1 flex flex-col bg-slate-900/50 backdrop-blur-sm'>
{selectedUser ?  <ChatContainer/> : <NoConversationPlaceholder/> }

</div>
     </BorderAnimatedContainer>
  </div>

  )
}

export default ChatPage
