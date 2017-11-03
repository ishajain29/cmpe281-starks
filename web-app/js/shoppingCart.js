var scShoppingCartServerURL = "http://localhost/carts";
var scTempUserId = "anuj";

var scSelectedCartIndex = 0;

function scCartSelectionChanged(e){
    scSelectedCartIndex =  parseInt(e.target.id);
    var event = new Event('productsloaded');
    document.dispatchEvent(event);
}
