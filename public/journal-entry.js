/* using these two variables(labelClass, inputClass) for readability and consistency for input and label elements for the Health Biometric fields  */

//adding styling for label of input
let labelClass = "mb-2 text-sm font-medium text-gray-900 dark:text-white" 

// adding styling for input
let inputClass = "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 

// creating variable to store row id index. Pro: this row id gives a unique identifier to row so i can add or delete rows
let row_id = 0;

//Logged in Users language
let lang = document.querySelector("#user-lang").innerText


// creating an arrayto be able to access easier options / or add options easier 
let entryTypeOptions = ['Select Entry','Sleep', 'Food', 'Hydration', 'Activity', 'Medicine', 'Bowel Movements', 'Note'] 

let entryTypeOptionsSpanish = ['Seleccionar Entrada', 'Sueño', 'Comida', 'Hidratación', 'Actividad', 'Medicina', 'Movimientos Intestinales', 'Nota']



//calling add row function to create row 0 when page is loaded
addRow()

// adding an event listener to "add btn" to be able to trigger a new row with function add row 
document.querySelector('#add-entry').addEventListener('click', addRow)


/* 
* @param 
* @return 
* */
function addRow(){// function that gets triggered as a callback when clicking button "add new row" 
   

     //a unique identifier for each row to be able to add / delete row to update properly in server/backend 
    row_id++;

    //adds a new div for the row
    let newRow = document.createElement('div')

    // adds a new index for row-id aka row- + index
    newRow.id = 'row-' + row_id

    //added style for new row to be broken up as a grid w 6 columns to mirror  og row 
    newRow.className = "grid grid-cols-6 gap-4" 

    let entryTypes = lang =='es'? entryTypeOptionsSpanish : entryTypeOptions;

    let entryLabel = lang == 'es' ? 'Tipo de Entrada': 'Entry Type';

    console.log('entry types: ' + entryTypes)

    /*in this div you are including the following
     these variable stores the output of these functions which are representitive of the templates i created  so i could make reusable code / modularize rather than manually writing it out each time. made a template so i can refrence function rather then building out this  */
    let deleteBtn = createDeleteButton(row_id); 
    let timeEntry = createTimeInputs(row_id)
    let selectEntry = createSelectInputs("entry-type", entryLabel, entryTypeOptions, entryTypes, row_id) //(name, labelText, options, index)

    //Purpose: delete selected row when you click the delete btn on that row
    deleteBtn.addEventListener('click', deleteSelectedRow)


  
    selectEntry.addEventListener('change', displayDynamicInputFields)

    //appending delete btn functionality to this div 
    newRow.appendChild(deleteBtn)

    //appending timeEntry functionality to this div 
    newRow.appendChild(timeEntry)

    //appending selectEntry functionality to this div 
    newRow.appendChild(selectEntry)

    
    /* i added this to my div that exists in my ejs for journal entries so that it would show up on my pg ****without this, it would not show up */
    document.querySelector('#biometric-rows').appendChild(newRow)
}

/* 
* @param 
* @return 
* */
function deleteSelectedRow(e){
    console.log("e.target: ")
    console.log(e.target)
    console.log("e.target.id: ")
    console.log(e.target.id.split('-') ) 
    console.log("e.target.id.remove(): ")

    let rowIndex = e.target.id.split('-')[1];
    let rowToDelete = document.getElementById('row-' + rowIndex);
    rowToDelete.remove();
}


