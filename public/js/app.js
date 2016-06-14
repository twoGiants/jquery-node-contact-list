'use strict';

// dependencies
window.$ = window.jQuery = require('jquery');
require('bootstrap');
require('./../css/style.css');

// Contact class
function Contact(name, email, number) {
    this.name   = name;
    this.email  = email;
    this.number = number;
    this.id     = $.now();
}

// Main
$(document).ready(documentReadyCb);

function documentReadyCb() {
    
    // send data to back end
    $('#submit-btn').click(submitBtnCb);
    
    $( ".table" ).on( "click", '.btn-danger', function() {
      console.log( $( this ).attr('id'));
    });
    
    refreshView();
    
}

function refreshView() {
    var ajaxObj = {};
    
    ajaxObj = {
        type: 'GET',
        contentType: 'application/json',
        url: 'http://localhost:3000/contact-list',
        success: ajaxGetSuccessCb,
        error: ajaxGetErrorCb
    };

    $.ajax(ajaxObj);
}

// ajax callbacks
function ajaxGetSuccessCb(data) {
    showContactList(data);
}

function ajaxGetErrorCb(err) {
    log(err);
}

function ajaxPostSuccessCb(data) {
    refreshView();
}

function ajaxPostErrorCb(err) {
    log(err);
}

// button callbacks
function submitBtnCb(event) {
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

// helper
function log(data) {
    console.log(data);
}