import { useEffect, useMemo, useState } from "react";
import { type AspectRatio } from "./types";

type GridItemSize = [gridItemWidth: number, gridItemHeight: number];

const MAX_ROWS = 4;

export function useGrid<T>(
  gridContainerRef: React.RefObject<HTMLElement | null>,
  items: T[],
  aspectRatio: AspectRatio = '16:9'
): GridItemSize {
  const [gridSize, setGridSize] = useState<GridItemSize>([0, 0]);

  useEffect(() => {
    function updateSize() {
      if (gridContainerRef.current) {
        const { width, height } = gridContainerRef.current.getBoundingClientRect();
        setGridSize([width, height]);
      }
    }

    setTimeout(() => {
      updateSize();
    }, 0);

    window.addEventListener('resize', updateSize);

    return () => window.removeEventListener('resize', updateSize);
  }, [gridContainerRef]);

  const gridItemSize = useMemo<GridItemSize>(() => {
    const rows = Math.min(Math.floor(items.length / MAX_ROWS) + 1, MAX_ROWS);
    const cols = Math.ceil(items.length / rows);

    const [widthRatio, heightRatio] = aspectRatio.split(':').map((ratio) => parseInt(ratio, 10));

    const [width, height] = gridSize;

    let itemHeight = Math.floor(height / rows);
    let itemWidth =  Math.floor((itemHeight / heightRatio) * widthRatio);

    if (itemWidth > (width / cols)) {
      itemWidth = Math.floor(width / cols);
      itemHeight = Math.floor((itemWidth / widthRatio) * heightRatio);
    }

    return [itemWidth, itemHeight];
  }, [aspectRatio, gridSize, items.length]);

  return gridItemSize;
}
