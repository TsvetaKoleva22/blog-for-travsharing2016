
const kinveyBaseUrl = "https://baas.kinvey.com/";
const kinveyAppKey = "kid_SkTj4va9";
const kinveyAppSecret = "aedfdbc6ec1b429986d37b0056533fa9";

// function showView(viewName) {
//     $('main > section').hide();
//     $('#' + viewName).show()
// }
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
    }
}
function showInfo(message) {
    $('#infoBox').text(message);
    $('#infoBox').show();
    setTimeout(function () {
        $('#infoBox').fadeOut()
    }, 3000);
}

function showError(errorMsg) {
    $('#errorBox').text("Error: " + errorMsg);
    $('#errorBox').show();
}

$(function () {
    $('main > section').hide();
    showHideMenuLinks();
    
    if (sessionStorage.getItem('authToken') != null) {
        listAdventures();
    }
    
    $('#formLogin').submit(function(e) { e.preventDefault(); login(); });
    $('#formRegister').submit(function(e) { e.preventDefault(); register(); });
    $('#formPost').submit(function(e) { e.preventDefault(); addNewPost(); });

    $(document).on({
        ajaxStart: function () {$('#loadingBox').show()},
        ajaxStop: function () {$('#loadingBox').hide()}
    });
});

function login() {
    const kinveyLoginUrl = kinveyBaseUrl + 'user/' + kinveyAppKey + '/login';
    const kinveyAuthHeaders = {
        'Authorization' : 'Basic ' + btoa(kinveyAppKey + ':' + kinveyAppSecret)
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
        success: loginSuccess,
        error: handleAjaxError
    });
    function loginSuccess(response) {
        let userAuth = response._kmd.authtoken;
        sessionStorage.setItem('authToken', userAuth);
        setTimeout(function () {
            window.location.href = 'index.html';
        }, 2000);
        showInfo('Login successful.');
    }
}
function handleAjaxError(response) {
    let errorMsg = JSON.stringify(response);
    if(response.readyState === 0){
        errorMsg = 'Cannot connect due to network error.';
    }
    if(response.responseJSON && response.responseJSON.description){
        errorMsg = response.responseJSON.description;
    }
    showError(errorMsg);
}

function register() {
    const kinveyRegisterUrl = kinveyBaseUrl + 'user/' + kinveyAppKey + '/';
    const kinveyAuthHeaders = {
        'Authorization' : 'Basic ' + btoa(kinveyAppKey + ':' + kinveyAppSecret)
    };
    let userData = {
        username: $('#usernameReg').val(),
        password: $('#passwordReg').val()
    };
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
        window.location.href = 'index.html';
        showInfo('User registration successful.');
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
    
    function calcDate(kinvey) {
        kinvey.sort(function (elem1, elem2) {
            let date1 = new Date(elem1._kmd.ect);
            let date2 = new Date(elem2._kmd.ect);
            return date2 - date1;
        })
    };
        
    function loadAdvSuccess(kinvey) {
        calcDate(kinvey);
        let i = 0;
        for (let post of kinvey) {
            let date = moment().format('Do MMMM YYYY');
            let li = $('<li>').append($('<div class="dot">&nbsp;</div>'),
                $('<h3' + ' class="artTitle">').text(post.title),
                $('<p' + ' class = "artDestination">').text(post.destination),
                $("<p" + " class='artSubtitle'>").text("Posted by: " + post.author + " on " + date),
                $('<p class="artContent">').text(post.adventure));
            $('.articles').append(li);

            if (i < 3) {
                $('#welcome-text').hide();
                $('.short-article').append(li);
            }
            i++;
        }
    }
}

//    
//     function loadBooksSuccess(data) {
//        
//         let booksTable = $('<table>').append($('<tr>').append('<th>Title</th>', '<th>Author</th>', '<th>Description</th>'));
//         for(let d of data){
//             booksTable.append($('<tr>').append($('<td>').text(d.title),
//                 $('<td>').text(d.author), $('<td>').text(d.description)))
//             ;
//         }
//         $('#books').append(booksTable);

//         // if(books.length == 0){
//         //     $('#books').text('The book library is empty.');
//         // }
//         // else{
//         //     let booksTable = $('<table>').append($('<tr>').append('<th>Title</th>', '<th>Author</th>', '<th>Description</th>'));
//         //     for(let book of books){
//         //         booksTable.append($('<tr>').append($('<td>').text(book.title),
//         //         $('<td>').text(book.author), $('<td>').text(book.description)))
//         //         ;
//         //     }
//         //     $('#books').append(booksTable);
//         // }
//         showInfo('Books loaded.');
//     }
// }
// function showCreateBookView() {
//     showView('viewCreateBook')
// }
function addNewPost() {
    const kinveyBooksUrl = kinveyBaseUrl + 'appdata/' + kinveyAppKey + '/travels';
    const kinveyAuthHeaders = {
        'Authorization' : 'Kinvey ' + sessionStorage.getItem('authToken')
    };
    let postData = {
        title: $('#title').val(),
        author: $('#author').val(),
        date: $('#date').val(),
        destination: $('#destination').val(),
        adventure: $('#adventure').val()
    };

    $.ajax({
        method: 'POST',
        url: kinveyBooksUrl,
        headers: kinveyAuthHeaders,
        data: postData,
        success: createBookSuccess,
        error: handleAjaxError
    });
    function createBookSuccess(response) {
        window.location.href = 'index.html';
        showInfo('Post created.')
    }
}
function logout() {
    sessionStorage.clear();
    showHideMenuLinks()
}















