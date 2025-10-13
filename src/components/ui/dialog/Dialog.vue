<script setup>
import { reactiveOmit } from "@vueuse/core";
import { DialogRoot, useForwardPropsEmits } from "radix-vue";

const props = defineProps({
  open: { type: Boolean, required: false },
  defaultOpen: { type: Boolean, required: false },
  modal: { type: Boolean, required: false, default: true },
});

const emits = defineEmits(["update:open"]);
const delegated = reactiveOmit(props);
const forwarded = useForwardPropsEmits(delegated, emits);
</script>

<template>
  <DialogRoot v-bind="forwarded">
    <slot />
  </DialogRoot>
</template>
