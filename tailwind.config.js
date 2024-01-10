module.exports = {
    mode: "jit",
    purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            fontWeight: {
                regular: 400,
            },
            colors:{
                ps_bright_green:'#5FEEC4',
                ps_palm_green: '#66A898',
                ps_green:'#4AAA80',
                ps_blue_green:'#32A59E',
                ps_dark_blue:'#0F63B7',
                ps_purple:'#7E45FF',
            }
        },
        fontFamily: {
            museosans: "MuseoSans",
        },
    },
    variants: {
        extend: {},
    },
    plugins: [require("tailwindcss"), require("precss"), require("autoprefixer")],
};
