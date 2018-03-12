// ==UserScript==
// @name         Download images from vsco.co
// @namespace    http://www.dieterholvoet.com
// @version      1.2.2
// @description  Adds download buttons for the full-resolution images to thumbnails all over the site.
// @author       Dieter Holvoet
// @match        *://vsco.co/*
// @grant        GM_download
// @grant        GM_info
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js
// @require      https://bowercdn.net/c/jquery-observe-2.0.2/jquery-observe.js
// ==/UserScript==

(function() {
    'use strict';

    var itemSelectors = '.MediaImage';

    $(document.head).append('<style> .dl-btn { position: absolute; right: 15px; bottom: 15px; margin-right: 0 !important; background-color: white; transform: translateY(4rem); transition: transform .2s ease-in-out; } .relative { overflow: hidden } .relative:hover .dl-btn { transform: none; } </style>');

    $(document.body).observe('childList subtree', handleSubtreeChange);

    function handleSubtreeChange(e) {
        e.addedNodes.forEach(function(addedNode) {
            if ($(addedNode).is(itemSelectors)) {
                appendButton(addedNode);
            } else {
                $(addedNode).find(itemSelectors).each(function(i, item) {
                    appendButton(item);
                });
            }
        });
    }

    function appendButton(item) {
        if($(item).find('.dl-btn').length) {
            return;
        }

        var url = $(item).find('img').attr('src');

        $(item).find('.relative').append(makeButton(url));
    }

    function download(url) {
        url = url.split('?')[0];
        if (!url.startsWith('http')) {
            url = window.location.protocol + (url.startsWith('//') ? '' : '//') + url;
        }

        var fileNameParts = url.split('/');
        var fileName = fileNameParts[fileNameParts.length - 1];

        var options = {
            url: url,
            name: fileName,
            onerror: function (e) {
                console.error('%c' + GM_info.script.name + '%c: Download failed. Reason: ' + e.error, 'font-weight: bold', 'font-weight: normal');
            }
        };

        GM_download(options);
    }

    function makeButton(url) {
        var $btn = $('<button class="nav-getAppBtn Nav-getApp btn dl-btn">Download</button>').attr('href', url.split("?")[0]);

        $btn.on('click', function(e) {
            e.preventDefault();
            download(url);
        });

        return $btn;
    }
})();
