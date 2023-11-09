import { defineConfig } from "father"

export default defineConfig({
    esm: { input: "src" },
    cjs: { input: "src" },
    prebundle: {
        deps: {}
    },
    sourcemap: true,
    targets: {
        node: 16,
        chrome: 90
    }
})
