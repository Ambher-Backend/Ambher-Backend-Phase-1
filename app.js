const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const config = require("config");



const app = express();
const PORT = process.env.PORT || 5000;


// Internal Imports
const commonUtils = require("./src/lib/common_utils");
const responseCodes = require("./src/lib/constants").RESPONSE_CODES;


// Router Imports
const documentRouter = require("./src/routers/document");
const adminRouter = require("./src/routers/admin");
const customerRouter = require("./src/routers/customer");
const vendorRouter = require("./src/routers/vendor");
const productRouter = require("./src/routers/product");
const publicRouter = require("./src/routers/public");


// Cron Jobs
const slackCronJobs = require("./crons/slack-notifier");


// Server Configs
require("./config/database/mongo");
app.use(express.json({ limit: "10mb", extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
if (config.util.getEnv("NODE_ENV") !== "test")
{
  app.use(morgan("dev"));
}
// loading routers
app.use("/documents", documentRouter);
app.use("/admin", adminRouter);
app.use("/customer", customerRouter);
app.use("/vendor", vendorRouter);
app.use("/product", productRouter);
app.use("/public", publicRouter);


app.get("/", async (req, res) => {
  try {
    res.send(commonUtils.responseUtil(responseCodes.SUCCESS_CODE, null, "Api is working fine"));
  } catch (err){
    res.send(commonUtils.responseUtil(responseCodes.INTERNAL_SERVER_ERROR_CODE, null, err.message));
  }
});


app.listen(PORT, () => {
  commonUtils.successLog(`Server is up and running at PORT: ${PORT}`);
});


slackCronJobs.masterKeyNotifier.start();
slackCronJobs.frontendTeamNotifier.start();
slackCronJobs.backendTeamNotifier.start();


module.exports = app;
