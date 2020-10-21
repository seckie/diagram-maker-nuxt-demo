import { DiagramMakerData, EditorMode } from 'diagram-maker';

export const initialData: DiagramMakerData<{}, {}> = {
  nodes: {
    node1: {
      id: 'node1',
      diagramMakerData: {
        position: { x: 0, y: 0 },
        size: { width: 300, height: 100 }
      }
    },
  },
  edges: {},
  panels: {},
  workspace: {
    position: { x: 0, y: 0 },
    scale: 1,
    canvasSize: { width: 1200, height: 900 },
    viewContainerSize: { width: window.innerWidth, height: window.innerHeight }
  },
  editor: { mode: EditorMode.DRAG }
};
