let reportsCache = null;


const images = {
    "Energy": "assets/images/energy_sec.png",
    "Finance": "assets/images/finance_sec.png",
    "Technology": "assets/images/tech_sec.png",
    "Real Estate": "assets/images/resec.png"
}


const loadReports = async () => {
    try{
        if (reportsCache) return reportsCache; //Prevent constantly doing a fetch

        const response = await fetch("./assets/reports.json");

        if (!response.ok){
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        reportsCache = await response.json(); //Store reports in reportsCache variable
        return reportsCache;
        // console.log("Successfully loaded reports:", reports);
    } catch(error){
        console.error("Could not load the reports JSON file:", error);
        return [];
    }
}

/* Writing this function to handle potential characters that will break HTML 
if they are embeded in HTML or HTML attributes*/
//These characters include &<>"'
const esc = (s) => {
    return String(s ?? '').replace(
        /[&<>"']/g, ///[&<>"']/ is the character class of &<>"' - 'g' means to catch all occurences of those characters
        c => {
            /*If you have many characters you want
            to catch and replace, the second argument would be
            a callback function that returns a dictionary mapping
            each character with what you want to replace it with
            */
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            }[c]
        }
    )
}

const filterReports = async (category) => {
    const reports = await loadReports();
    document.querySelectorAll('[data-report]').forEach(b => {b.setAttribute('aria-selected', String(b.dataset.report === category))});
    // console.log(e.target.dataset.report);

    const filtered = reports.filter(r => r.category === category);


    if (!filtered.length) {
        document.querySelector('.report-gallery').innerHTML = '<p>No reports in this category yet.</p>';
        return;
    }

    const reportsHTML = filtered.map(report => (`
        <article class="report-card" data-category="${esc(report.category)}">
            <a class="report-cover preview-report" 
            href="${report.file}"
            data-title="${esc(report.title)}"
            >
                <img src="${esc(images[report.category])}" alt="${esc(report.category)} Sector Report Cover"/>
                <span>Open report</span>
            </a>

            <div class="report-card-body">
                <p class="report-meta">${esc(report.category)} / Issue ${esc(report.issue)}</p>
                <h2>${esc(report.category)} Sector Report</h2>
                <p>${esc(report.date)}</p>
                <a class="download-report" href="${report.file}" download="${esc(report.title)}.pdf">
                    Download PDF <span aria-hidden="true">&darr;</span>
                </a>
            </div>
        </article>
        `
    )).join('');

    // console.log(reportsHTML);
    document.querySelector('.report-gallery').innerHTML = reportsHTML;

}


//Event delegation from parent, rather than creating an event listener for each button.
document.querySelector('.report-tabs').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-report]'); //closest() can track what was actually clicked within the element.
    if(!btn) return;
    filterReports(btn.dataset.report);
});


document.addEventListener('DOMContentLoaded', () => {
    const initial = document.querySelector('.report-tabs [aria-selected="true"]');
    if(initial) filterReports(initial.dataset.report);
});