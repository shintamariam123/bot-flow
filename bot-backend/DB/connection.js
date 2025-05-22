const mongoose = require('mongoose')

mongoose.connect(process.env.CONNECTION_STRING).then(
    result=>{
      console.log("Mongodb Atlas connected ith botServer");
    }
).catch(err=>{
  console.log("Connection Failed!!!");
  console.log(err);
})