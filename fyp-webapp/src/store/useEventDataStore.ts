import { Event, User } from "@prisma/client"
import { create } from "zustand";

type EventDataState = {
    data?: Event|null;
    participants: User[];
    setData: (data: Event|null) => void;
    setParticipants: (participants: User[]|[]) => void;
}

export const useEventDataStore = create<EventDataState>((set) => ({
    data: null,
    participants:[],
    setData: (data) => set({ data }),
    setParticipants: (participants) => set({ participants})
}));