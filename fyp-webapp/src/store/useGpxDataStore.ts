import { Info } from '@/types/infoType';
import {create} from 'zustand';
//@ts-ignore
import { Feature, MultiLineString, LineString, Properties } from '@turf/turf';

type GpxDataState = {
  name: string;
  xml: Document | undefined;
  author: string;
  info: Info | null;
  inPage: "event"|"live"|"plan";
  routes: Feature<MultiLineString, Properties> | Feature<LineString, Properties>;
  setName: (name: string) => void;
  setAuthor: (author: string) => void;
  setInfo: (info: Info | null) => void;
  setXML: (xml: Document | undefined) => void;
  setRoutes: (routes: Feature<MultiLineString, Properties> | Feature<LineString, Properties>) => void;
  reset: () => void;
  setInPage: (inPage: "event"|"live"|"plan") => void;
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
  inPage: "plan",
  xml: undefined,
  setName: (name) => set({ name }),
  setAuthor: (author) => set({ author }),
  setInfo: (info) => set({ info }),
  setRoutes: (routes) => set({ routes }),
  setXML: (xml) => set({ xml }),
  setInPage: (inPage) => set({ inPage }),
  reset: () => set({ name: '', author: '', info: null, routes: null, xml: undefined}),
  init: (data) => set({ ...data }),
}));