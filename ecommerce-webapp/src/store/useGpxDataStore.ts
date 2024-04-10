import { Info } from '@/types/infoType';
import {create} from 'zustand';
//@ts-ignore
import { Feature, MultiLineString, LineString, Properties } from '@turf/turf';

type GpxDataState = {
  name: string;
  author: string;
  info: Info | null;
  routes: Feature<MultiLineString, Properties> | Feature<LineString, Properties>;
  setName: (name: string) => void;
  setAuthor: (author: string) => void;
  setInfo: (info: Info | null) => void;
  setRoutes: (routes: Feature<MultiLineString, Properties> | Feature<LineString, Properties>) => void;
  reset: () => void;
  init: (data: {
    name: string;
    author: string;
    info: Info | null;
    routes: Feature<MultiLineString, Properties> | Feature<LineString, Properties>;
  }) => void;
};

export const useGpxDataStore = create<GpxDataState>((set) => ({
  name: '',
  author: '',
  info: null,
  routes: null,
  setName: (name) => set({ name }),
  setAuthor: (author) => set({ author }),
  setInfo: (info) => set({ info }),
  setRoutes: (routes) => set({ routes }),
  reset: () => set({ name: '', author: '', info: null, routes: null }),
  init: (data) => set({ ...data }),
}));