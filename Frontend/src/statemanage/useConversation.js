import { create } from 'zustand'   //to   select user conversation

const useConversation = create((set) => ({
  selectedConversation: null,         //initially no conversation selected
  setSelectedConversation: (selectedConversation) => set({ selectedConversation }),
  messages: [],
  // Accept either an array or an updater function like React's setState
  setMessages: (messagesOrUpdater) => set((state) => ({
    messages: typeof messagesOrUpdater === 'function' ? messagesOrUpdater(state.messages) : messagesOrUpdater,
  })),
  tasks: [],
  setTasks: (tasksOrUpdater) => set((state) => ({
    tasks: typeof tasksOrUpdater === 'function' ? tasksOrUpdater(state.tasks) : tasksOrUpdater,
  })),
  taskFilter: "all",
  setTaskFilter: (taskFilter) => set({ taskFilter }),
  pendingScrollMessageId: null,
  setPendingScrollMessageId: (pendingScrollMessageId) => set({ pendingScrollMessageId }),
  pendingNavigation: null,
  setPendingNavigation: (pendingNavigation) => set({ pendingNavigation }),
  navigateToMessage: ({ conversation, messageId }) => set({
    selectedConversation: conversation,
    pendingNavigation: { messageId }
  }),
}))
export default useConversation;