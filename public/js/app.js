'use strict';

// dependencies
window.$ = window.jQuery = require('jquery');
require('bootstrap');

// css
require('./../css/style.css');

// Contact class
function Contact(name, email, number) {
    this.name = name;
    this.email = email;
    this.number = number;
    this.id = $.now();
}

// main
$(document).ready(main);

function main() {

    // refresh contact list
    refreshContactsView();

    // add new contact
    $('.table').on('click', '#add-contact-btn', addContactBtnCb);

    // delete contact
    $('.table').on('click', '.delete-contact-btn', deleteBtnCb);

    
    //////////////////
    
    // add contact button cb
    function addContactBtnCb() {
        var newContact = {};
        var ajaxSettings = {};

        newContact = new Contact(
            $('input#new-name').val(),
            $('input#new-email').val(),
            $('input#new-number').val()
        );

        ajaxSettings = {
            type: 'POST',
            data: JSON.stringify(newContact),
            contentType: 'application/json',
            url: 'http://localhost:3000/add-contact',
            success: ajaxPostSuccessCb,
            error: ajaxPostErrorCb
        };

        $.ajax(ajaxSettings);

        //////////////////
        
        function ajaxPostSuccessCb(data) {
            refreshContactsView();
        }

        function ajaxPostErrorCb(err) {
            console.log(err);
        }
    }
    
    // delete contact button cb 
    function deleteBtnCb() {
        var id = $(this).attr('id');
        var ajaxSettings = {};

        ajaxSettings = {
            type: 'DELETE',
            url: '/delete/' + id,
            success: ajaxDeleteSuccessCb,
            error: ajaxDeleteErrorCb
        };

        $.ajax(ajaxSettings);

        //////////////////
        
        function ajaxDeleteSuccessCb(res) {
            console.log('Deleting successfull.');
            refreshContactsView();
            
        }
        
        function ajaxDeleteErrorCb(err) {
            console.error(err.responseText);
        }
    }
}

function refreshContactsView() {
    var ajaxSettings = {};

    ajaxSettings = {
        type: 'GET',
        contentType: 'application/json',
        url: 'http://localhost:3000/contact-list',
        success: ajaxGetSuccessCb,
        error: ajaxGetErrorCb
    };

    $.ajax(ajaxSettings);

    //////////////////
    
    function ajaxGetSuccessCb(data) {
        showContactList(data);
    }

    function ajaxGetErrorCb(err) {
        console.log(err);
    }

    // DOM manipulation
    function showContactList(contactList) {
        var contactListHtml = '';

        for (var i = 0; i < contactList.length; i++) {
            contactListHtml +=
                '\n' +
                '<tr class="contact-list">' +
                '   <td>' + contactList[i].name + '</td>' +
                '   <td>' + contactList[i].email + '</td>' +
                '   <td>' + contactList[i].number + '</td>' +
                '   <td>' +
                '       <button type="submit" class="btn btn-danger delete-contact-btn" id="' + contactList[i].id + '">Delete</button>' +
                '   </td>' +
                '</tr>';
        }

        $('.contact-list').remove();
        $('tbody').append(contactListHtml);
    }
}