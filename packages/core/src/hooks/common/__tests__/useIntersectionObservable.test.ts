import { useRef } from 'react';
import { renderHook } from '@testing-library/react-hooks';

import { useIntersectionObservable } from '../useIntersectionObservable';

const observerMap = new Map();
const instanceMap = new Map();

beforeAll(() => {
  // @ts-ignore
  global.IntersectionObserver = jest.fn((cb, options) => {
    const instance = {
      thresholds: Array.isArray(options.threshold)
        ? options.threshold
        : [options.threshold],
      root: options.root,
      rootMargin: options.rootMargin,
      observe: jest.fn((element: Element) => {
        instanceMap.set(element, instance);
        observerMap.set(element, cb);
      }),
      unobserve: jest.fn((element: Element) => {
        instanceMap.delete(element);
        observerMap.delete(element);
      }),
      disconnect: jest.fn(),
    };
    return instance;
  });
});

afterEach(() => {
  // @ts-ignore
  global.IntersectionObserver.mockClear();
  instanceMap.clear();
  observerMap.clear();
});

describe('useIntersectionObservable() hook', () => {
  it('should return scrollInfo', () => {
    const mockedRef = useRef();
    const observable = renderHook(() => useIntersectionObservable(mockedRef, 'dummy-section'));
  });
});
