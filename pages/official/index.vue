<template>
  <div class="container">
    <div id="diagram"></div>
    <div id="diagramMakerLogger"></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  ConnectorPlacement, DiagramMaker, VisibleConnectorTypes
} from 'diagram-maker';
import { ContextMenuRenderCallbacks } from 'diagram-maker';
import { DiagramMakerData, DiagramMakerNode, DiagramMakerPotentialNode } from 'diagram-maker';
import 'preact/devtools';
import { Action, Dispatch } from 'redux';
import 'diagram-maker/dist/diagramMaker.css';

import { graph } from './data';

import {
  addDevTools, createCircularNode, createEdgeContextMenu, createLibraryPanel, createNodeContextMenu,
  createNodeWithDropdown, createNodeWithInput, createPanelContextMenu, createPotentialNode, createRectangularNode,
  createToolsPanel, createWorkspaceContextMenu, updateActionInLogger
} from './utils';

import RectangleNode from '../../components/RectangleNode.vue';

const windowAsAny = window as any;

export default Vue.extend({
  data() {
    return {
      diagramMaker: {} as DiagramMaker,
    }
  },

  methods: {
    handleDiagramMakerChange() {
      const state = this.diagramMaker.store.getState();
      // console.log(state);
    },
    handleResize() {
      this.diagramMaker.updateContainer();
    },
    createRectangleNode(node: DiagramMakerNode<{}>, container: HTMLElement) {
      return new Vue({
        components: { RectangleNode },
        el: container,
        render(createElement) {
          return createElement(
            RectangleNode, {
              props: {
                node,
              },
              on: {
                change: function(ev: any) {
                  console.log('catch event. value:', ev.target.value);
                }
              }
            }
          );
        },
      }).$refs.rectangleNode as HTMLElement;
    }
  },

  mounted() {
    this.diagramMaker = new DiagramMaker(
      'diagram',
      {
        options: {
          connectorPlacement: ConnectorPlacement.LEFT_RIGHT
        },
        renderCallbacks: {
          destroy: () => undefined,
          node: (node: DiagramMakerNode<{}>, container: HTMLElement) => {
            if (node.typeId === 'testId-centered') {
              return createCircularNode(node, container);
            }
            if (node.typeId === 'testId-input') {
              return createNodeWithInput(node, container);
            }
            if (node.typeId === 'testId-dropdown') {
              return createNodeWithDropdown(node, container);
            }
            return this.createRectangleNode(node, container);
            // return createRectangularNode(node, container);
          },
          potentialNode: (node: DiagramMakerPotentialNode, container: HTMLElement) =>
            createPotentialNode(node, container),
          panels: {
            library: (panel: any, state: any, container: HTMLElement) => createLibraryPanel(container),
            tools: (
              panel: any,
              state: any,
              container: HTMLElement
            ) => createToolsPanel(container, () => this.diagramMaker)
          },
          contextMenu: {
            node: (id: string | undefined, container: HTMLElement) => createNodeContextMenu(id, container),
            edge: (id: string | undefined, container: HTMLElement) => createEdgeContextMenu(id, container),
            panel: (id: string | undefined, container: HTMLElement) => createPanelContextMenu(id, container),
            workspace: (container: HTMLElement) => createWorkspaceContextMenu(container)
          } as ContextMenuRenderCallbacks
        },
        actionInterceptor: (action: Action, next: Dispatch<Action>, getState: () => DiagramMakerData<{}, {}>) => {
          updateActionInLogger(action);
          next(action);
        },
        nodeTypeConfig: {
          'testId-centered': {
            size: { width: 100, height: 100 },
            connectorPlacementOverride: ConnectorPlacement.CENTERED
          },
          'testId-dead': {
            size: { width: 150, height: 50 },
            visibleConnectorTypes: VisibleConnectorTypes.NONE
          },
          'testId-dropdown': {
            size: { width: 150, height: 50 }
          },
          'testId-end': {
            size: { width: 150, height: 50 },
            visibleConnectorTypes: VisibleConnectorTypes.INPUT_ONLY
          },
          'testId-input': {
            size: { width: 150, height: 50 }
          },
          'testId-normal': {
            size: { width: 150, height: 50 }
          },
          'testId-normalWithSize': {
            size: { width: 150, height: 50 }
          },
          'testId-start': {
            size: { width: 150, height: 50 },
            visibleConnectorTypes: VisibleConnectorTypes.OUTPUT_ONLY
          },
          'testId-topBottom': {
            size: { width: 150, height: 50 },
            connectorPlacementOverride: ConnectorPlacement.TOP_BOTTOM
          }
        }
      },
      {
        consumerEnhancer: addDevTools(),
        initialData: graph
      }
    );

    this.diagramMaker.store.subscribe(this.handleDiagramMakerChange);
    window.addEventListener('resize', this.handleResize);
  },

  destroyed() {
    window.removeEventListener('resize', this.handleResize);
    this.diagramMaker.destroy();
  }
})
</script>

<style lang="scss">
@import './scss/CircularNode.scss';
@import './scss/Logger.scss';
@import './scss/RectangularNode.scss';
</style>
