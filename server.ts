import app from "./src/app";
import { config } from "./src/config/config";
import connectToMongoDB from "./src/config/db";

const startServer = async () => {
  // connect to mongodb database
  await connectToMongoDB();

  const port = config.port;

  app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
  });
};

startServer();
