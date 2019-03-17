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
  addActiveSection: (trackingId: string, bottomDistance: number) => void;
  removeActiveSection: (trackingId: string) => void;
  scrollObserver$: Observable<ScrollPosition>;
  resizeObserver$: Observable<Event>;
}

export const PageContext = createContext<PageContextInterface | null>(null);
