var scShoppingCartServerURL = "http://54.183.205.180/cart";

var scSelectedCartIndex = 0;

function scGetUserShoppingCart(){
    $.ajax({
        url: scShoppingCartServerURL + '/user/anuj',
        error: function(xhr, status, error) {
           console.log(xhr.responseText);
        },
        success: function(data) {

        },
        dataType: "json"
     });
}

function scCartSelectionChanged(e){
    scSelectedCartIndex =  parseInt(e.target.id);
    var event = new Event('productsloaded');
    document.dispatchEvent(event);
}
