const randomColor = () =>{ let color = '#' + Math.floor(Math.random()*16777215).toString(16); return color; }
export default randomColor;