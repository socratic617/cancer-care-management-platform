/* Source: Chatgpt  &#34; are quotes that were replaced.  
  Use replace all to add back quote and JSON.parse to make string back to an object 
  in the process of getting the data from my visualization ejs file into the javascript
  all of the quotes were replaced with '&#34;' so what i am doing is replacing it back
  to quotes
  SIDE NOTE: if the user inserts quptes in the journall entry or a new line this line 
  of data will not be able to be used for parsing the JSON aka it will break this line of code
  'serverData' comes form my vsiualization ejs file */
const serverJournalData = JSON.parse(serverData.replaceAll("&#34;", "\""));

//PURPOSE: to create an array of dates that represents my most recent days
//credit: Chatgpt
function getPastXDatesAsArray(numberOfDays) {
  const today = new Date();
  const dateStrings = [];

  //This allows me to loop through my 7 most recent days to create an array of dates with my data
  for (let i = 0; i < numberOfDays; i++) {

    const pastDate = new Date(today);
    //offsetting my date by 1 to get seven current dates : 11/23/2023, 11/22/2023, 11/21/2023 ...
    pastDate.setDate(today.getDate() - i);

    //reforming my og data from "Fri Nov 24 2023 20:00:49 GMT-0500 (Eastern Standard Time)" to 11/24/2023
    const month = (pastDate.getMonth() + 1).toString().padStart(2, '0');
    const day = pastDate.getDate().toString().padStart(2, '0');
    const year = pastDate.getFullYear();

    const dateString = `${month}/${day}/${year}`;
    dateStrings.push(dateString);
  }

  return dateStrings;
}

// Example usage: [ '11/23/2023', '11/22/2023', '11/21/2023', ...,  '11/18/2023']
// reversing the order for data displayed in line chart for dates and data
const pastSevenDaysLabels = getPastXDatesAsArray(7).reverse();

//hash tables each variable below holds data for visualization such as mood, hydration, protein 
let resultSevenDaysMood = {}
let resultSevenDaysHydration = {}
// let resultSevenDaysFatigue = {}
let resultSevenDaysProtein = {}

//this is to loop through my recent 7 days for mood/fluidIntake/ProteinIntake
for(let i = 0; i < pastSevenDaysLabels.length; i++){

  resultSevenDaysHydration[pastSevenDaysLabels[i]] = null;

  resultSevenDaysProtein[pastSevenDaysLabels[i]] = null;


  
  /*looping through the dates of past 7 days to check for existing entry for mood/protein/fluidIntake
  allows me to go through these journals from most recent entry to oldest entry 
  for that current date we are looking at from our 'pastSevenDaysLabel'*/
  for(const key in serverJournalData ){

    /*allows us to check for each date and if no match break and continue to next 
    descending date until u get a match this prevents us from wasting time and resources 
    looking at older entries from way back then when the scope is last 7 days not every day */
    let dateA = new Date(pastSevenDaysLabels[i])
    let dateB = new Date(serverJournalData[key].entryDate)

    //*Need to fix this to be able to order entires for journals  */
    //checking to see if its not less then the dates for those 
    // if(dateB < dateA){
    //   console.log('breaking');
    //   break;
    // }

    if(serverJournalData[key].entryDate == pastSevenDaysLabels[i]){

      // if this label doesnt exist, create it 
      if(resultSevenDaysMood[serverJournalData[key].mood] == undefined ){
        resultSevenDaysMood[serverJournalData[key].mood] = 1 
      } else { // if no label none, make the value = 1
        resultSevenDaysMood[serverJournalData[key].mood] +=1
      }

      if(serverJournalData[key].visualTotals.totalProtein != null){
        resultSevenDaysProtein[pastSevenDaysLabels[i]] = serverJournalData[key].visualTotals.totalProtein
      }

      if(serverJournalData[key].visualTotals.totalHydration != null){
        resultSevenDaysHydration[pastSevenDaysLabels[i]] = serverJournalData[key].visualTotals.totalHydration
      }
      
      break;
    }

  }
}


// =============================================================================
// GLOBAL VARIABLES FOR VISUALIZATION ==========================================
// =============================================================================

let sharedBackgroundColorsWithOpacity = [
      'rgb(86,44,128,.2)',
      'rgb(221,160,221,.2)',
      'rgb(69,44,99,.2)',
      'rgb(216,191,216,.2)',
      'rgb(230,230,250,.2)',
      'rgb(186,88,168,.2)',
      'rgb(123,98,216,.2)'
    ]

let sharedBackgroundColors = [
      'rgb(86,44,128)',
      'rgb(221,160,221)',
      'rgb(69,44,99)',
      'rgb(216,191,216)',
      'rgb(230,230,250)',
      'rgb(186,88,168)',
      'rgb(123,98,216)'
    ]

// =============================================================================
// CREATE MOOD VISUALIZATION ==================================================
// =============================================================================

