var stk = require('/cms/lib/stk/stk.js');

// Module specific utilities, not suitable for STK

/**
 * Returns URL for a selected page, unless a hardcoded external URL is passed. Returns default URL if no page or link. Used on all parts
 * with page picker for a link.
 * @param {Content} content key of the selected landing page, if one was selected. config['linkPage']
 * @param {String} Hardcoded URL for external link. Overrides the page.
 * @param {Content} Content key of link anchor content.
 * @return {String} Returns the URL
 */
exports.getLinkUrl = function(contentKey, url, anchorContentKey) {
    var returnUrl = null;

    if (url) {
        returnUrl = url;
    }
    else if (contentKey) {
        var result = execute('content.get', {
           key: contentKey
        });
        if (result) {
            returnUrl = execute('portal.pageUrl', {
               path: result._path
            });
            if (anchorContentKey) {
                var anchor = exports.getContentAnchor(anchorContentKey);
                returnUrl += anchor ? '#' + anchor : null;
            }
        }
    }
    return returnUrl;
};

exports.getContentAnchor = function(contentKey) {
    return stk.content.getProperty(contentKey, '_name');
};

exports.getFormattedDate = function(date) {
    var currentDate = new Date();
    var dateString = exports.getMonthName(date);
    dateString += ' ' + date.getDate();

    if (currentDate.getFullYear() != date.getFullYear()) {
        dateString += ', ' + date.getFullYear();
    }
    return dateString;
};


exports.getMonthName = function(date) {

    var month = date.getMonth();
    var monthName;

    switch (month) {
        case 0 : monthName = 'January';
        break;
        case 1 : monthName = 'February';
        break;
        case 2 : monthName = 'March';
        break;
        case 3 : monthName = 'April';
        break;
        case 4 : monthName = 'May';
        break;
        case 5 : monthName = 'June';
        break;
        case 6 : monthName = 'July';
        break;
        case 7 : monthName = 'August';
        break;
        case 8 : monthName = 'September';
        break;
        case 9 : monthName = 'October';
        break;
        case 10 : monthName = 'November';
        break;
        case 11 : monthName = 'December';
        break;
    }

    return monthName;
};