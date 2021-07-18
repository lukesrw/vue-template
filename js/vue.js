import Vue from "vue";
import VueRouter from "vue-router";
import App from "../vue/App";
import FileNotFound from "../vue/routes/FileNotFound";
import Homepage from "../vue/routes/Homepage";

Vue.use(VueRouter);
Vue.config.devtools = true;
Vue.config.productionTip = false;

const router = new VueRouter({
    mode: "history",
    routes: [
        {
            path: "/",
            component: Homepage,
            meta: {
                title: "Homepage"
            }
        },
        {
            path: "*",
            component: FileNotFound,
            meta: {
                title: "File Not Found"
            }
        }
    ]
});

router.afterEach(to => {
    Vue.nextTick(() => {
        document.title = to.meta.title || "No Title Set";
    });
});

export default new Vue({
    el: "body",
    router: router,
    render: createElement => createElement(App)
});
