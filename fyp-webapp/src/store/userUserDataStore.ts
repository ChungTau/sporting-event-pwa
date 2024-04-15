import { User } from "@prisma/client";
import { create } from "zustand";

type UserDateState = {
    userData?: User|null;
    setUserData: (userData: User|null) => void;
}

export const useUserDataStore = create<UserDateState>((set) => ({
    userData: null,
    setUserData: (userData) => set({ userData})
}));