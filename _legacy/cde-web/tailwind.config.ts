import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#003399",
                accent: "#FFCC00",
                "background-light": "#f5f6f8",
                "background-dark": "#0f1623",
            },
        },
    },
    plugins: [],
};
export default config;
