var scShoppingCartServerURL = "http://localhost/carts";
var scTempUserId = "anuj";

var scSelectedCartIndex = 0;

function scCartSelectionChanged(e){
    scSelectedCartIndex =  parseInt(e.target.id);
    var event = new Event('productsloaded');
    document.dispatchEvent(event);
}


function scSendRequest(strType, strUrl, productData, callback){
    $.ajax({
            type: strType,
            url: strUrl, 
            data: productData,
            error: function(xhr, status, error) {
                console.log("Error While Adding Product to cart ", xhr.responseText);
                callback(true);
             },
            success: function(result) {
                console.log("Response Arrived !!!!!!!!!", result);
                callback(true);
            },
            dataType: "json"
        });
}