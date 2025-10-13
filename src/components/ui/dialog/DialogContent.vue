<script setup>
import { cn } from "@/lib/utils";
import { reactiveOmit } from "@vueuse/core";
import { DialogContent, DialogOverlay, DialogPortal, useForwardProps } from "radix-vue";

const props = defineProps({
  class: { type: null, required: false },
});

const delegated = reactiveOmit(props, "class");
const forwarded = useForwardProps(delegated);
</script>

<template>
  <DialogPortal>
    <DialogOverlay
      class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50"
    />
    <DialogContent
      :class="
        cn(
          'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-1/2 left-1/2 z-50 flex h-[80vh] max-h-[80vh] min-h-[480px] w-[90vw] max-w-xl -translate-x-1/2 -translate-y-1/2 flex-col rounded-lg border-0 bg-white p-6 shadow-lg outline-none dark:bg-zinc-900',
          props.class,
        )
      "
      v-bind="forwarded"
    >
      <slot />
    </DialogContent>
  </DialogPortal>
</template>
