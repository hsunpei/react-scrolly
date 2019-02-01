import { createContext } from 'react';
import { Observable } from 'rxjs';

export type descriptionID = string | null;

interface ScrollPosition {
  scrollTop: number;
  scrollBottom: number;
  windowHeight: number;
}

export interface PageContextInterface {
  activeDescriptionId: descriptionID;
  scrollObserver$: Observable<ScrollPosition>;
  setCurrentActiveId: ((activeDescriptionId: descriptionID) => void);
}

export default createContext<PageContextInterface | null>(null);
