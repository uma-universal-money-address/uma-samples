import { useEffect } from 'react';

export const useEvent = (
  event: string,
  handler: () => void,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dependents: any[] = [],
  passive: boolean = false
) => {
  useEffect(() => {
    handler();

    window.addEventListener(event, handler, passive);

    return () => {
      window.removeEventListener(event, handler);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dependents]);
};
