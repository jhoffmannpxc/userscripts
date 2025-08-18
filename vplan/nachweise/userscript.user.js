// ==UserScript==
// @name         Alle Checkboxen für Ausbildungsnachweise aktivieren
// @namespace       https://github.com/jhoffmannpxc
// @version      1.0
// @description  Fügt einen Button hinzu, um alle Checkboxen auf der Seite der Ausbildungsnachweise anzuklicken
// @author       Julian Hoffmann
// @match        https://cl1.vplan.de/pxc/berichtsheft/BerichtUebersicht.xhtml*
// @grant        none
// @updateURL   https://jhoffmannpxc.github.io/userscripts/vplan/nachweise/userscript.user.js
// @downloadURL https://jhoffmannpxc.github.io/userscripts/vplan/nachweise/userscript.user.js
// @homepageURL     https://jhoffmannpxc.github.io/userscripts/vplan/nachweise/
// @supportURL      https://github.com/jhoffmannpxc/userscripts/issues
// ==/UserScript==

(function() {
    'use strict';

    // Funktion zum Anklicken aller Checkboxen
    function clickAllCheckboxes() {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            if (!checkbox.checked) {
                checkbox.click();
            }
        });
    }

    // Funktion zum Erstellen des Buttons
    function createButton() {
        const button = document.createElement('button');
        button.textContent = 'Alle Checkboxen aktivieren';
        button.style.position = 'fixed';
        button.style.top = '20px';
        button.style.right = '20px';
        button.style.zIndex = '9999';
        button.style.padding = '10px 15px';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';

        button.addEventListener('click', clickAllCheckboxes);
        document.body.appendChild(button);
    }

    // Button direkt nach dem Laden der Seite einfügen
    window.addEventListener('load', () => {
        createButton();
    });
})();
