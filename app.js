const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const config = require('config');



const app = express();
const PORT = process.env.PORT || 5000;


// Internal Imports
const responseUtil = require('./src/lib/common_utils');


// Router Imports
const documentRouter = require('./src/routers/document');


// Server Configs
require('./config/database/mongo');
app.use(express.json({ limit: "10mb", extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
if (config.util.getEnv('NODE_ENV') !== 'test')
{
  app.use(morgan("dev"));  
}
// loading routers
app.use('/documents', documentRouter);




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