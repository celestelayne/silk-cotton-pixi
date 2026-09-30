import { useEffect, useState } from 'react';
import type { WorldSize } from './types';

const read = (): WorldSize => ({ width: window.innerWidth, height: window.innerHeight });

export function useViewportSize(): WorldSize {
  const [size, setSize] = useState(read);

  useEffect(() => {
    const onResize = () => setSize(read());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return size;
}
