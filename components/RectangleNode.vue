<template>
  <div :class="cName" ref="rectangleNode">
    <p>This is the rectangle</p>
    <Input :value="val" @input="handleChange" />
    <button>Button</button>
  </div>
</template>

<script lang="ts">
export default {
  props: ['node'],
  data() {
    return {
      val: '',
    };
  },
  computed: {
    cName() {
      const self: any = this;
      let cn = 'rectangle example-node';
      if (self.node && self.node.diagramMakerData.selected) {
        cn += ' selected';
      }
      if (self.node && self.node.consumerData) {
        if (self.node.consumerData.odd) {
          cn += ' odd';
        } else {
          cn += ' even';
        }
      }
      return cn;
    }
  },
  methods: {
    handleChange(e: any) {
      const self: any = this;
      self.$emit('change', e);
    }
  }
};
</script>

<style>
</style>
