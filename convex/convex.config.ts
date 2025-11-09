import { defineApp } from "convex/server";
import presence from "@convex-dev/presence/convex.config";
import resend from "@convex-dev/resend/convex.config";


const app = defineApp();
app.use(presence);
app.use(resend);


export default app;
