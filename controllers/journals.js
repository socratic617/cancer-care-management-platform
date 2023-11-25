const cloudinary = require("../middleware/cloudinary");
const Journal = require("../models/Journal");
module.exports = {

    getCommunity: async (req, res) => {//getCommunity is my method for journalsController 
    try {// is going to run the code and if error, itll exit my try go to my catch error
      console.log('req.user : ')
      console.log(req.user)
      const journals = await Journal.find().sort({ entryDate: "desc" }).lean();// go and find me the journals (entries that users inputted )
      res.render("community-page.ejs", {  user: req.user, journals : journals});//"journals : journals" input where your entries[] is .  respond with creating my 'community-page.ejs'
    } catch (err) {
      console.log(err);
    }
  },
   getJournal: async (req, res) => {
    try {
      console.log('req.user : ')
      console.log(req.user);
      res.render("journal-entry.ejs", {  user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getVisualization: async (req, res) => {
    try {
      console.log('req.user : ')
      console.log(req.user)//safety net to know that it isnt an issue with my server it would be an issue how i requested 

      const journals = await Journal.find({ creatorId: req.user.id }).sort({ entryDate: "desc" }).lean();
      console.log('journals :  ')
      console.log(journals)
      // res.json(journals)//data gets sent back to client side to refresh
      //TO CALL TO MY DATA BASE AND PASS IT TO RENDER 
     
      res.render("visualization.ejs", {  user: req.user, journals : journals});
      // USING req. is always giving me something from client 
    } catch (err) {
      console.log(err);
    }
  },
  postJournal: async (req, res) => {
    try {
      console.log('req.file: ')
      console.log(req.file)
      console.log('req.user : ')
      console.log(req.user)
      console.log('req.body : ')
      console.log(req.body)

      //To Store Uploaded Image from entry to Cloudinary
      const imageResult = await cloudinary.uploader.upload(req.file.path);

      const result = {
        entries: [],
        entryDate: req.body['entry-date'],
        fatigueEntry: req.body['fatigue-entry'],
        mood: req.body['mood'],
        treatment: req.body['treatment'],
        // image: req.body['image'],
        image: imageResult.secure_url,// coemes cloudinary 
        cloudinaryId: imageResult.public_id,// comes cloudinary and need id from cloudinary to know what to delete
        'health-notes': req.body['health-notes'],
        'journal-lang': req.body['journal-lang'],
        'journal-user': req.body['journal-user'],
        description: req.body['description'],
        privateMode: req.body['private-mode'] === '' ? false : true,
        creatorId: req.user._id,
        reactions:{},
        user:{
          'warrior-name': req.user['warrior-name'],
          'warrior-status': req.user['warrior-status'],
          'caregiver-patient-name': req.user['caregiver-patient-name'],
          'caregiver-patient-status': req.user['caregiver-patient-status'],
          'relationship-type': req.user['relationship-type'],
          'cancer-type': req.user['cancer-type'],
          'lang-type': req.user['lang-type']
        },
        visualTotals: {
          totalHydration: null,
          totalHoursSlept: null,
          totalProtein: null,
          totalActivity: null
        }
      };

      /*how we are building new object for every entry like: { time: '19:02', 'entry-type': 'Sleep', sleep: '11' }  */
      let entry = {}
 

      // go through all my keys in my req.body object  req = {body: {},parms:{}}
      for (const key in  req.body) { 

        console.log("------------key: ", key)
        //entry-type-0 -> ['entry', 'type','0']
        let keyArr = key.split('-'); 

        /* checking for edge case if nothing inside object entry then stop and skip to the next key  in the loop */
        if ((key.startsWith('time-') || (key == 'entry-date')) && Object.keys(entry).length !== 0) {
          console.log("IF: ", key)

          //if i finish my entry add it to my entries array from result
          result.entries.push(entry);

          //after pushing my entry into the array make a new entry
          entry = {}

          //purpose: to add 'time' key valur pair for each new
          entry.time = req.body[key]

        }
        else{
          console.log("ELSE: ", key)
          // key = 'entry-type-26'  -> 'entry-type' '-' + 0  -> '-0'
          let keyName = key.replace('-' + keyArr[keyArr.length-1], '')
          entry[keyName] = req.body[key]
        }
      }

      // Total sleep, Total hydration, totalProtein, totalActivity
      for(let i= 0; i < result.entries.length ; i++){
        let log = result.entries[i]
        if(log['protein'] !== undefined){
          result.visualTotals.totalProtein += parseInt(log.protein)
        }
          if(log['sleep'] !== undefined){
          result.visualTotals.totalHoursSlept += parseInt(log.sleep)
        }
          if(log['hydration'] !== undefined){
          result.visualTotals.totalHydration += parseInt(log.hydration)
        }
          if(log['duration'] !== undefined){
          result.visualTotals.totalActivity += parseInt(log.duration)
        }
        
        

      }


      console.log("result: ");
      console.log(result)

      //EDGE CASE: USER CAN GO BACK AND UPDATE EXISTING POST 
      await Journal.findOneAndUpdate(
        { creatorId: req.user._id,  entryDate: req.body['entry-date'] },
        result, 
        {upsert: true},//credit : https://stackoverflow.com/questions/7267102/how-do-i-update-upsert-a-document-in-mongoose
      );

      res.render("journal-entry.ejs", {  user: req.user });
      
    } catch (err) {
      console.log(err);
    }
  },
  updateFavorite: async (req, res) => {
    try {
      console.log('req.user : ')
      console.log(req.user)
      const posts = await Post.find({ user: req.user.id });
      // res.render("journal-entry.ejs", {  user: req.user });//*****TO DO: Create Request to database and model for journals (add schema for journal aka model)*** *********TO DO*/
    } catch (err) {
      console.log(err);
    }
  },
  deleteJournal: async (req, res) => {
    try {
      console.log('req.user : ')
      console.log(req.user)
      // // const posts = await Post.find({ user: req.user.id });
      // res.render("journal-entry.ejs", {  user: req.user });//*****TO DO: Create Request to database and model for journals (add schema for journal aka model)*** *********TO DO*/
    } catch (err) {
      console.log(err);
    }
  },

};
