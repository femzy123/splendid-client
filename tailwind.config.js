module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        transparent: "transparent",
        current: "currentColor",
        purple: {
          100: "#E4D7E1",
          200: "#D3BDCD",
          300: "#BC9BB3",
          400: "#A67A9A",
          500: "#905981",
          600: "#7A3868",
          700: "#662F57",
          800: "#512545",
          900: "#3D1C34",
        },
        brown: {
          100: "#EBE4D9",
          200: "#DED2BF",
          300: "#CDBC9F",
          400: "#BDA67F",
          500: "#AC8F5F",
          600: "#9C793F",
          700: "#826535",
          800: "#68512A",
          900: "#4E3D20",
        },
      },
    },
  },
  plugins: [],
};
