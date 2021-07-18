<template>
    <body>
        <h1>Parent</h1>

        <h2>{{ menu.name }}:</h2>
        <ul>
            <li v-for="item in menu.items" :key="item.text">
                <router-link :to="item.link">{{ item.text }}</router-link>
            </li>
        </ul>

        <h2>Route</h2>
        <router-view></router-view>
    </body>
</template>

<script>
export default {
    data() {
        return {
            menu: {
                name: "Navigation",
                items: [
                    {
                        text: "Homepage",
                        link: "/"
                    },
                    {
                        text: "Random Page",
                        link:
                            "/random-page-" +
                            (Math.floor(Math.random() * 10) + 1)
                    }
                ]
            }
        };
    }
};
</script>