/* 
* In this function I am listening for an event 'change' instead 
* of 'click'. Where there is a change only when the user
* selects what value to display for the type of entries
*
* credit: https://stackoverflow.com/questions/66780265/need-a-form-field-to-be-shown-depending-on-the-results-of-another-field
* @param 
* @return 
* */
function displayDynamicInputFields(e){
    console.log("e: ")
    console.log(e)
    console.log('e.target:  ')
    console.log(e.target)
    console.log(e.target.id.split("-")[2])
    console.log(e.target.value)
    let index = e.target.id.split("-")[2]
    let selectedOption = e.target.value
   

    let row = document.querySelector('#row-' + index);

    console.log("row.lastChild :")
    console.log(row.lastChild)

    console.log('row.lastchild. id :')
    console.log(row.lastChild.lastChild.id)

    // credit: https://stackoverflow.com/questions/34193751/js-remove-last-child
    if(row.lastChild.lastChild.id !== "entry-type-" + index){

        /*the purpose for this is to remove the "lastChild" from the previous input field (it is wrapped in a div for each entry type to be able to be removed ) */
        row.removeChild(row.lastChild)
    }

    console.log("option: " + selectedOption)
    //dynamically rendering input fields 
    switch (selectedOption) {
        case "Food" :
            row.appendChild(createFoodInputs(index))
            console.log("Food Selected in switch case");
            break;
        case "Sleep":
            console.log("Sleep Selected in switch case");
            row.appendChild(createSleepInputs(index))
            break;
        case "Hydration":
            console.log("Hydration Selected in switch case");
            row.appendChild(createHydrationInputs(index))
            break;
        case "Activity":
            console.log("Activity Selected in switch case");
            row.appendChild(createActivityInputs(index))
            break;
        case "Medicine":
            console.log("Activity Selected in switch case");
            row.appendChild(createMedicineInputs(index))
            break;
        case "Bowel Movements":
            console.log("Activity Selected in switch case");
            row.appendChild(createBathroomInputs(index))
            break;
        case "Note":
            console.log("Activity Selected in switch case");
            row.appendChild(createNoteInputs(index))
            break;

    }

}

/* 
* @param 
* @return 
* */
function createNoteInputs(index){//helper functions are functions to help assist me with code  

    let noteLabel = lang == 'es' ? 'Entrada de Nota' : 'Note Entry';
    let note = createInputTextField("note", noteLabel, index);

    return createInputTemplate("note-input", index, [note]);
}

/* 
* @param 
* @return 
* */
function createMedicineInputs(index){

    let medicineTypeOptions = ['Select Medicine Type','Gavilax','Compazine', 'Senna', 'CBN', 'Antibiotics','Zotran', 'Benadryl', 'Decadron', 'Omaprazole', 'Tylenol', 'Claritin', 'Lidocaine', 'Letrozole', 'Amlodipine', 'Simvastatin', 'Omeprazole', 'Verzenio']
    
    let medicineTypeOptionsSpanish = ['Seleccionar Tipo de Medicamento', 'Gavilax', 'Compazine', 'Senna', 'CBN', 'Antibióticos', 'Zotran', 'Benadryl', 'Decadron', 'Omeprazol', 'Tylenol', 'Claritin', 'Lidocaína', 'Letrozol', 'Amlodipino', 'Simvastatina', 'Omeprazol', 'Verzenio']

    let medicineType = lang == 'es' ? medicineTypeOptionsSpanish : medicineTypeOptions;

    let medicineTypeLabel = lang == 'es' ? "Tipo de Medicamento" : "Medicine Type";

    
    let medicine = createSelectInputs("medicine-type", medicineTypeLabel, medicineTypeOptions, medicineType, index )


    let unitTypeOptions = ['select Unit','mg','g', 'mL', 'drop/s'] 

    let unitTypeOptionsSpanish = ['Seleccionar Unidad', 'mg', 'g', 'mL', 'gota/s']

    let unitType = lang == 'es' ? unitTypeOptionsSpanish : unitTypeOptions;

    let dosageLabel = lang == 'es' ? "Tipo de Dosis" : "Dosage Type";
    
    let dosage = createSelectInputs("medicine-dosage", dosageLabel, unitTypeOptions, unitType, index )

    let amountLabel = lang == 'es' ? "Cantidad" : "Amount";

    let amount = createInputNumberField("medicine-amount", amountLabel, 0, 2000, index)

    console.log([medicine, dosage, amount])

    return createInputTemplate("medicine-input", index, [medicine, dosage, amount]);
}

/* 
* @param 
* @return 
* */
function createBathroomInputs(index){

    let bathroomTypeOptions = ['Select Bowel Type','Normal','Diarrhea', 'Constipated'] 
    let bathroom = createSelectInputs("bathroom-type", "Bowel Movement", bathroomTypeOptions, index)

    return createInputTemplate("bathroom-input", index, [bathroom]);
}

