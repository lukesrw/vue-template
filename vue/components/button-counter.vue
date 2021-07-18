<template id="button-counter">
    <div>
        <button v-on:click="count++">
            I've been clicked {{ count }} times!
        </button>
    </div>
</template>

<script>
import Vue from "vue";

export default Vue.component("button-counter", {
    template: "#button-counter",
    data() {
        return {
            count: 0
        };
    }
});
</script>
