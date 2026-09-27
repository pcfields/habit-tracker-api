import { app } from "./server.ts";
import { env } from "../env.ts";

app.listen(env.PORT, () => {
  console.log(`The Server running on port: ${env.PORT}`);
  console.log(`NODE_ENV: ${env.NODE_ENV}`);
  console.log(`APP_STAGE: ${env.APP_STAGE}`);
});
