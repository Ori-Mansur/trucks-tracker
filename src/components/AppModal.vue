<template>
  <div class="app-modal-container">
    <div class="app-modal-content">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    msg: Object
  },
  methods: {
    close() {
      this.$emit("close");
    }
  },
  mounted() {},
  components: {
  
  }
};
</script>
<style lang="css" scoped>
.app-modal-container {
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 10;
    background-color: rgba(0, 0, 0, 0.5);
}
    .app-modal-content {
        border-radius: 4px;
        background-color: white;
        width: fit-content;
        min-width: 30%;
        min-height: 100px;
        opacity: 1;
    }

</style>

