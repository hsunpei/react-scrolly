import { createContext } from 'react';
import { Observable } from 'rxjs';

export type sectionID = string | null;

interface ScrollPosition {
  scrollTop: number;
  scrollBottom: number;
  windowHeight: number;
}

export interface PageContextInterface {
  activeSectionId: sectionID;
  scrollObserver$: Observable<ScrollPosition>;
  resizeObserver$: Observable<Event>;
  setCurrentActiveId: ((activeSectionId: sectionID) => void);
}

export const PageContext = createContext<PageContextInterface | null>(null);
