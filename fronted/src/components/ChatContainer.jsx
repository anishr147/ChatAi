import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader.jsx";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder.jsx";
import MessagesInput from "./MessagesInput.jsx";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton.jsx";
function ChatContainer() {
  const { selectedUser, 
    getMessagesByUserId, 
    messages, 
    isMessagesLoading , 
    subscribeToMessages , 
    unsuscribeFromMessages } 
    = useChatStore();

  const { authUser } = useAuthStore();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    getMessagesByUserId(selectedUser._id);
    subscribeToMessages();
    return () => unsuscribeFromMessages();
  }, [getMessagesByUserId, selectedUser , subscribeToMessages , unsuscribeFromMessages]);

  // this code is for scrolling to the bottom of the chat automatically
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  

  return (
    <>
      <ChatHeader />
     {/* // this is the code for the chat container whic holds the messages and the
      input from the user */}
      <div className="flex-1 overflow-y-auto px-6  py-8 ">
        {messages.length > 0 && !isMessagesLoading ? (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((message) => (
              <div
                key={message._id}
                className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"} `}
              >
                <div
                  className={`chat-bubble relative ${
                    message.senderId === authUser._id
                      ? "bg-cyan-600 text-white"
                      : "bg-slate-800 text-slate-200"
                  }`}
                >
                  {message.image && (
                    <img
                      src={message.image}
                      alt="Shared"
                      className="rounded-lg h-48 object-cover"
                    />
                  )}
                  {message.text && <p className="mt-2">{message.text}</p>}
                  <p className="text-xs mt-1 opacity-75 flex items-center gap-1">
                    {new Date(message.createdAt).toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
           {/* this is for scrolling to the bottom of the chat automatically */}
            <div ref={messagesEndRef}></div>
          </div>
        ) : isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : (
          <NoChatHistoryPlaceholder name={selectedUser.fullName} />
        )}
      </div>
      <MessagesInput />
    </>
  );
}

export default ChatContainer;
