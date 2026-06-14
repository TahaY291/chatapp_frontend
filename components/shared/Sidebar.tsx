import React from 'react'
import Navbar from './Navbar'
import { ConversationTabs } from '../conversation/ConversationTab'
import { ConversationList } from '../conversation/ConversationList'

const Sidebar = () => {
  return (
    <div>
      <Navbar/>
      <ConversationTabs/>
      <ConversationList/>
    </div>
  )
}

export default Sidebar
