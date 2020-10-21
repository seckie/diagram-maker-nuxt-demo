<template>
  <div class="container">
    <div>
      <Logo />
      <h1 class="title">
        diagram-maker-demo
      </h1>
      <div id="diagram" />
      <div class="links">
        <a
          href="https://nuxtjs.org/"
          target="_blank"
          rel="noopener noreferrer"
          class="button--green"
        >
          Documentation
        </a>
        <a
          href="https://github.com/nuxt/nuxt.js"
          target="_blank"
          rel="noopener noreferrer"
          class="button--grey"
        >
          GitHub
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ConnectorPlacement, DiagramMaker, DiagramMakerConfig, DiagramMakerNode } from 'diagram-maker';
import 'diagram-maker/dist/diagramMaker.css';
import { initialData } from './data';
import RectangleNode from '../components/RectangleNode.vue';

function addDevTools() {
  if (process.env.NODE_ENV === 'development') {
    const windowAsAny: any = window;
    return windowAsAny.__REDUX_DEVTOOLS_EXTENSION__ && windowAsAny.__REDUX_DEVTOOLS_EXTENSION__();
  }
}

export default Vue.extend({
  data() {
    return {
      diagramMaker: {} as DiagramMaker,
    }
  },

  methods: {
    handleDiagramMakerChange() {
      const state = this.diagramMaker.store.getState();
      console.log(state);
    },
    handleResize() {
      this.diagramMaker.updateContainer();
    },
    createNode(node: DiagramMakerNode<{}>, container: HTMLElement) {
      return new Vue({
        components: { RectangleNode },
        el: container,
        render(createElement) {
          return createElement(RectangleNode);
        },
      }).$refs.rectangleNode as HTMLElement;
    }
  },

  mounted() {
    // const container = this.$refs.diagram;
    const container = 'diagram';
    const config = {
      renderCallbacks: {
        destroy() { return undefined; },
        node: (node: DiagramMakerNode<{}>, container: HTMLElement) => {
          return this.createNode(node, container);
        },
        panels: {},
      },
      nodeTypeConfig: {
        'defaultNode': {
          size: { width: 100, height: 100 },
          connectorPlacementOverride: ConnectorPlacement.CENTERED,
        },
      }
    };
    const optionalParams = {
      // { initialData, eventListener, consumerRootReducer, consumerEnhancer }
      consumerEnhancer: addDevTools(),
      initialData,
    };
    this.diagramMaker = new DiagramMaker(
      container,
      config,
      optionalParams,
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

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family:
    'Quicksand',
    'Source Sans Pro',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
