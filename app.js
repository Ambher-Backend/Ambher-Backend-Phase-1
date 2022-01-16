const express = require('express');
const cors = require('cors');
const morgan = require('morgan');



const app = express();
const PORT = process.env.PORT || 5000;


// Internal Imports
const responseUtil = require('./src/lib/common_utils');


// Server Configs
app.use(express.json({ limit: "10mb", extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));


app.get('/', async (req, res) => {
  try{
    res.send(responseUtil.responseUtil(200, "Api is working fine", err.message));
  }catch(err){
    res.send(responseUtil.responseUtil(500, null, err.message));
  }
});


app.listen(PORT, () => {
  console.log(`Server is up and running at PORT: ${PORT}`);
})