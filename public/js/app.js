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
$(document).ready(documentReadyCb);

function documentReadyCb() {

    // refresh page / show existing contacts
    refreshContactsView();

    // add new contact
    $('#add-contact-btn').click(addContactBtnCb);

    // delete contact
    $('.table').on('click', '.btn-danger', deleteBtnCb);

    //////////////////
    
    // add contact button cb
    function addContactBtnCb() {
        var newContact = {};
        var ajaxObj = {};

        newContact = new Contact(
            $('input#new-name').val(),
            $('input#new-email').val(),
            $('input#new-number').val()
        );

        ajaxObj = {
            type: 'POST',
            data: JSON.stringify(newContact),
            contentType: 'application/json',
            url: 'http://localhost:3000/add-contact',
            success: ajaxPostSuccessCb,
            error: ajaxPostErrorCb
        };

        $.ajax(ajaxObj);

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
        var ajaxObj = {};

        ajaxObj = {
            type: 'DELETE',
            url: '/delete/' + id,
            success: ajaxDeleteResponseCb
        };

        $.ajax(ajaxObj);

        //////////////////
        
        function ajaxDeleteResponseCb(res) {
            if (res === 'ok') {
                console.log('Deleting successfull.');
                refreshContactsView();
            } else {
                console.log('Deleting did not work: ' + res);
            }
        }
    }
}

function refreshContactsView() {
    var ajaxObj = {};

    ajaxObj = {
        type: 'GET',
        contentType: 'application/json',
        url: 'http://localhost:3000/contact-list',
        success: ajaxGetSuccessCb,
        error: ajaxGetErrorCb
    };

    $.ajax(ajaxObj);

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
                '       <button type="submit" class="btn btn-danger" id="' + contactList[i].id + '">Delete</button>' +
                '   </td>' +
                '</tr>';
        }

        $('.contact-list').remove();
        $('tbody').append(contactListHtml);
    }
}