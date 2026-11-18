let events = null;

let currentTimeline = 'all';
let currentFormat = 'all';


const fetchEvents = async () => {
    if (events) return events;

    try {
        const fetchedEvents = await fetch("./assets/events.json");
        if (fetchedEvents.status !== 200){
            throw new Error("Unable to fetch events- Error code: ", fetchedEvents.status);
        }
        events = await fetchedEvents.json();
        // console.log(events);
        return events;
    } catch (error) {
        console.log(error);
    }
}


const buildEvents = async (format, timeline) => {
    const currentDate = new Date();
    const events = await fetchEvents();

    
    let filteredEvents = events.filter(e => {

        const date = new Date(`${e.date}T${e.time}`);
        let timelineExpression = true;

        const formatExpression = (format === 'all') || (e.format === format);

        if(timeline === 'upcoming'){
            timelineExpression = date >= currentDate;
        } else if (timeline === 'past'){
            timelineExpression = date < currentDate;
        }

        return formatExpression && timelineExpression;
        
    });


    let eventList = document.querySelector(".event-list");

    if(filteredEvents.length === 0){
        eventList.innerHTML = `<p>No events found for this category.</p>`;
        return;
    }

    const eventListHTML = filteredEvents.map(e => `
        <article class="event-card">
            <div class="img-container">
                <img src="${e.image}" alt="${e.title} Event"/>
            </div>
            <div class="event-card-body">
                <h2>${e.title}</h2>
                <div class="event-meta">
                    <span>${new Date(`${e.date}T00:00:00`).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                    })}</span> • <span>${e.time}</span> • <span>${e.location}</span>
                </div>
                <p class="event-desc">${e.description}</p>
                ${
                    e.link ? (`
                        <a href="${e.link}"
                        target="_blank"
                        >
                            Explore Event
                        </a>
                    `
                    ) : ''
                }
            </div>

        </article>
        `
    ).join('');

    eventList.innerHTML = eventListHTML;
}


document.addEventListener('DOMContentLoaded', () => {
    buildEvents(currentFormat, currentTimeline);

    const timeBtns = document.querySelectorAll(".event-btn.event-timeline");
    const formatBtns = document.querySelectorAll(".event-btn.event-type");

    timeBtns.forEach(tb => {
        tb.addEventListener('click', () => {
            timeBtns.forEach(t => t.classList.remove('active'));
            tb.classList.add('active');
            currentTimeline = tb.dataset.filter;
            buildEvents(currentFormat, currentTimeline);
        })
    });


    formatBtns.forEach(fb => {
        fb.addEventListener('click', () => {
            formatBtns.forEach(f => f.classList.remove('active'));
            fb.classList.add('active');
            currentFormat = fb.dataset.filter;
            buildEvents(currentFormat, currentTimeline);
        })
    });
})