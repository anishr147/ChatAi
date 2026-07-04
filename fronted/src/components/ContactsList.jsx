import {useChatStore} from "../store/useChatStore.js";
import {useAuthStore} from "../store/useAuthStore.js";
import { useEffect } from "react";
import UsersLoadingState from "./UsersLoadingState";
import NoChatsFound from "./NoChatsFound";

function ContactsList() {
  const { getAllContacts, allContacts = [], setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers = [] } = useAuthStore();

  useEffect(() => {
    getAllContacts();
  }, [getAllContacts]);

  if (isUsersLoading) return <UsersLoadingState />;
  if (!allContacts || allContacts.length === 0) return <NoChatsFound />;

  return (
    <>
      {allContacts.map((contact) => (
        <div
          key={contact._id}
          className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
          onClick={() => setSelectedUser(contact)}
        >
          <div className="flex items-center gap-3">
            <div className={`avatar ${onlineUsers.includes(contact._id) ? "online" : "offline"}`}>
              <div className="size-12 rounded-full">
                <img src={contact.profilePic || "/avatar.png"} alt={contact.fullName || "User"} />
              </div>
            </div>
            <h4 className="text-slate-200 font-medium">{contact.fullName || "Unknown User"}</h4>
          </div>
        </div>
      ))}
    </>
  );
}

export default ContactsList;
