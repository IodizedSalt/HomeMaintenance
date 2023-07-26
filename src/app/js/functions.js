function addElement(){
const node = document.createElement("div")
const textnode = document.createTextNode("Clicked");
node.appendChild(textnode);
document.getElementsByTagName("body")[0].appendChild(node)
}
