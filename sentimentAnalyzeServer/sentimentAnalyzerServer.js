const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

function getNLUInstance(){
    let api_key = process.env.API_KEY;
    let api_url = process.env.API_URL;

    const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
    const { IamAuthenticator } = require('ibm-watson/auth');

    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
        version: '2021-08-01',
        authenticator: new IamAuthenticator({
            apikey: api_key,
        }),
        serviceUrl: api_url,
    });
    return naturalLanguageUnderstanding;
}

const app = new express();

app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());

app.get("/",(req,res)=>{
    res.render('index.html');
  });

app.get("/url/emotion", (req,res) => {
const naturalLanguageUnderstanding = getNLUInstance();
    const analyzeParams = {
        'url': req.query.url,
        'features': {
            'keywords': {
            'emotion': true,
            'sentiment': true,
            'limit': 5,
            },
        },
    };
    
    naturalLanguageUnderstanding.analyze(analyzeParams)
        .then(analysisResults => {
            //console.log(JSON.stringify(analysisResults, null, 2));
            //console.log(analysisResults.result.keywords);
            //console.log(analysisResults.result.keywords[0].emotion);
            let sadness = 0;
            let joy = 0;
            let fear = 0;
            let disgust = 0;
            let anger = 0;
            for (const i in analysisResults.result.keywords) {  
                console.log(analysisResults.result.keywords[i].text)
                console.log(analysisResults.result.keywords[i].emotion)
                console.log(analysisResults.result.keywords[i].emotion.sadness)

                sadness = sadness + analysisResults.result.keywords[i].emotion.sadness
                joy = joy + analysisResults.result.keywords[i].emotion.joy
                fear = fear + analysisResults.result.keywords[i].emotion.fear
                disgust = disgust + analysisResults.result.keywords[i].emotion.disgust
                anger = anger + analysisResults.result.keywords[i].emotion.anger
                }
            sadness = sadness/analysisResults.result.keywords.length
            joy = joy/analysisResults.result.keywords.length
            fear = fear/analysisResults.result.keywords.length
            disgust = disgust/analysisResults.result.keywords.length
            anger = anger/analysisResults.result.keywords.length

            console.log("tot sadness " + sadness)    
            console.log("tot joy " + joy)    
            console.log("tot fear " + fear)    
            console.log("tot disgust " + disgust)    
            console.log("tot anger " + anger)    

            return res.send({"sadness":sadness,"joy":joy,"fear":fear,"disgust":disgust,"anger":anger });
        })
        .catch(err => {
            console.log('error:', err);
            return res.send("error");
    });

    //return res.send({"happy":"90","sad":"10"});
});

app.get("/url/sentiment", (req,res) => {
    const naturalLanguageUnderstanding = getNLUInstance();
    const analyzeParams = {
        'url': req.query.url,
        'features': {
            'keywords': {
            'emotion': true,
            'sentiment': true,
            'limit': 5,
            },
        },
    };
    
    naturalLanguageUnderstanding.analyze(analyzeParams)
        .then(analysisResults => {
            //console.log(JSON.stringify(analysisResults, null, 2));
            //console.log(analysisResults.result.keywords);
            //console.log(analysisResults.result.keywords[0].sentiment);
            let score = 0;
            let label = 'neutral'
            for (const i in analysisResults.result.keywords) {  
               // console.log(analysisResults.result.keywords[i].text)
                //console.log(analysisResults.result.keywords[i].sentiment)
                score = score + analysisResults.result.keywords[i].sentiment.score
                }
            score = score/analysisResults.result.keywords.length
            //console.log(score)

            if (score > 0){
                label = 'positive'
            }

            if (score < 0){
                label = 'negative'
            }

            //console.log('score: ' + score)
            //console.log('label: ' + label)


            return res.send({"score":score,"label":label});
        })
        .catch(err => {
            console.log('error:', err);
            return res.send("error");
    });

});

app.get("/text/emotion", (req,res) => {
    const naturalLanguageUnderstanding = getNLUInstance();
    const analyzeParams = {
        'text': req.query.text,
        'features': {
            'keywords': {
            'emotion': true,
            'sentiment': true,
            'limit': 100,
            },
        },
    };
    
    naturalLanguageUnderstanding.analyze(analyzeParams)
        .then(analysisResults => {
            //console.log(JSON.stringify(analysisResults, null, 2));
            console.log(analysisResults.result);
            console.log(analysisResults.result.keywords[0].emotion);
            console.log("length" + analysisResults.result.keywords.length);

            for (const i in analysisResults.result.keywords) {  
                console.log(analysisResults.result.keywords[i].text)
                console.log(analysisResults.result.keywords[i].emotion)
                }

            return res.send(analysisResults.result.keywords[0].emotion);
        })
        .catch(err => {
            console.log('error:', err);
            return res.send("error");
    });

});

app.get("/text/sentiment", (req,res) => {
    const naturalLanguageUnderstanding = getNLUInstance();
    const analyzeParams = {
        'text': req.query.text,
        'features': {
            'keywords': {
            'sentiment': true,
            'limit': 100,
            },
        },
    };
    
    naturalLanguageUnderstanding.analyze(analyzeParams)
        .then(analysisResults => {
            //console.log(JSON.stringify(analysisResults, null, 2));
            //console.log(analysisResults.result);

            for (const i in analysisResults.result.keywords) {  
               // console.log(analysisResults.result.keywords[i].text)
               // console.log(analysisResults.result.keywords[i].sentiment.score)
                }

            return res.send(analysisResults.result.keywords[0].sentiment);
        })
        .catch(err => {
            console.log('error:', err);
            return res.send("error");
    });
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

