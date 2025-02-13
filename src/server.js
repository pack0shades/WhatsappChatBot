import cron from "node-cron";
import "dotenv/config";
import connectDB from "./db/db.js";
import { app } from "./app.js";
import { processUsers } from "./utils/utils.js";


(async () => {
    try {
        const schedule = process.env.CRON_SCHEDULE || '* * * * *'; // Default: every hour
        console.log(`Cron job scheduled with: ${schedule}`);

        await connectDB().then(() => {
            app.listen(process.env.PORT || 8000, () => {
                console.log(`Server running at port: ${process.env.PORT}`);
            });
            // processUsers();
        })

        cron.schedule(schedule, async () => {
            processUsers();

            console.log('Cron job running...');
        });

    } catch (error) {
        console.error("Error during server initialization:", error);
    }
})()