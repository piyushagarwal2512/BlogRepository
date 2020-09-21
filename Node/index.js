const express=require("express")
const app=express()
const axios=require("axios");



app.use(express.json())

//middleare to set he headers
app.use((req,res,next)=>{
  res.setHeader('Access-Control-Allow-Origin','http://localhost:3000');
  next()
})


//send the category data
app.get("/category",async(req,res,next)=>{
    try{
        let data=await axios({method:"GET",url:"https://public-api.wordpress.com/rest/v1.1/sites/107403796/categories",responseType: "stream"})
        let response=await streamToString(data.data);
        res.status(200).send(JSON.parse(response))
    }
    catch(e){
        res.status(404).send(e)
    }
    })

//send the post related to selected category
app.get("/category/posts",async(req,res,next)=>{
  try{
      let data=await axios({method:"GET",url:"https://public-api.wordpress.com/rest/v1.1/sites/107403796/posts",responseType: "stream"})
      let response=await streamToString(data.data);
      let convertedData=await convertDataAccordingToCategoryOrTag(response,req.query['categoryName'],false)
      res.status(200).send(convertedData)
  }
      catch(e){
          res.status(404).send(e)
      }

})

//send the trending tags data
app.get("/tags",async(req,res,next)=>{
  try{
      let data=await axios({method:"GET",url:"https://public-api.wordpress.com/rest/v1.1/read/trending/tags",responseType: "stream"})
      let response=await streamToString(data.data);
      var tagData = JSON.parse(response)
      //sort the data according to postcount
      tagData && tagData.tags && tagData.tags.sort(function(a,b){
            if( a.count < b.count)
            {
              return 1;
            }
            else
            {
              return -1;
            }
          });
          //send only top10 trending tags
      if(tagData && tagData.tags && tagData.tags.length >10)
      {
        tagData.tags.splice(10);
      }

      res.status(200).send(tagData)
  }
  catch(e){
      res.status(404).send(e)
  }
  })


  //send the posts related to the tag
  app.get("/tag/posts",async(req,res,next)=>{
    try{
        let data=await axios({method:"GET",url:`https://public-api.wordpress.com/rest/v1.1/read/tags/${req.query['tagName']}/posts`,responseType: "stream"})
        let response=await streamToString(data.data);
        let convertedData=await convertDataAccordingToCategoryOrTag(response,req.query['tagName'],true)
        res.status(200).send(convertedData)
    }
        catch(e){
            res.status(404).send(e)
        }
    
    })


//encapsulate the stram data to a response
streamToString= stream => {
    const chunks = [];
    return new Promise((resolve, reject) => {
      stream.on("data", chunk => chunks.push(chunk));
      stream.on("error", reject);
      stream.on("end", () => resolve(Buffer.concat(chunks).toString()));
    });
  }

//convert the data as desired(flag is to check(categorytype or tagtype) if true then tagType)
  convertDataAccordingToCategoryOrTag=(response,nameType,flag)=>{

    let data=[]
    response=JSON.parse(response)
        if(response && response.posts && response.posts.length)
        {
          if(!flag){
          response.posts.forEach(post => {

            if(post.categories && post.categories[nameType])
            {
              post.modified=new Date(post.modified)
              data.push(post)
            }
            
          })
        }
        else
        {
          response.posts.forEach(post => {
            if(post.tags)
            {
              post.modified=new Date(post.modified)
              data.push(post)
            }
            
          })

        }
          
        }

        if(data.length)
        {
          //sort the data on the basis of date
          data.sort(function(a,b){
            return b.modified - a.modified;
          });

          //add new property modifiedTime
           data.forEach((post)=>post.modifiedTime=changeTime(new Date(),post.modified))

        }


        return {
          found:data.length,
          posts:data
        }

  }




//Convert time to modified times
function changeTime(currentTime, previousTime) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsedTime = currentTime - previousTime;

    if (elapsedTime < msPerMinute) {
         return Math.round(elapsedTime/1000) + ' seconds ago';   
    }

    else if (elapsedTime < msPerHour) {
         return Math.round(elapsedTime/msPerMinute) + ' minutes ago';   
    }

    else if (elapsedTime < msPerDay ) {
         return Math.round(elapsedTime/msPerHour ) + ' hours ago';   
    }

    else if (elapsedTime < msPerMonth) {
        return  Math.round(elapsedTime/msPerDay) + ' days ago';   
    }

    else if (elapsedTime < msPerYear) {
        return  Math.round(elapsedTime/msPerMonth) + ' months ago';   
    }

    else {
        return  Math.round(elapsedTime/msPerYear ) + ' years ago';   
    }
}



    //server listen
    app.listen(8000,()=>{
      console.log("server running")  
    })