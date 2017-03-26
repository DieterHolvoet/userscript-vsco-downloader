// ==UserScript==
// @name         Download images from vsco.co
// @namespace    http://www.dieterholvoet.com
// @version      1.0
// @description  Adds download buttons for the full-resolution images to thumbnails all over the site.
// @author       Dieter Holvoet
// @match        vsco.co/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js
// @require      https://bowercdn.net/c/jquery-observe-2.0.2/jquery-observe.js
// ==/UserScript==

(function() {
    'use strict';

    var parentSelectors = '.grid-column, .grid-row, .grid-item, .MasonryGridLayout-column',
        itemSelectors = '.grid-item, .media-item, .MediaThumbnail';

    $(document.head).append('<style> .dl-btn { position: absolute; right: 15px; bottom: 15px; margin-right: 0 !important; background-color: white; transform: translateY(4rem); transition: transform .2s ease-in-out; } .relative { overflow: hidden } .relative:hover .dl-btn { transform: none; } </style>');

    $(document.body).observe('childList subtree', handleSubtreeChange);

    function handleSubtreeChange(e) {
        Array.from(e.addedNodes).forEach(function(addedNode) {
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

    function makeButton(url) {
        var $btn = $('<a download class="nav-getAppBtn Nav-getApp btn dl-btn">Download</a>').attr('href', url.split("?")[0]);

        $btn.on('click', function(e) {
            e.stopPropagation();
        });

        return $btn;
    }
})();