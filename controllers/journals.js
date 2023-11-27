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

module.exports = {

  getCommunity: async (req, res) => {//getCommunity is my method for journalsController 
    try {// is going to run the code and if error, itll exit my try go to my catch error
      console.log('req.user : ')
      console.log(req.user)

      //sort journal entries and hide ones where private mode is on
      const journals = await Journal.find({ privateMode: false }).sort({ entryDate: "desc" }).lean();// go and find me the journals (entries that users inputted )

      res.render("community-page.ejs", { user: req.user, journals: journals });//"journals : journals" input where your entries[] is .  respond with creating my 'community-page.ejs'

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
      for (const key in req.body) {

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
        else {
          console.log("ELSE: ", key)
          // key = 'entry-type-26'  -> 'entry-type' '-' + 0  -> '-0'
          let keyName = key.replace('-' + keyArr[keyArr.length - 1], '')
          entry[keyName] = req.body[key]
        }
      }

      // Total sleep, Total hydration, totalProtein, totalActivity
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

      Journal.find({ _id: ObjectId(req.body.id) })
        .exec((err, result) => {
          if (err) return console.log(err)
          console.log("result : ", result)

          console.log(result[0].reactions[req.body.loggedInUserId])

          if (result[0].reactions[req.body.loggedInUserId] !== undefined) {
            console.log('i need to remove the user id  ')
            delete result[0].reactions[req.body.loggedInUserId]; //credit: https://stackoverflow.com/questions/3455405/how-do-i-remove-a-key-from-a-javascript-object
            //im removing the star if I dont want to star it 

          }
          else {
            console.log('i need to add user id  ')
            result[0].reactions[req.body.loggedInUserId] = true; //this is how im adding star fav to post 
            console.log(result[0].reactions)
          }

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
        res.send('Recipe deleted!')
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
