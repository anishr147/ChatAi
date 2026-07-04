import { create } from "zustand";
import { axiosInstance, BACKEND_URL } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from 'socket.io-client'

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5000" : BACKEND_URL;

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingUp: false,
    isUpdatingProfile: false,
    socket: null,
    onlineUsers: [],
    checkAuth: async () => {
      try {
        const res = await axiosInstance.get("/auth/check")
        set({ authUser: res.data.user })

        get().connectSocket()
      } catch (error) {
        console.log("Error in authCheck", error);
        set({ authUser: null })
        get().disconnetSocket()
      }
      finally {
        set({ isCheckingAuth: false })
      }
    },
    signup: async (data) => {
      set({ isSigningUp: true })
      try {
        const res = await axiosInstance.post("/auth/signup", data)
        set({ authUser: res.data })

        toast.success("Account Created Successfully")

      } catch (error) {
        toast.error(error.response.data.message)
      } finally {
        set({ isSigningUp: false })
      }
    },
    login: async (data) => {
      set({ isLoggingUp: true })
      try {
        const res = await axiosInstance.post("/auth/login", data)
        set({ authUser: res.data })

        toast.success("Logged In Successfully")
        get().connectSocket()

      } catch (error) {
        toast.error(error.response.data.message)
      } finally {
        set({ isLoggingUp: false })
      }
    },
    logout: async () => {
      try {
        await axiosInstance.post("/auth/logout")
        set({ authUser: null })
        toast.success("Logged Out Successfully")
        get().disconnetSocket(

        )
      } catch (error) {
        toast.error("Error in logging out");
        console.log("Logout Error", error);
      }
    },
    updateProfile: async (data) => {
      try {
        const res = await axiosInstance.put("/auth/update-profile", data)

        set({ authUser: res.data })

        toast.success("Profile Updated Successfully")
      } catch (error) {
        console.log("Error in updating profile", error);
        toast.error(error.response.data.message)
      } finally {
        set({ isUpdatingProfile: false })
      }
    },
    connectSocket: () => {
      const { authUser } = get()
      if (!authUser || get().socket?.connected) return

      const socket = io(BASE_URL, { withCredentials: true }) // this ensures that the cookie is sent with the connecton request

      socket.connect()
      set({ socket: socket })

      // listen for online users
      socket.on("getOnlineUsers", (userIds) => set({ onlineUsers: userIds }))


    },
    disconnetSocket: () => {
      if (get().socket.connected) get().socket?.disconnect()

    }

  }),
 
  )
