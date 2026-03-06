import { create } from 'zustand';
import { persist } from 'zustand/middleware';



// Create a Zustand store with persistence
export const useAuthStore = create(
 persist(
  (set, get) => {
    return {
      user: null,
      token: null,
      logIn: (user,token) => {
      set({ user, token})
    },
      logOut: async () => {
       set({ user: null, token: null })
    }
    };
  },{
    name:"abcn_application_portal"
  })
);

export const useSnackStore = create((set, get) => ({
      message: null,
      variant: null,
      setAlert: async ({ variant, message }) => {
        set({ variant, message });
      },     
  })
);

 // Replace with your server URL

// Export the socket instance
