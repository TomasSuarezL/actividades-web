import $ from 'jquery';
import '../static/app.css';
import printMe from './print.js';

$(document).ready(function() {
    
    $("h2").addClass('hello');

    var btn = document.createElement('button');

    btn.innerHTML = 'Click me and check the console!';
    btn.onclick = printMe;

    document.body.appendChild(btn);

});





