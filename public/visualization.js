/* Source: Chatgpt  &#34; are quotes that were replaced.  
Use replace all to add back quote and JSON.parse to make string back to an object 
in the process of getting the data from my visualization ejs file into the javascript
 all of the quptes were replace with '&#34;' so what i am doing is replacing it back
 to quotes
 SIDE NOTE: if the user inserts quptes in the journall entry or a new line this line 
 of data will not be able to be used for parsing the JSON aka it will break this line of code
 'serverData' comes form my vsiualization ejs file */
const serverJournalData = JSON.parse(serverData.replaceAll("&#34;", "\""));
console.log(serverJournalData);

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
const pastSevenDaysLabels = getPastXDatesAsArray(7);
console.log(pastSevenDaysLabels);

//each variable below holds data for visualization such as mood, hydration,fatigue, protein 
let resultSevenDaysMood = {}
let resultSevenDaysHydration = {}
let resultSevenDaysFatigue = {}
let resultSevenDaysProtein = {}

//this is to loop through my recent 7 days for mood/fluidIntake/ProteinIntake
for(let i = 0; i < pastSevenDaysLabels.length; i++){
  console.log("pastSevenDaysLabels[i] (inside for loop) :")
  console.log(pastSevenDaysLabels[i])

  resultSevenDaysHydration[pastSevenDaysLabels[i]] = null;
  console.log("resultSevenDaysHydration :")
  console.log(resultSevenDaysHydration)

  resultSevenDaysProtein[pastSevenDaysLabels[i]] = null;
  console.log("resultSevenDaysProtein :")
  console.log(resultSevenDaysProtein)

  
  /*looping through the dates of past 7 days to check for existing entry for mood/protein/fluidIntake
  allows me to go through these journals from most recent entry to oldest entry 
  for that current date we are looking at from our 'pastSevenDaysLabel'*/
  for(const key in serverJournalData ){
    console.log('I AM KEY: ', key)

    /*allows us to check for each date and if no match break and continue to next 
    descending date until u get a match this prevents us from wasting time and resources 
    looking at older entries from way back then when the scope is last 7 days not every day */
    let dateA = new Date(pastSevenDaysLabels[i])
    let dateB = new Date(serverJournalData[key].entryDate)

    //checking to see if its not less then the dates for those 
    if(dateB < dateA){
      break;
    }


    if(serverJournalData[key].entryDate == pastSevenDaysLabels[i]){
      console.log("-----------------------------------------------")
      console.log("Current Label Date: ", pastSevenDaysLabels[i])
      console.log("Current Joural entry you are looking at: ")
      console.log( serverJournalData[key])
      console.log('serverJournalData[key].mood :')
      console.log(serverJournalData[key].mood)
      console.log('serverJournalData[key].entryDate  :')
      console.log(serverJournalData[key].entryDate)
      console.log('serverJournalData[key].visualTotals  :')
      console.log(serverJournalData[key].visualTotals)
      console.log('serverJournalData[key]fatigueEntry  :')
      console.log(serverJournalData[key].fatigueEntry)

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
// CREATE MOOD VISUALIZATION ==================================================
// =============================================================================
console.log("___________________________________")
console.log(" resultSevenDaysMood :")
console.log(resultSevenDaysMood)
const keysArray = Object.keys(resultSevenDaysMood);
console.log(keysArray);

const valuesArray = Object.values(resultSevenDaysMood);
console.log(valuesArray);  

//CREATING DONOUGHT PIE CHART FOR MOOD USING CHART.JS CDN 
const data = {
  labels: keysArray,//key arrays has all my data for mood
  datasets: [{
    label: 'mood',
    data: valuesArray,// valueArray holds my value for keyArrays
    backgroundColor: [
      'rgb(86,44,128)',
      'rgb(221,160,221)',
      'rgb(69,44,99)',
      'rgb(216,191,216)',
      'rgb(230,230,250)',
      'rgb(186,88,168)',
      'rgb(186,88,168)'
    ],
    hoverOffset: 35
  }]
};
const config = {
  type: 'doughnut',// type of visual to display
  data: data, //refers to the variable 
   options: {
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
console.log("resultSevenDaysProtein (outside for loop): ")
console.log(resultSevenDaysProtein)
let keysArrayProtein = Object.keys(resultSevenDaysProtein);
console.log(keysArrayProtein);

let valuesArrayProtein = Object.values(resultSevenDaysProtein);
console.log(valuesArrayProtein); 

// Remove the year from each date string and credit: chatGPT
keysArrayProtein = keysArrayProtein.map(function(dateString) {
  let parts = dateString.split('/');
  return parts[0] + '/' + parts[1];
});

//reversing the order for data displayed in line chart for dates and data
keysArrayProtein = keysArrayProtein.reverse()
valuesArrayProtein = valuesArrayProtein.reverse()

console.log(keysArrayProtein);

//CREATING LINE CHART FOR PROTEIN USING CHART.JS CDN 
const dataProtein = {
  labels: keysArrayProtein,
  datasets: [{
    label: 'Protein Intake for Week',
    data: valuesArrayProtein,
    fill: true,//made the shade for line graph
    backgroundColor: 'rgb(186,88,168,.2)',//added shade of pink with opacity .2
    pointRadius: 8,//made the dots of data bigger by 8
    borderColor: 'rgb(221,160,221)',
    tension: 0.2// added curvitur to lines connected w/ data
  },
  {
    type: 'line',
    label: 'Protein Goal',
    data: [50, 50, 50, 50, 50, 50, 50, 50],//protein intake goal for 7 days 
    fill: false,
    borderColor: 'rgb(86,44,128)'
  }]
};
const configProtein = {
  type: 'line',
  data: dataProtein,
  options:{
      scales: {
        x: {
          display: true,
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

// backgroundColor: [
//       'rgb(86,44,128)',
//       'rgb(221,160,221)',
//       'rgb(69,44,99)',
//       'rgb(216,191,216)',
//       'rgb(230,230,250)',
//       'rgb(186,88,168)',
//       'rgb(186,88,168)'
//     ],


// =============================================================================
// CREATE HYDRATION VISUALIZATION ==================================================
// =============================================================================

let keysArrayHydration = Object.keys(resultSevenDaysHydration);
console.log(keysArrayHydration);

let valuesArrayHydration = Object.values(resultSevenDaysHydration);
console.log(valuesArrayHydration); 

// Remove the year from each date string and credit: chatGPT
keysArrayHydration = keysArrayHydration.map(function(dateString) {
  let parts = dateString.split('/');
  return parts[0] + '/' + parts[1];
});

//reversing the order for data displayed in line chart for dates and data
keysArrayHydration = keysArrayHydration.reverse()
valuesArrayHydration = valuesArrayHydration.reverse()

console.log('keysArrayHydration');
console.log(keysArrayHydration);
console.log('valuesArrayHydration');
console.log(valuesArrayHydration);

const dataHydration = {
  labels: keysArrayHydration,
  datasets: [{
    label: 'Weekly Hydration',
    data: valuesArrayHydration,
    backgroundColor: [
      'rgba(255, 99, 132, 0.2)',
      'rgba(255, 159, 64, 0.2)',
      'rgba(255, 205, 86, 0.2)',
      'rgba(75, 192, 192, 0.2)',
      'rgba(54, 162, 235, 0.2)',
      'rgba(153, 102, 255, 0.2)',
      'rgba(201, 203, 207, 0.2)'
    ],
    borderColor: [
      'rgb(255, 99, 132)',
      'rgb(255, 159, 64)',
      'rgb(255, 205, 86)',
      'rgb(75, 192, 192)',
      'rgb(54, 162, 235)',
      'rgb(153, 102, 255)',
      'rgb(201, 203, 207)'
    ],
    borderWidth: 1
  }]
};
const configHydration = {
  type: 'bar',
  data: dataHydration,
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  },
};
new Chart(
    document.getElementById('visual-hydration'),
    configHydration
);