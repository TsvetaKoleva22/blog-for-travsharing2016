
const kinveyBaseUrl = "https://baas.kinvey.com/";
const kinveyAppKey = "kid_SkTj4va9";
const kinveyAppSecret = "aedfdbc6ec1b429986d37b0056533fa9";

function showHideMenuLinks() {
    $('#index').show();
    if (sessionStorage.getItem('authToken') == null) {
        $('#login').show();
        $('#register').show();
        $('#newPost').hide();
        $('#listAll').hide();
        $('#logout').hide();
    }
    else {
        $('#login').hide();
        $('#register').hide();
        $('#newPost').show();
        $('#listAll').show();
        $('#logout').show();
        $('#logout').show();
    }
}
function showPopup(type, text, position) {

    function showSuccessPopup(text, position) {
        noty({
            text: text,
            timeout: 2000,
            layout: 'top',
            type: 'success'
        });
    }

    function showInfoPopup(text, position) {
        noty({
            text: text,
            timeout: 1000,
            layout: 'top',
            type: 'information'
        });
    }
    
    function showErrorPopup(text, position) {
        noty({
            text: text,
            timeout: 2000,
            layout: 'top',
            type: 'error'
        });
    }

    switch (type) {
        case 'success':
            showSuccessPopup(text, position);
            break;
        case 'info':
            showInfoPopup(text, position);
            break;
        case 'error':
            showErrorPopup(text, position);
            break;
    }
}
$(function () {
    showHideMenuLinks();

    if (sessionStorage.getItem('authToken') != null) {
        listAdventures();
    }

    $('#formLogin').submit(function (e) {
        e.preventDefault();
        login();
    });
    $('#formRegister').submit(function (e) {
        e.preventDefault();
        register();
    });
    $('#formPost').submit(function (e) {
        e.preventDefault();
        addNewPost();
    });

    $(document).on({
        ajaxStart: showPopup('info', 'Loading...')
    });
<<<<<<< HEAD
})
=======
});
>>>>>>> origin/master
function login() {
    const kinveyLoginUrl = kinveyBaseUrl + 'user/' + kinveyAppKey + '/login';
    const kinveyAuthHeaders = {
        'Authorization': 'Basic ' + btoa(kinveyAppKey + ':' + kinveyAppSecret)
    };
    let userData = {
        username: $('#username').val(),
        password: $('#password').val()
    };
    $.ajax({
        method: 'POST',
        url: kinveyLoginUrl,
        headers: kinveyAuthHeaders,
        data: userData,
        success: success,
        error: handleAjaxError
    });
    function success(response) {
        let userAuth = response._kmd.authtoken;
        sessionStorage.setItem('authToken', userAuth);
<<<<<<< HEAD
        showPopup('success', 'Loading success');
=======
        showPopup('success', 'Login successful.');
>>>>>>> origin/master
        setTimeout(function () {
            window.location.href = 'index.html';
        }, 2000);
    }
}
function handleAjaxError(response) {
    let errorMsg = JSON.stringify(response);
    if (response.readyState === 0) {
        errorMsg = 'Cannot connect due to network error.';
    }
    if (response.responseJSON && response.responseJSON.description) {
        errorMsg = response.responseJSON.description;
    }
    showPopup('error', errorMsg);
}
function register() {
    const kinveyRegisterUrl = kinveyBaseUrl + 'user/' + kinveyAppKey + '/';
    const kinveyAuthHeaders = {
        'Authorization': 'Basic ' + btoa(kinveyAppKey + ':' + kinveyAppSecret)
    };
    let userData = {
        username: $('#usernameReg').val(),
        password: $('#passwordReg').val(),
    };

    if ($('#passwordReg').val() != $('#confirm-password').val()) {
        showPopup('error',"Password don't match");
        return;
    }
    if (($('#usernameReg').val().length < 3)){
        showPopup('error',"Username must be at least 3 symbols");
        return;
    }
    if (($('#passwordReg').val().length < 3)){
        showPopup('error',"Password must be at least 3 symbols");
        return;
    }
    $.ajax({
        method: 'POST',
        url: kinveyRegisterUrl,
        headers: kinveyAuthHeaders,
        data: userData,
        success: registerSuccess,
        error: handleAjaxError

    });
    function registerSuccess(response) {
        let userAuth = response._kmd.authtoken;
        sessionStorage.setItem('authToken', userAuth);
<<<<<<< HEAD
        showPopup('success', 'User registration successful!');
=======
        showPopup('success', 'User registration successful.');
>>>>>>> origin/master
        setTimeout(function () {
            window.location.href = 'index.html';
        }, 2000);
    }
}

function listAdventures() {
    $('.articles').empty();

    const kinveyBooksUrl = kinveyBaseUrl + "appdata/" + kinveyAppKey + "/travels";
    const kinveyAuthHeaders = {
        'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken')
    };

    $.ajax({
        method: "GET",
        url: kinveyBooksUrl,
        headers: kinveyAuthHeaders,
        success: loadAdvSuccess,
        error: handleAjaxError
    });
    
    function loadAdvSuccess(kinvey) {
        kinvey.sort(function (elem1, elem2) {
            let date1 = new Date(elem1._kmd.ect);
            let date2 = new Date(elem2._kmd.ect);
            return date2 - date1;
        });
<<<<<<< HEAD

=======
        
>>>>>>> origin/master
        let i = 0;
        for (let post of kinvey) {
            let li = $('<li>').append($('<div class="dot">&nbsp;</div>'),
                $('<h3' + ' class="artTitle">').text(post.title),
                $('<p' + ' class = "artDestination">').text(post.destination),
                $("<p" + " class='artSubtitle'>").text("Posted by: " + post.author + " on " + post.datee),
                $('<p class="artContent">').text(post.adventure));
            $('.articles').append(li);

            if (i < 3) {
                $('#welcome-text').hide();
                $('.short-article').append(li);
            }
            i++;
        }
        showRecentPost(kinvey,2);
    }
}
function showRecentPost(kinvey,n){
    let i=0;
    for  (let post of kinvey) {

        let shortLi = $('<li class="single-recent-post">').text(post.title);
        $('.recent-post-list').append(shortLi);
        if( i == n){
            break;
        }
    }
}
// <a href="list-all.html" id="listAll">
//         <li class="single-menu-element">List all</li>
//     </a>

function addNewPost(data) {
    const kinveyBooksUrl = kinveyBaseUrl + 'appdata/' + kinveyAppKey + '/travels';
    const kinveyAuthHeaders = {
        'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken')
    };
    let advDate = moment().format('Do MMMM YYYY');
<<<<<<< HEAD
=======
    //$('#author').val(data.username);
>>>>>>> origin/master

    let postData = {
        title: $('#title').val(),
        author: $('#author').val(),
        destination: $('#destination').val(),
        adventure: $('#adventure').val(),
        datee: advDate
    };

    $.ajax({
        method: 'POST',
        url: kinveyBooksUrl,
        headers: kinveyAuthHeaders,
        data: postData,
        success: addSuccess,
        error: handleAjaxError
    });
    function addSuccess(response) {
        showPopup('success', 'Adventure added successfully.');
        setTimeout(function () {
            window.location.href = 'index.html';
        }, 2000);
    }
}
function logout() {
    sessionStorage.clear();
    showHideMenuLinks()
}

















