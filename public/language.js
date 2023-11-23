document.querySelector('#lang').addEventListener('change', changeLanguage)//adding event listener once i change from en to es from slect option

function changeLanguage(e){//once selected it takes current url 
  console.log(e.target.value)
   var url = window.location.href;// getting url im on 
  
   
    // Get the current URL
    var url = new URL(window.location.href);// creates a url object out of url string  

    // Update or add the parameter
    url.searchParams.set('lang', e.target.value);//putting lang = when selecting the e.target.value aka en or es (the option chose in select)and sent to server
    
    // Navigate to the new URL, triggering a page reload
    window.location.href = url.toString();

}