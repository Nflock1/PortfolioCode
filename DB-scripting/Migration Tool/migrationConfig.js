module.exports = 
{ 
  //this should be the URL to your MongoDB database
  clusterURL: "mongodb+srv://nflock:oKrIDrWV55SQef0A@cluster0.8jcsfe0.mongodb.net?retryWrites=true&w=majority&appName=Cluster0",
  databaseName: "sample_airbnb",
  collection: "listingsAndReviews",
  query: [ 
    {
    key: "listing_url",
    value: "https://www.airbnb.com/rooms/10006546"
    }
  ],
  updates: [
    {
      oldName:"price",
      oldValue:"",
      newName:"",
      newValue: 90.00
    }
  ]
}