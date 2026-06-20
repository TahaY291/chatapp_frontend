import React from 'react'
import Navbar from './Navbar'
import { ConversationTabs } from '../conversation/ConversationTab'
import { ConversationList } from '../conversation/ConversationList'
import { useConversationStore } from '@/store/conversationStore'
import CallHistory from '../call/CallHistory'

const Sidebar = () => {
  const { activeType } = useConversationStore()
  return (
    <div className='max-h-screen relative'>
      <Navbar/>
      <ConversationTabs/>
      <div className='h-full overflow-y-auto'>
      {activeType === "direct" ? <ConversationList/> : <CallHistory/>}
      </div>
    </div>
  )
}

export default Sidebar
