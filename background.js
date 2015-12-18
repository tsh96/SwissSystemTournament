/**
 * Created by user on 21/11/2015.
 */

chrome.app.runtime.onLaunched.addListener(function () {
    chrome.app.window.create('Swissboard.html', {
        'id': "Swissboard.html",
        'outerBounds': {
            'width': 400,
            'height': 500
        }
    });
});