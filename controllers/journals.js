const cloudinary = require("../middleware/cloudinary");
const Journal = require("../models/Journal");
const { ObjectId } = require('mongodb');

// adding api module to project to be able to use it  
const { Configuration, OpenAIApi } = require("openai");  

//creating a new instance of an object and this object lets me to talk to open ai platform to make api calls(CRUD)
const newConfig = new Configuration({//SETTING UP OPEN AI 
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(newConfig);

//convert Date to mm/dd/yyyy
function formatDate(date) {
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear().toString();

  return `${month}/${day}/${year}`;
}


module.exports = {

  getCommunity: async (req, res) => {//getCommunity is my method for journalsController 
    try {// is going to run the code and if error, itll exit my try and  go to my catch error
      console.log('req.user : ')
      console.log(req.user)

      //These two get the current date and the date from 7 days ago
      const currentDate = new Date();
      const sevenDaysAgo = new Date(currentDate);
      sevenDaysAgo.setDate(currentDate.getDate() - 7);

      //gets me the past 7 days of journals from my MONGO DB
      const pastSevenDaysJournals = await Journal.find({
        entryDate: {//trying to find my past 7 day journals that dont have private mode
          $gte: formatDate(sevenDaysAgo),
          $lt: formatDate(currentDate)
        },
        privateMode: false //preventing display of highlighted post for private journals 
      });


      //Goal: Get the journal with the most # of reactions.
      let mostLikedJournal = pastSevenDaysJournals[0]
      for (let i = 1; i < pastSevenDaysJournals.length; i++){
        let reactionCountLiked = Object.keys(mostLikedJournal.reactions).length
        let reactionCountSevenDays = Object.keys(pastSevenDaysJournals[i].reactions).length;
  
        if (reactionCountSevenDays > reactionCountLiked){
          mostLikedJournal = pastSevenDaysJournals[i]
        }
      }

      //sort journal entries and hide ones where private mode is on
      const journals = await Journal.find({ privateMode: false }).sort({ entryDate: "desc" }).lean();// go and find me the journals (entries that users inputted )

      /**"journals : journals" input where your entries[] are and mostliked journal is my highest reacted journal in the past seven day .  respond with creating my 'community-page.ejs'*/
      res.render("community-page.ejs", { user: req.user, journals: journals, mostLikedJournal: mostLikedJournal });

    } catch (err) {
      console.log(err);
    }
  },
  getJournal: async (req, res) => {
    try {
      console.log('req.user : ')
      console.log(req.user);

     /* ________________________________________
      USING OPEN API FOR Quotes from journal entries form user
      _____________________________________________________
      */


      let quote = null; 

      const journals = await Journal.find({ creatorId: req.user.id }).sort({ entryDate: "desc" })//contains my array of journals

      console.log('journals :', journals)
    
      // run quote if they have  a journal to take user info to produce qoute
      if(journals.length > 0 ){
        const latestJournalEntry = journals[0]//contains my most recent journal that i want for quote
        const GPTOutput = await openai.createChatCompletion({//feeded it into chatgpt
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: 'give me a famous quote for a individual going through cancer based on the following key words:' + latestJournalEntry.description }], //content would be input form my mongoDB 
        });

        //i am changing the value of qoute to the output of chatgpt
        quote = GPTOutput.data.choices[0].message.content; 

        console.log(quote);
        
      }

      res.render("journal-entry.ejs", { user: req.user, quote: quote });//
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

      res.render("visualization.ejs", { user: req.user, journals: journals });
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
        reactions: {},
        user: {
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
      //REFORMATING HEALTH BIOMETRICS SECTION INTO SOMETHING CLEANER WHICH IS AN ARRAY OF OBJECTS WHERE EACH OBJECT REPRESENTS A ROW IN THE HEALTH BIOMETRICS
      for (const key in req.body) {

        console.log("------------key: ", key)
        //entry-type-0 -> ['entry', 'type','0'] trying to seperate out index
        let keyArr = key.split('-');

        /* checking for edge case if nothing inside object entry then stop and skip to the next key  in the loop 
        keeping track where my new row is (when a entry or time shows up thats when i know its a new row*/
        if ((key.startsWith('time-') || (key == 'entry-date')) && Object.keys(entry).length !== 0) {
          console.log("IF: ", key)

          //if i finish my entry add it to my entries array from result
          result.entries.push(entry);

          //after pushing my entry into the array make a new entry
          entry = {}

          //purpose: to add 'time' key valur pair for each new
          entry.time = req.body[key]

        }
        else {
          console.log("ELSE: ", key)
          // key = 'entry-type-26'  -> 'entry-type' '-' + 0  -> '-0'
          let keyName = key.replace('-' + keyArr[keyArr.length - 1], '')
          entry[keyName] = req.body[key]
        }
      }

      //CREATING  Total sleep, Total hydration, totalProtein, totalActivity
      for(let i = 0; i < result.entries.length; i++) {
        let log = result.entries[i]

        if(log['protein'] !== undefined) {
          result.visualTotals.totalProtein += parseInt(log.protein)
        }

        if(log['sleep'] !== undefined) {
          result.visualTotals.totalHoursSlept += parseInt(log.sleep)
        }
        
        if(log['hydration'] !== undefined) {
          result.visualTotals.totalHydration += parseInt(log.hydration)
        }
        
        if(log['duration'] !== undefined) {
          result.visualTotals.totalActivity += parseInt(log.duration)
        }

      }


      console.log("result: ");
      console.log(result)

      //EDGE CASE: USER CAN GO BACK AND UPDATE EXISTING POST 
      //this is to create the journal, if it finds a journal for the specified date it will replace it with this journal 
      await Journal.findOneAndUpdate(
        { creatorId: req.user._id, entryDate: req.body['entry-date'] },
        result,
        { upsert: true },//credit : https://stackoverflow.com/questions/7267102/how-do-i-update-upsert-a-document-in-mongoose
      );
      //creating a new instance of an object and this object lets me to talk to open ai platform to make api calls(CRUD)
      const newConfig = new Configuration({//SETTING UP OPEN AI 
        apiKey: process.env.OPENAI_API_KEY
      });
      const openai = new OpenAIApi(newConfig);

      // run quote if they have  a journal to take user info to produce qoute
        const GPTOutput = await openai.createChatCompletion({//feeded it into chatgpt
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: 'give me a famous quote based on the following key words:' + req.body.description}], //content would be input form my mongoDB 
        });

        //i am changing the value of qoute to the output of chatgpt
       const quote = GPTOutput.data.choices[0].message.content;

        console.log(quote);

      res.render("journal-entry.ejs", { user: req.user, quote: quote });

    } catch (err) {
      console.log(err);
    }
  },
  updateFavorite: async (req, res) => {
    try {
      console.log('update favorite: req.user : ')
      console.log(req.user)

      Journal.find({ _id: ObjectId(req.body.id) })// this is trying to find the id of the journal that the user selected when they select the heart icon
        .exec((err, result) => {// this is like a .then do this
          if (err) return console.log(err)
          console.log("result : ", result)

          console.log(result[0].reactions[req.body.loggedInUserId])

          console.log(result[0].reactions)

          //req.body.loggedeinuserid is my logged in user
          // if its ture or false in reactions i want to remove user id when they unlike the post
          if(result[0].reactions[req.body.loggedInUserId] !== undefined) {
            console.log('i need to remove the user id  ')
            delete result[0].reactions[req.body.loggedInUserId]; //credit: https://stackoverflow.com/questions/3455405/how-do-i-remove-a-key-from-a-javascript-object
          } else { //this is when i add my user id to the journal to signal that they liked that journal
            console.log('i need to add user id  ')
            result[0].reactions[req.body.loggedInUserId] = true; //this is how im adding star fav to post 
            console.log(result[0].reactions)
          }

          // WHERE I UPDATE MY MONGO DB W / user id 
          //update my reactions dpending whether they liked or unliked the journal 
          Journal.findOneAndUpdate({ _id: ObjectId(req.body.id) }, {
            $set: {
              reactions: result[0].reactions,
            }
          }, {
            sort: { _id: -1 },
            upsert: true
          }, (err, result) => {
            if (err) return res.send(err)
            res.send(result)
          })
        })

    } catch (err) {
      console.log(err);
    }
  },
  deleteJournal: async (req, res) => {
    try {
      console.log('deleteJournal req.user : ')
      console.log(req.user)

      Journal.findOneAndDelete({ _id: ObjectId(req.body.id) }, (err, result) => {
        if (err) return res.send(500, err)
        res.send('journal deleted!')
      })
    } catch (err) {
      console.log(err);
    }
  },
  getUserJournals: async (req, res) => {
    try {

      const journals = await Journal.find({ creatorId: req.user.id }).sort({ entryDate: "desc" }).lean();
      console.log('journals :  ')
      console.log(journals)
      // res.json(journals)//data gets sent back to client side to refresh
      //TO CALL TO MY DATA BASE AND PASS IT TO RENDER 

      res.render("my-journals.ejs", { user: req.user, journals: journals });

    } catch (err) {
      console.log(err);
    }
  },

};
