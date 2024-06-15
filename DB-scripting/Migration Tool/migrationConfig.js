export default
{ 
  //this should be the URL to your MongoDB database
  connectionURL: "",

  query: [ 
    {
    key: "exchangeIds.exchangeAuth",
    value: "undefined"
    }
  ],
  updates: [
    {
      oldName:"exchangeIds.$[].exchangeAuth",
      oldValue:"",
      newName:"exchangeIds.$[].exchangeAuth",
      newValue:"APIKey"
    }
  ]
}