/* 
* function create the inputs faster with my helper input. this
* is going to let me create an input text field, like types 
* text, number 
* @param 
* @return 
* */
function createHydrationInputs(index){//helper functions are functions to help assist me with code  


    //index is row number
    let hydration = createInputNumberField("hydration","Fluid Intake (fl oz)", 0, 250, index)

    return createInputTemplate("hydration-input", index, [hydration]);
}

/* 
* function create the inputs faster with my helper input. this
* is going to let me create an input text field, like types 
* text, number 
* @param 
* @return 
* */
function createSleepInputs(index){//helper functions are functions to help assist me with code  

    //index is row number
    let sleep = createInputNumberField("sleep","Hours Slept (hrs)", 0, 24, index)

    return createInputTemplate("sleep-input", index, [sleep]);
}


/* 
* function create the inputs faster with my helper input. this
* is going to let me create an input text field, like types 
* text, number 
* @param 
* @return 
* */
function createFoodInputs(index){//helper functions are functions to help assist me with code  

    let foodLabel = lang == 'es' ? "" : "Food Entry";

    let food = createInputTextField("food", foodLabel, index);

    let proteinLabel = lang == 'es' ? "" : "Protein Intake (g)";
    let protein = createInputNumberField("protein", proteinLabel, 0, 250, index)

    return createInputTemplate("food-input", index, [food,protein]);
}

/* 
* function create the inputs faster with my helper input. this
* is going to let me create an input text field, like types 
* text, number 
* @param 
* @return 
* */
function createActivityInputs(index){//helper functions are 
    
    // creating an array to be able to access easier options / or add options easier 
    let activityTypeOptions = ['Activity Type','Run', 'Walk', 'Bike', 'Yoga', 'Swim', 'Weight Lifting'] 

    let activity = createSelectInputs("activity-type", "Activity Type",activityTypeOptions, index )
    let duration = createInputNumberField("duration","Duration (hrs)", 0, 24, index)

    return createInputTemplate("activity-input", index, [activity, duration]);

}

/* 
* @param 
* @return 
* */
function createInputTemplate(id, index, arrElements){ // creates two divs (parent and grand parent )

    let parentDiv = document.createElement('div')
    parentDiv.className = 'grid grid-cols-3 gap-4'

    // loops through all inputs that need to be added to parentDiv until there is no more inputs to add
    for( let input of arrElements){
        //input = food
        parentDiv.appendChild(input)
    }

    //then creates grandparent to add parent div inside of it 
    let grandParentDiv = document.createElement('div')
    grandParentDiv.className = "col-span-3"
    grandParentDiv.id = id + "-" + index
    grandParentDiv.appendChild(parentDiv)
    

    return grandParentDiv;
}


/* This function is being used to create a Input Text Field template for label, input, and parent div elements for entry types. Pros: readiability and clarity, writing out less lines of code
* @param string name: target element attributes:   for, id, and name (corresponding to each entry type)
* @param string  labelText: targets the innerText of these elements
* @param integer index: targets which entry type row to edit/remove
* @return  Object parentDiv: is an html element we nest a label and input element into (grouped all together)
* */
function createInputTextField(name,labelText, index){


    let parentDiv = document.createElement('div')
    let entryLabel = document.createElement('label')
    entryLabel.className = labelClass
    entryLabel.innerText = labelText
    entryLabel.for = name + "-" + index
    

    let entryInput = document.createElement('input')
    parentDiv.appendChild(entryInput)
    entryInput.className = inputClass
    entryInput.name= name + "-" + index
    entryInput.id = name  + "-" + index
    entryInput.type ="text"

    
    parentDiv.className = "col-span-2"
    parentDiv.appendChild(entryLabel)
    parentDiv.appendChild(entryInput)

    return parentDiv;
}

