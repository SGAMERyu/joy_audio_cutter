<template>
  <div class="joy-dialog" v-show="visible">
    <div class="joy-dialog-wrapper">
      <header class="joy-dialog-header">
        <span class="joy-dialog-title">
          {{ title }}
        </span>
        <span @click="handleClose">
          x
        </span>
      </header>
      <main class="joy-dialog-content">
        <slot>some content</slot>
      </main>
      <footer class="joy-dialog-footer">
        <slot name="footer">
          <button class="joy-dialog-btn" @click="handleConfirm">
            {{ okText }}
          </button>
          <button class="joy-dialog-btn" @click="handleCancel">
            {{ cancelText }}
          </button>
        </slot>
      </footer>
    </div>
    <div class="joy-dialog-mask" v-show="mask" @click="handleCloseOnMask"></div>
  </div>
</template>

<script lang="ts">
import { createComponent, PropType } from "@vue/composition-api";

export default createComponent({
  name: "JoyDialog",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    onBeforeConfirm: {
      type: Function
    },
    title: {
      type: String
    },
    cancelText: {
      type: String,
      default: "取消"
    },
    closable: {
      type: Boolean,
      default: true
    },
    mask: {
      type: Boolean,
      default: true
    },
    maskClosable: {
      type: Boolean,
      default: true
    },
    okText: {
      type: String,
      default: "确认"
    },
    onCancel: {
      type: Function
    },
    onOk: {
      type: Function
    }
  },
  setup(props, ctx) {
    function handleClose() {
      ctx.emit("update:visible", false);
    }
    function handleCloseOnMask() {
      if (!props.maskClosable) return;
      handleClose();
    }
    async function handleConfirm() {
      if (props.onBeforeConfirm) await props.onBeforeConfirm();
      handleClose();
      if (props.onOk) props.onOk();
    }
    function handleCancel() {
      handleClose();
      if (props.onCancel) props.onCancel();
    }
    return {
      handleClose,
      handleCloseOnMask,
      handleConfirm,
      handleCancel
    };
  }
});
</script>

<style lang="scss" scoped>
.joy-dialog {
  box-sizing: border-box;
}

.joy-dialog-wrapper {
  position: fixed;
  top: 200px;
  left: 50%;
  min-width: 520px;
  transform: translate(-50%, -50%);
  z-index: 1001;
}

.joy-dialog-header {
  display: flex;
  justify-content: space-between;
  padding: 0 24px;
  background: #23232e;
  border-bottom: 1px solid #17171f;
}

.joy-dialog-title {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.85);
}

.joy-dialog-content {
  box-sizing: border-box;
  padding: 24px;
  font-size: 14px;
  background: #23232e;
}

.joy-dialog-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 50px;
  padding: 0 24px;
  border-top: 1px solid #17171f;
  background: #23232e;
}

.joy-dialog-btn {
  padding: 0 15px;
  height: 32px;
  margin-left: 15px;
  color: rgba(255, 255, 255, 0.85);
  background: #444457;
  border: none;
  outline: none;
  cursor: pointer;
}

.joy-dialog-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1000;
}
</style>
