// ==UserScript==
// @name         Alle Checkboxen für Ausbildungsnachweise aktivieren
// @namespace    https://github.com/jhoffmannpxc
// @version      1.0.1
// @description  Fügt einen Button in der Legende hinzu, um alle Checkboxen auf der Seite der Ausbildungsnachweise anzuklicken
// @author       Julian Hoffmann
// @match        https://cl1.vplan.de/pxc/berichtsheft/BerichtUebersicht.xhtml*
// @grant        none
// @updateURL    https://jhoffmannpxc.github.io/userscripts/vplan/nachweise/userscript.user.js
// @downloadURL  https://jhoffmannpxc.github.io/userscripts/vplan/nachweise/userscript.user.js
// @homepageURL  https://jhoffmannpxc.github.io/userscripts/vplan/nachweise/
// @supportURL   https://github.com/jhoffmannpxc/userscripts/issues
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

    // Funktion zum Erstellen und Einfügen des Buttons in die Legende
    function createButtonInLegend() {
        const legend = document.getElementById('legend');
        if (!legend) return;

        const button = document.createElement('button');
        button.textContent = 'Alle Checkboxen aktivieren';
        button.style.marginLeft = 'auto';
        button.style.marginTop = '10px';
        button.style.display = 'block';
        button.style.padding = '8px 12px';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';
        button.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
        button.style.float = 'right';

        button.addEventListener('click', clickAllCheckboxes);

        // Button am Ende der Legende einfügen
        legend.appendChild(button);
    }

    // Button nach dem Laden der Seite einfügen
    window.addEventListener('load', () => {
        createButtonInLegend();
    });
})();