/* This function is being used to create a Input Number Field template for label, input, min attribute, max attribute and parent div elements for entry types. Pros: readiability and clarity, writing out less lines of code
* @param string name: target element attributes:   for, id, and name (corresponding to each entry type)
* @param string  labelText: targets the innerText of these elements
* @param integer min: sets the value for min attribute
* @param integer max: sets the value for max attribute
* @param integer index: targets which entry type row to edit/remove
* @return  Object parentDiv: is an html element we nest a label and input element into (grouped all together)
* */
function createInputNumberField(name,labelText, min, max, index){

    let entryLabel = document.createElement('label')
    entryLabel.className = labelClass
    entryLabel.for = name + "-" + index
    entryLabel.innerText = labelText

    let entryInput = document.createElement('input')
    entryInput.className = inputClass
    entryInput.type = 'number'
    entryInput.id = name + "-" + index
    entryInput.name = name + "-" + index
    entryInput.min = min 
    entryInput.max = max
    entryInput.step= ".5"
    entryInput.required = true

    let parentDiv = document.createElement('div')
    parentDiv.appendChild(entryLabel)
    parentDiv.appendChild(entryInput)

    return parentDiv;

}


/* 
* @param 
* @return 
* */
function createDeleteButton(index){

    let icon = document.createElement('i')
    icon.className = "fas fa-minus"
    icon.style.color = "#c67171"
    icon.id = "delete-" + index

    let removeBtn = document.createElement('button')
    removeBtn.className = "mr-4 inline-flex items-center justify-center p-1 me-3 text-sm font-medium h-6 w-6 text-gray-500 bg-white border border-gray-300 rounded-full focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
    removeBtn.type = 'button'
    removeBtn.appendChild(icon)

    let removeBtnDiv = document.createElement('div')
    removeBtnDiv.className = "mt-8 ml-6 pl-10 items-center justify-center"
    removeBtnDiv.id = "delete-" + index
    removeBtnDiv.appendChild(removeBtn)

    return removeBtnDiv;
}

/* 
* @param 
* @return 
* */
function createTimeInputs(index){//helper functions are functions to help assist me with code  
    let timeEntryLabel = document.createElement('label')
    timeEntryLabel.className = labelClass
    timeEntryLabel.innerText = "Time"
    timeEntryLabel.for = "time-" + index 

    let timeEntryInput = document.createElement('input')
    timeEntryInput.className = inputClass
    timeEntryInput.type = 'time'
    timeEntryInput.id = "time-" + index 
    timeEntryInput.name = "time-" + index 
    timeEntryInput.required = true

    let timeEntryParentDiv = document.createElement('div')
    timeEntryParentDiv.className = "mb-6"
    timeEntryParentDiv.appendChild(timeEntryLabel)
    timeEntryParentDiv.appendChild(timeEntryInput)

    document.createElement('div').appendChild(timeEntryParentDiv)

    return timeEntryParentDiv;
}

/* 
* @param 
* @return 
* */
function createSelectInputs(name, labelText, optionsValue, options, index){// passing 4 params, //creating a select inputs with the options 

    //creating select element
    let select = document.createElement('select')

    //adding styling to select element 
    select.className = "bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"

    //adding index to that option selected
    select.id = name + "-" + index

    //adding index to that option selected
    select.name = name + "-" + index

    // have to select an option
    select.required = true
    console.log('options : inside create select inputs :  ', options)
    
    //purpose: to create options and info get sent to server
    for(let i = 0; i < options.length; i++){

        // create options element 
        let option = document.createElement('option')
        
        //what my user sees when they see option 
        option.innerText = options[i]    
        
         /* at the first element of array 0 , it will be my first option which is my default */
        if (i === 0 ){
     
            //my default has no value bc its a placeholder
            option.value = '' 

            // when you open pg it selects the default that has no value
            option.selected = true
            
        }
        else{// when you select option showcase the value
            
            /*that value will be sent to browser to see if its a valid value */
            option.value = optionsValue[i]
        }

        select.appendChild(option)//create other options the same way
    }
    let selectLabel = document.createElement('label') // creating label element
    selectLabel.for = name + "-"+ index
    selectLabel.className = labelClass //adding styling for className 
    selectLabel.innerText = labelText // showcase innertext
    let selectParentDiv = document.createElement('div') // creating div element
    selectParentDiv.appendChild(selectLabel) //
    selectParentDiv.appendChild(select)

    return selectParentDiv;
}