const keysArray = Object.keys(resultSevenDaysMood);

const valuesArray = Object.values(resultSevenDaysMood);

//CREATING DONUT PIE CHART FOR MOOD USING CHART.JS CDN 
const data = {
  labels: keysArray,//key arrays has all my data for mood
  datasets: [{
    label: 'mood',
    data: valuesArray,// valueArray holds my value for keyArrays
    backgroundColor: sharedBackgroundColors,
    hoverOffset: 35
  }]
};
const config = {
  type: 'doughnut',// type of visual to display
  data: data, //refers to the variable 
   options: {
    responsive: true, //credit: ChatGPT
    maintainAspectRatio: false,
    plugins: {
        title: {
            display: true,
            text: 'Weekly Mood'// of name title of visual
        }
    }
   }
};

new Chart(
    document.getElementById('visual-mood'),
    config
);

// =============================================================================
// CREATE PROTEIN VISUALIZATION ==================================================
// =============================================================================


let keysArrayProtein = Object.keys(resultSevenDaysProtein);

// Remove the year from each date string and credit: chatGPT
keysArrayProtein = keysArrayProtein.map(function(dateString) {
  let parts = dateString.split('/');
  return parts[0] + '/' + parts[1];
});

let valuesArrayProtein = Object.values(resultSevenDaysProtein);

//CREATING LINE CHART FOR PROTEIN USING CHART.JS CDN 
const dataProtein = {
  labels: keysArrayProtein,
  datasets: [{
    label: 'Protein Intake for Week',
    data: valuesArrayProtein,
    fill: true,//made the shade for line graph
    backgroundColor: sharedBackgroundColorsWithOpacity[3],//added shade of pink with opacity .2
    pointRadius: 8,//made the dots of data bigger by 8
    borderColor: sharedBackgroundColors[1],
    tension: 0.2// added curvitur to lines connected w/ data
  },
  {
    type: 'line',
    label: 'Protein Goal',
    data: [75, 75, 75, 75, 75, 75, 75, 75],//protein intake goal for 7 days 
    fill: false,
    pointRadius: 0,
    borderColor: sharedBackgroundColors[2]
  }]
};

const configProtein = {
  type: 'line',
  data: dataProtein,
  options:{
    responsive: true, //credit: ChatGPT
    maintainAspectRatio: false,
      scales: {
        x: {
          display: true,
          grid: {
            display: false // This removes the x-axis grid lines
          },
          title: {
            display: true,
            text: 'Past 7 Days'
          }
        },
        y: {
          beginAtZero: true,
          display: true,
          title: {
            display: true,
            text: 'Protein (g)'
          }
        }
      },
      plugins: {
            title: {
                display: true,
                text: 'Weekly Protein'// of name title of visual
            }
      }
    }
};

new Chart(
    document.getElementById('visual-protein'),
    configProtein
);


// =============================================================================
// CREATE HYDRATION VISUALIZATION ==================================================
// =============================================================================


let keysArrayHydration = Object.keys(resultSevenDaysHydration);

// Remove the year from each date string and credit: chatGPT
keysArrayHydration = keysArrayHydration.map(function(dateString) {
  let parts = dateString.split('/');
  return parts[0] + '/' + parts[1];
});

let valuesArrayHydration = Object.values(resultSevenDaysHydration);

const dataHydration = {
  labels: keysArrayHydration,
  datasets: [{
    label: 'Weekly Hydration',
    data: valuesArrayHydration,
    backgroundColor: sharedBackgroundColorsWithOpacity,
    borderColor: sharedBackgroundColors,
    borderWidth: 1
  },
  {
    type: 'line',
    label: 'Hydration Goal',
    data: [70, 70, 70, 70, 70, 70, 70, 70],//fluid intake goal for 7 days 
    fill: false,
    pointRadius: 0,
    borderColor: sharedBackgroundColors[2],
    layout: {
      padding: {
          // left: 20, // Adjust the left padding
          // right: 20, // Adjust the right padding
          top: 50, // Adjust the top padding
          // bottom: 10 // Adjust the bottom padding
      }
    }
  }]
};

const configHydration = {
  type: 'bar',
  data: dataHydration,
  options: {
    responsive: true, //credit: ChatGPT
    maintainAspectRatio: false,
    scales: {
      x: {
          display: true,
          grid: {
            display: false // This removes the x-axis grid lines
          },
          title: {
            display: true,
            text: 'Weekly Fluid Intake'
          }
        },
        y: {
          beginAtZero: true,
          display: true,
          grid: {
            display: false // This removes the x-axis grid lines
          },
          title: {
            display: true,
            text: 'Fluid Intake (fl. oz)'
          }
        }
    },
     plugins: {
            title: {
                display: true,
                text: 'Weekly Hydration'// of name title of visual
            }
    }
  },
};

new Chart(
    document.getElementById('visual-hydration'),
    configHydration
);