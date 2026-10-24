const loadReports = async () => {

    try{
        const response = await fetch("./assets/reports.json");

        if (!response.ok){
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const reports = await response.json();
        return reports;
        // console.log("Successfully loaded reports:", reports);
    } catch(error){
        console.error("Could not load the reports JSON file:", error);
    }

}


const filterReports = async (category) => {
    const reports = await loadReports();

}