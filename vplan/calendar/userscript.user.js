// ==UserScript==
// @name         Kalender Einträge für Outlook aus VPLAN
// @namespace       https://github.com/jhoffmannpxc
// @version      1.0.1
// @description  Erstellen von Kalendereinträgen für Outlook aus der Planungstool-Seite mit Vorschau und Zurücksetzen
// @author       Julian Hoffmann
// @match        https://cl1.vplan.de/pxc/Landing.xhtml*
// @grant        none
// @updateURL   https://jhoffmannpxc.github.io/userscripts/vplan/calendar/userscript.user.js
// @downloadURL https://jhoffmannpxc.github.io/userscripts/vplan/calendar/userscript.user.js
// @homepageURL     https://jhoffmannpxc.github.io/userscripts/vplan/calendar/
// @supportURL      https://github.com/jhoffmannpxc/userscripts/issues

// ==/UserScript==

(function() {
    'use strict';

    function extractCourses() {
        const courses = [];
        const fields = document.querySelectorAll('.kalendarPlanugsEinheit');
        fields.forEach(field => {
            const textContent = Array.from(field.childNodes)
                .filter(node => node.nodeType === Node.ELEMENT_NODE)
                .map(node => node.innerText.trim())
                .join(' ');

            if (textContent.includes('keine Planung')) {
                return;
            }

            const elements = field.children;
            const title = elements[0] ? elements[0].innerText.trim() : 'Titel nicht gefunden';
            const description = elements.length > 2 ? elements[2].innerText.trim() : 'Beschreibung nicht gefunden';
            const location = elements.length > 3 ? elements[3].innerText.trim() : 'Standort nicht gefunden';
            const participantsText = elements[elements.length - 1];
            const participantsMatch = participantsText && participantsText.innerText ? participantsText.innerText.match(/\d+/) : null;
            const participants = participantsMatch ? participantsMatch[0] : 'Teilnehmerzahl nicht gefunden';

            const dateStr = field.id.replace('planungsEinheit', '').replace('T', ' ').replace('.000', '');
            const date = new Date(dateStr);

            if (date.getDay() === 0 || date.getDay() === 6) {
                return;
            }

            courses.push({
                title,
                description,
                location,
                participants,
                date
            });
        });
        return courses;
    }

    function createOutlookICS(courses) {
        let calendarData = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Your Organization//Your Application//EN\n`;
        courses.forEach(course => {
            const startDateTime = new Date(course.date);
            const endDateTime = new Date(startDateTime.getTime() + (7.5 * 60 * 60 * 1000));
            const title = `${course.title} (${course.participants})`;
            const description = course.description;
            const location = course.location;
            const status = "gebucht";
            const uid = `${new Date().getTime()}-${Math.floor(Math.random() * 100000)}`;

            const startFormatted = startDateTime.toISOString().replace(/-|:|\.\d+/g, '').slice(0, 15) + 'Z';
            const endFormatted = endDateTime.toISOString().replace(/-|:|\.\d+/g, '').slice(0, 15) + 'Z';

            calendarData += `BEGIN:VEVENT\n`;
            calendarData += `UID:${uid}\n`;
            calendarData += `SUMMARY:${title}\n`;
            calendarData += `DESCRIPTION:${description}\n`;
            calendarData += `LOCATION:${location}\n`;
            calendarData += `DTSTART:${startFormatted}\n`;
            calendarData += `DTEND:${endFormatted}\n`;
            calendarData += `STATUS:${status}\n`;
            calendarData += `DTSTAMP:${new Date().toISOString().replace(/-|:|\.\d+/g, '').slice(0, 15)}Z\n`;
            calendarData += `END:VEVENT\n`;
        });
        calendarData += `END:VCALENDAR`;
        return calendarData;
    }

    function downloadCalendarFile(calendarData, filename) {
        const blob = new Blob([calendarData], {type: 'text/calendar'});
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
    }

    function showPreviewAndDownload() {
        const courses = extractCourses();
        const container = document.getElementById('kalenderButtonContainer');
        container.innerHTML = '';

        const previewList = document.createElement('ul');
        previewList.style.marginTop = '10px';
        previewList.style.maxHeight = '300px';
        previewList.style.overflowY = 'auto';
        previewList.style.padding = '0';
        previewList.style.listStyle = 'none';

        courses.forEach(course => {
            const item = document.createElement('li');
            item.textContent = `${course.date.toLocaleDateString()} – ${course.title} (${course.participants}) @ ${course.location}`;
            item.style.padding = '4px 0';
            previewList.appendChild(item);
        });

        const downloadButton = document.createElement('button');
        downloadButton.innerText = 'Kalenderdatei herunterladen';
        styleButton(downloadButton, '#018786', '#02675b');
        downloadButton.onclick = () => {
            const calendarData = createOutlookICS(courses);
            downloadCalendarFile(calendarData, 'Kalendereintraege.ics');
        };

        const resetButton = document.createElement('button');
        resetButton.innerText = 'Zurücksetzen';
        styleButton(resetButton, '#b00020', '#790000');
        resetButton.style.marginTop = '10px';
        resetButton.onclick = () => {
            container.innerHTML = '';
            container.appendChild(previewButton);
        };

        container.appendChild(previewList);
        container.appendChild(downloadButton);
        container.appendChild(resetButton);
    }

    function styleButton(button, color, hoverColor) {
        button.style.backgroundColor = color;
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.padding = '10px 16px';
        button.style.fontSize = '14px';
        button.style.cursor = 'pointer';
        button.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
        button.style.transition = 'background-color 0.3s ease';
        button.onmouseover = () => button.style.backgroundColor = hoverColor;
        button.onmouseout = () => button.style.backgroundColor = color;
    }

    let previewButton;

    function createButtons() {
        const buttonContainer = document.createElement('div');
        buttonContainer.id = 'kalenderButtonContainer';
        buttonContainer.style.position = 'fixed';
        buttonContainer.style.top = '10px';
        buttonContainer.style.right = '10px';
        buttonContainer.style.zIndex = '1000';
        buttonContainer.style.backgroundColor = 'white';
        buttonContainer.style.padding = '10px';
        buttonContainer.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
        buttonContainer.style.borderRadius = '8px';
        buttonContainer.style.fontFamily = 'Roboto, sans-serif';
        buttonContainer.style.maxWidth = '300px';

        previewButton = document.createElement('button');
        previewButton.innerText = 'Kalendereinträge anzeigen';
        styleButton(previewButton, '#6200ee', '#3700b3');
        previewButton.onclick = showPreviewAndDownload;

        buttonContainer.appendChild(previewButton);
        document.body.appendChild(buttonContainer);
    }

    createButtons();
})();
