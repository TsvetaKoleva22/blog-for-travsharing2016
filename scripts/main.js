/**
 * Created by kaka on 8/22/2016.
 */

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
// function showInfo(m) {
//     $('#infoBox').text(m);
//     $('#infoBox').show();
//     setTimeout(function () {
//         $('#infoBox').fadeOut()
//     }, 3000);
// }
//
// function showError(errorMsg) {
//     $('#errorBox').text("Error: " + errorMsg);
//     $('#errorBox').show();
// }
$(function () {
    showHideMenuLinks();
    // $('#index').show();

    // $('#index').click(showHomeView);
    // $('#login').click(showLoginView);
    // $('#register').click(showRegisterView);
    // $('#listAll').click(listBooks);
    // $('#newPost').click(showCreateBookView);
    // $('#logout').click(logout);

    $('#formLogin').submit(function(e) { e.preventDefault(); login(); });
    $('#formRegister').submit(function(e) { e.preventDefault(); register(); });
    $('#formPost').submit(function(e) { e.preventDefault(); addNewPost(); });

    // $(document).on({
    //     ajaxStart: function () {$('#loadingBox').show()},
    //     ajaxStop: function () {$('#loadingBox').hide()}
    // });
});

// function showHomeView() {
//     showView('viewHome');
// }
// function showLoginView() {
//     showView('viewLogin')
// }
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
        window.location.href = 'index.html';
        // showInfo('Login successful.');
        // showHideMenuLinks();
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
    // showError(errorMsg);
}
// function showRegisterView() {
//     showView('viewRegister')
// }
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
        // showInfo('User registration successful.');
        // showHideMenuLinks();
    }
}
function listAdventures() {
    $('.articles').empty();
    // showView('viewBooks');

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
        for(let post of kinvey){
            let li = $('<li>').append($('<div class="dot">&nbsp;</div>'), $('<h3' +
            ' class="artTitle">').text(post.title), $("<p" + " class='artSubtitle'>").text("Posted by: " + post.author), $('<p class="artContent">').text(post.adventure));
            $('.articles').append(li);
        }
    // <div class="dot">&nbsp;</div>
    //     <h3 class="artTitle">Zaglavie</h3>
    //         <p class="artSubtitle"></p>
    //         <p class="artDestination"></p>
    //         <p class="artContent"></p>
    //    
    //    
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
        // listBooks();
        // showInfo('Post created.')
    }
    function dontWork(response) {
        // alert('JSON.stringify(response)');
        alert(JSON.stringify(response));
    }
}
function logout() {
    sessionStorage.clear();
    showHideMenuLinks()
}















