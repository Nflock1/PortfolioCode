module.exports = 
{ 
  //this should be the "connect" url"
  clusterURL: "mongodb+srv://nflock:oKrIDrWV55SQef0A@cluster0.8jcsfe0.mongodb.net?retryWrites=true&w=majority&appName=Cluster0",
  //the name will be inserted into above URL at runtime
  databaseName: "sample_airbnb",
  //the collection of objects that will be changed
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