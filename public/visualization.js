// Source: Chatgpt  &#34; are quotes that were replaced.  Use replace all to add back quote and JSON.parse to make string back to an object
const serverJournalData = JSON.parse(serverData.replaceAll("&#34;", "\""));
console.log(serverJournalData);

//PURPOSE: to create an array of dates that represents my most recent days
//credit: Chatgpt
function getPastSevenDays() {
  const today = new Date();
  const dateStrings = [];

  //This allows me to loop through my 7 most recent days to create an array of dates with my data
  for (let i = 0; i < 14; i++) {

    const pastDate = new Date(today);
    pastDate.setDate(today.getDate() - i);

    const month = (pastDate.getMonth() + 1).toString().padStart(2, '0');
    const day = pastDate.getDate().toString().padStart(2, '0');
    const year = pastDate.getFullYear();

    const dateString = `${month}/${day}/${year}`;
    dateStrings.push(dateString);
  }

  return dateStrings;
}

// Example usage:
const pastSevenDaysLabels = getPastSevenDays();
console.log(pastSevenDaysLabels);

let resultSevenDaysMood = {}
let resultSevenDaysHydration = {}
let resultSevenDaysFatigue = {}
let resultSevenDaysProtein = {}

//this is to loop through my recent 7 days for mood/fluidIntake/ProteinIntake
for(let i = 0; i < pastSevenDaysLabels.length; i++){
  console.log("pastSevenDaysLabels[i] (inside for loop) :")
  console.log(pastSevenDaysLabels[i])

  let found = false;

  //looping through the dates of past 7 days to check for existing entry for mood/protein/fluidIntake
  for(const key in serverJournalData ){
    let dateA = new Date(pastSevenDaysLabels[i])
    let dateB = new Date(serverJournalData[key].entryDate)
    if(dateB < dateA){
      console.log( 'broke out of loop with break :')
      console.log( 'dateA')
      console.log(dateA)
      console.log( 'dateB')
      console.log(dateB)
      found = true;

      // if this label doesnt exist, create it 
      if(resultSevenDaysMood['none'] == undefined ){
        resultSevenDaysMood['none'] = 1 
      } else { // if no label none, make the value = 1
        resultSevenDaysMood['none'] +=1
      }
      break;
    }


    if(serverJournalData[key].entryDate == pastSevenDaysLabels[i]){
      console.log("-----------------------------------------------")
      console.log("Current Label Date: ", pastSevenDaysLabels[i])
      console.log( serverJournalData[key])
      console.log('serverJournalData[key].mood :')
      console.log(serverJournalData[key].mood)
      console.log('serverJournalData[key].entryDate  :')
      console.log(serverJournalData[key].entryDate)
      console.log('serverJournalData[key].visualTotals  :')
      console.log(serverJournalData[key].visualTotals)
      console.log('serverJournalData[key]fatigueEntry  :')
      console.log(serverJournalData[key].fatigueEntry)
      found = true;

      // if this label doesnt exist, create it 
      if(resultSevenDaysMood[serverJournalData[key].mood] == undefined ){
        resultSevenDaysMood[serverJournalData[key].mood] = 1 
      } else { // if no label none, make the value = 1
        resultSevenDaysMood[serverJournalData[key].mood] +=1
      }
      break;
    }

  }

  if(!found){
    
    // if this label doesnt exist, create it 
    if(resultSevenDaysMood['none'] == undefined ){
      resultSevenDaysMood['none'] = 1 
    } else { // if no label none, make the value = 1
      resultSevenDaysMood['none'] +=1
    }
  }
}
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
  type: 'doughnut',
  data: data,
   options: {
        plugins: {
            title: {
                display: true,
                text: 'Weekly Mood'
            }
        }
   }
};
new Chart(
    document.getElementById('visual-mood'),
    config
);



