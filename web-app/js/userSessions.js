var usServerURL = "http://localhost:3000/user";

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
            $('#login').hide();
            $('#logout').show();

            $.ajax({
                type: "POST",
                url: "http://localhost:3000/userlogs",
                data: "Logged In",
                error: function(xhr, status, error) {
                    console.log("Error", error);
                },
                success: function(result) {
                },
                dataType: "json"
            });
        },
        dataType: "json"
    });
}

function logout(){
    localStorage.removeItem('userid');
    localStorage.removeItem('email');
    $('#login').show();
    $('#logout').hide();
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
            window.location.href ="http://localhost:8080/login";
            $.ajax({
                type: "POST",
                url: "http://localhost:3000/userlogs",
                data: "Registered",
                error: function(xhr, status, error) {
                    console.log("Error", error);
                },
                success: function(result) {
                },
                dataType: "json"
            });
        },
        dataType: "json"
    });
}