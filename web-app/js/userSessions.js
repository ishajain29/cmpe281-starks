var usServerURL = "http://54.183.241.202:3000/user";
var alServerURL = "http://13.57.108.136/userlogs";
var webServerURL = "http://" + window.location.hostname + window.location.port;

function validateLogin(){
    var email = $("#email").val();
    var password = $("#password").val();

    console.log(email);
    console.log(password);

    loginData = {
        email : email,
        password: password
    }

    $.ajax({
        type: "POST",
        url: usServerURL + "/login", 
        data: loginData,
        error: function(xhr, status, error) {
            console.log("Error", error);
         },
        success: function(result) {
            console.log("Response Arrived !!!!!!!!!", result);
            localStorage.setItem("userid", result.userid);
            localStorage.setItem("email", result.email);
            localStorage.setItem("firstname", result.firstname);
            localStorage.setItem("lastname", result.lastname);

            activitydata = {
                activity : "Logged In",
                userid : result.userid
            }

            $.ajax({
                type: "POST",
                url: alServerURL,
                data: activitydata,
                error: function(xhr, status, error) {
                    console.log("Error", error);
                },
                success: function(result) {
                },
                dataType: "json"
            });
            window.location.href = webServerURL + "/";
        },
        dataType: "json"
    });
}

function logout(){
    localStorage.setItem("userid", "");
    localStorage.setItem("email", "");
    localStorage.setItem("firstname", "");
    localStorage.setItem("lastname", "");
    window.location.href = webServerURL + "/";
}

function register(){
    var email = $("#email").val();
    var password = $("#password").val();
    var firstname = $("#firstname").val();
    var lastname = $("#lastname").val();

    registerData = {
        email : email,
        password: password,
        firstname: firstname,
        lastname: lastname
    }

    console.log(registerData);

     $.ajax({
        type: "POST",
        url: usServerURL + "/register", 
        data: registerData,
        error: function(xhr, status, error) {
            console.log("Error", error);
         },
        success: function(result) {
            console.log("Response Arrived !!!!!!!!!", result);
            activitydata = {
                activity : "Registered",
                userid : result.userid
            }
            $.ajax({
                type: "POST",
                url: alServerURL,
                data: activitydata,
                error: function(xhr, status, error) {
                    console.log("Error", error);
                },
                success: function(result) {
                },
                dataType: "json"
            });
            window.location.href = webServerURL + "/login";
        },
        dataType: "json"
    });
}