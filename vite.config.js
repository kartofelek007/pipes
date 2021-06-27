import babel from "vite-babel-plugin";

export default {
    root: "",
    base: "",
    server: {
        port : 5555
    },
    plugins: [
        babel(),
    ],
}
