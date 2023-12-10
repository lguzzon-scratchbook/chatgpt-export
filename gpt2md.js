const TurndownService = require('turndown');
const ts = new TurndownService();

// Clone to not modify the actual `document.body` in the code that follows
const body = document.body.cloneNode(true);

// Remove code box headers
body.querySelectorAll('pre .text-xs').forEach(n => n.parentNode?.removeChild(n));

// Remove prompt/response numbers
body.querySelectorAll('div .text-xs.gap-1').forEach(n => n.parentNode?.removeChild(n));

// Remove footer
body.querySelector('.absolute.bottom-0').remove()

// Iterate through main text containers and create text to export
let text = `# ${document.title}\n\n`;
body.querySelectorAll('.text-message').forEach((n, i) => {
    const num = Math.trunc(i / 2) + 1;
    const prose = n.querySelector('.prose');
    if (prose) {
        // Only convert response markup to markdown
        text += `## RESPONSE ${num}\n\n${ts.turndown(prose.innerHTML)}\n\n`;
    } else {
        // Keep prompt text as it was entered
        text += `## PROMPT ${num}\n\n${n.querySelector('div').innerHTML}\n\n`;
    }
});

const sortDate = () => {
    const lDate = new Date()
    const lDateLocal = new Date(
        lDate.getTime() - lDate.getTimezoneOffset() * 60000
    )
    return lDateLocal
        .toISOString()
        .replaceAll(':', '')
        .replaceAll('-', '')
        .replace('T', '-')
        .substring(0, 15)
}

// Download
const a = document.createElement('a');
const title = document.title
a.download = `${title.endsWith('.') ? title.slice(0, -1) : title}-${sortDate()}.md`;
a.href = URL.createObjectURL(new Blob([text]));
a.style.display = 'none';
document.body.appendChild(a);
a.click();
