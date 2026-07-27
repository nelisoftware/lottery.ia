/** @type {import('tailwindcss').Config} */


const exposeColorsAsVariables = function ({ addBase, theme }: any) {
  function extractColorVars(colorObj: any, colorGroup = '') {
    return Object.keys(colorObj).reduce((vars, colorKey) => {
      const value = colorObj[colorKey];

      const newVars: any =
        typeof value === 'string'
          ? { [`--color${colorGroup}-${colorKey}`]: value }
          : extractColorVars(value, `-${colorKey}`);

      return { ...vars, ...newVars };
    }, {});
  }

  addBase({
    ':root': extractColorVars(theme('colors')),
  });
};


module.exports = {
  darkMode: 'class',
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './libraries/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/nelisoftware-react/dist/**/*.{js,mjs}',
  ],
  theme: {
    extend: {
      colors:{
        hoverColor:'#ffb225',
        hoverColorDark: '#d2691e',
        linkColor: '#601ffd',
        linkColorDark: '#601ffd',
        linkText: '#1c2658',
        linkTextDark: '#a3aecf',       
      },
      width:{
        sideBar: '250px',
      },
      height:{
        logo: '30px',
        areaLogo: '35px',
      },

      fontSize: {
        nameSystem: '22px',
      }
    },
  },
  plugins: [exposeColorsAsVariables],
}