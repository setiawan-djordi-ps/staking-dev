const path = require("path");

module.exports = {
    reactStrictMode: true,
    webpack: (config) => {
        const rules = config.module.rules.find((rule) => typeof rule.oneOf === "object").oneOf.filter((rule) => Array.isArray(rule.use));

        for (const rule of rules) {
            for (const moduleLoader of rule.use) {
                if (moduleLoader.loader.includes("resolve-url-loader")) {
                    moduleLoader.options.sourceMap = false;
                }
            }
        }

        config.resolve.alias = {
            ...config.resolve.alias,
            "@": path.join(__dirname, "src"),
            "@public": path.join(__dirname, "public"),
        };

        return config;
    },
    sassOptions: {
        includePaths: [path.join(__dirname, "styles"), path.join(__dirname, "components")],
    },
};
