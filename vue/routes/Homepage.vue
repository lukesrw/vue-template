<script>
import ButtonCounter from "../components/button-counter.vue";

export default {
    components: {
        "button-counter": ButtonCounter
    }
};
</script>

<template>
    <section>
        <h1>Homepage</h1>

        <button-counter></button-counter>
    </section>
</template>
