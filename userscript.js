// ==UserScript==
// @name         Download images from vsco.co
// @namespace    http://www.dieterholvoet.com
// @version      1.2.8
// @description  Adds download buttons for the full-resolution images to thumbnails all over vsco.co
// @author       Dieter Holvoet
// @match        *://vsco.co/*
// @grant        GM_download
// @grant        GM_info
// @grant        GM_notification
// @grant        GM_getResourceText
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js
// @require      https://bowercdn.net/c/jquery-observe-2.0.2/jquery-observe.js
// @resource     styles https://raw.githubusercontent.com/DieterHolvoet/userscript-vsco-downloader/master/styles.css
// ==/UserScript==

(function () {
    'use strict';

    var itemSelectors = '.MediaImage, .article-image';

    $(document.head).append(
        $('<style />').text(GM_getResourceText('styles'))
    );

    $(document.body).observe('childList subtree', handleSubtreeChange);

    $(document.body).ready(handleDocumentReady);

    function handleDocumentReady(e) {
        $(itemSelectors).each(function (i, $item) {
            appendButton($item);
        });
    }

    function handleSubtreeChange(e) {
        e.addedNodes.forEach(function (addedNode) {
            if ($(addedNode).is(itemSelectors)) {
                appendButton(addedNode);
            } else {
                $(addedNode).find(itemSelectors).each(function (i, item) {
                    appendButton(item);
                });
            }
        });
    }

    function appendButton(item) {
        if ($(item).find('.dl-btn').length) {
            return;
        }

        var $img = $(item).find('img');
        var url = $img.attr('src');

        $img.parent()
            .addClass('relative')
            .append(makeButton(url));
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
                logError('Download failed. Reason: ' + e.error);
            }
        };

        GM_download(options);
    }


    function logError(message) {
        var details = {
            title: GM_info.script.name,
            text: message,
        };

        GM_notification(details);
        console.error('%c' + GM_info.script.name + '%c: ' + message, 'font-weight: bold', 'font-weight: normal');
    }

    function makeButton(url) {
        var $btn = $('<button class="dl-btn">Download</button>');

        $btn.on('click', function (e) {
            e.preventDefault();
            download(url);
        });

        return $btn;
    }
})();
