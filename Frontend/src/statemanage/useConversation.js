import { create } from 'zustand'   //to   select user conversation

const useConversation = create((set) => ({
    selectedConversation: null,         //initially no conversation selected
  setSelectedConversation: (selectedConversation) => set({selectedConversation}),
  messages: [],
  // Accept either an array or an updater function like React's setState
  setMessages: (messagesOrUpdater) => set((state) => ({
    messages: typeof messagesOrUpdater === 'function' ? messagesOrUpdater(state.messages) : messagesOrUpdater,
  })),
}))
export default useConversation;