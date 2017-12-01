var scShoppingCartServerURL = "http://54.183.237.157/carts";
//var scShoppingCartServerURL = "http://localhost/carts";
var scTempUserId = "anuj";

var scSelectedCartIndex = 0;
var scCartModel;

function scCartSelectionChanged(e){
    scSelectedCartIndex =  parseInt(e.target.id);
    var event = new Event('productsloaded');
    document.dispatchEvent(event);
}

function scCreateNewSharedCart(){
    var strCartName = document.getElementById("scNewCartInput").value;
    if(strCartName == "") return;

    var url = scShoppingCartServerURL + "/shared";
    var data = {
        "reqUserId" : localStorage.getItem("email"),
        "adminId"	: localStorage.getItem("email"),
        "cartName"  : strCartName
    };
    scSendRequest("POST", url, JSON.stringify(data), scNewCartCreated);
}

function scSendRequest(strType, strUrl, productData, callback){
    $.ajax({
            type: strType,
            url: strUrl, 
            data: productData,
            error: function(xhr, status, error) {
                console.log("Error in sending request: ", error);
                callback(true);
             },
            success: function(result) {
                console.log("Response Arrived !!!!!!!!!", result);
                callback(true, result);
            },
            dataType: "json",
            timeout: 5000
        });
}


function scSendRequestUpdateItemUserCart(userId, product, callback){
    
    var url = scShoppingCartServerURL + "/user/" + userId + "/product/" + product.id;
    var data = {  
        "reqUserId" : localStorage.getItem("email"),        
        "id"		: product.id,
        "quantity"  : product.quantity,
        "name"      : product.item_name,
        "price"     : product.amount
    };
    scSendRequest("PUT", url, JSON.stringify(data), callback);
}

function scSendRequestAddItemUserCart(userId, product, callback){
    
    var url = scShoppingCartServerURL + "/user/" + userId + "/product";
    var data = {  
        "reqUserId" : localStorage.getItem("email"),        
        "id"		: product.id,
        "quantity"  : product.quantity,
        "name"      : product.item_name,
        "price"     : product.amount
    };
    scSendRequest("POST", url, JSON.stringify(data), callback);
}

    

function scSendRequestAddItemSharedCart(cartId, product, callback){
    
    var url = scShoppingCartServerURL + "/shared/" + cartId + "/product";
    var data = {
        "reqUserId" : localStorage.getItem("email"),        
        "id"		: product.id,
        "quantity"  : product.quantity,
        "name"      : product.item_name,
        "price"     : product.amount,
        "addedBy"   : localStorage.getItem("email")
    };
    scSendRequest("POST", url, JSON.stringify(data), callback);
}


function scSendRequestUpdateItemSharedCart(cartId, product, callback){
    var url = scShoppingCartServerURL + "/shared/" + cartId + "/product/" + product.id;
    var data = { 
        "reqUserId" : localStorage.getItem("email"),        
        "id"		: product.id,
        "quantity"  : product.quantity,
        "name"      : product.item_name,
        "price"     : product.amount,
        "addedBy"   : localStorage.getItem("email")
    };
    scSendRequest("PUT", url, JSON.stringify(data), callback);
};

function scReloadCart(bSuccessful){
    if(bSuccessful){
        //self.fire('add', idx, product, isExisting);
        var event = new Event('cartReloadRequired');
        document.dispatchEvent(event);
    }
}

function scNewCartCreated(bSuccessful){
    if(bSuccessful){
        scDialogCreateNewCart.style.display = "none";
        scSelectedCartIndex = scCartModel.length;
        scReloadCart(true);        
    }
}

function scSendRequestPlaceOrderUserCart(userId, callback){
    var url = scShoppingCartServerURL + "/user/" + userId + "/order";
    var data = { 
        "reqUserId" : localStorage.getItem("email")
    };
    scSendRequest("POST", url, JSON.stringify(data), callback);
}

function scSendRequestPlaceOrderSharedCart(cartId, callback){
    var url = scShoppingCartServerURL + "/shared/" + cartId + "/order";
    var data = { 
        "reqUserId" : localStorage.getItem("email")
    };
    scSendRequest("POST", url, JSON.stringify(data), callback);
}

function scSendRequestGetCartDetails(cartId, callback){
    var url = scShoppingCartServerURL + "/shared/" + cartId;
    scSendRequest("GET", url, JSON.stringify({}), callback);
}

function  scSendRequestDeleteUserFromCart(cartId, userId, callback){
    var url = scShoppingCartServerURL + "/shared/" + cartId + "/user/" + userId;
    var data = { 
        "reqUserId" : localStorage.getItem("email")
    };
    scSendRequest("DELETE", url, JSON.stringify(data), callback);
}

function scSendRequestAddUserSharedCart(cartId, strEmail, callback){
    var url = scShoppingCartServerURL + "/shared/" + cartId + "/user";
    var data = [strEmail];
    scSendRequest("POST", url, JSON.stringify(data), callback);
}
