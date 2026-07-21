// import cron from "node-cron";
// import AbandonedCart from "../models/abandonedcartModel.js";
// import { prepareRestoreLink } from "../controllers/abandonedcartController.js";
// import { sendAbandonedCartEmail } from "../utils/mailer.js"; // you will implement
// // later: import { sendAbandonedCartAisensy } from "../utils/sendAisensy.js";
// import User from "../models/authModel.js";   // adjust path as needed
                                                                                                                                    
// // 1. Send stage‑1 reminder (1 hour after last activity)
// export const sendStage1Reminders = async () => {
//   try {
//     const oneHourAgo = new Date(Date.now() - 1 * 60 * 1000);
//     const carts = await AbandonedCart.find({
//       lastActivity: { $lte: oneHourAgo },
//       "remindersSent.stage1": false,
//       isRestored: false,
//       items: { $exists: true, $not: { $size: 0 } },
//     });

//     for (const cart of carts) {
//       const restoreLink = await prepareRestoreLink(cart);
//       // Send email – adapt to use user's email
//       const user = await User.findById(cart.userId).lean(); // fetch user email if needed
//       const email = user?.email || cart.email;
//       if (email) {
//         await sendAbandonedCartEmail(email, restoreLink, cart.items);
//       }
//       // Mark stage1 as sent
//       cart.remindersSent.stage1 = true;
//       await cart.save();
//     }
//     console.log(`Stage 1 reminders sent to ${carts.length} users`);
//   } catch (error) {
//     console.error("Error sending stage 1 reminders:", error);
//   }
// };

// // 2. Stage‑2 reminder (24 hours later) – similar, just change time and stage flag
// export const sendStage2Reminders = async () => {
//   try {
//     const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
//     const carts = await AbandonedCart.find({
//       lastActivity: { $lte: twentyFourHoursAgo },
//       "remindersSent.stage1": true, // must have already received stage1
//       "remindersSent.stage2": false,
//       isRestored: false,
//       items: { $exists: true, $not: { $size: 0 } },
//     });
//     // same sending logic…
//   } catch (error) {
//     console.error("Error sending stage 1 reminders:", error);
//   }
// };

// // 3. Cleanup expired carts (remove documents with expired tokens)
// export const removeExpiredCarts = async () => {
//   try {
//     const result = await AbandonedCart.deleteMany({
//       restoreTokenExpiry: { $lt: new Date() },
//       isRestored: false,
//     });
//     console.log(`Removed ${result.deletedCount} expired abandoned carts`);
//   } catch (error) {
//     console.error("Error removing expired carts:", error);
//   }
// };

// // Schedule all jobs
// export const scheduleAbandonedCartJobs = () => {
//   // Run every 15 minutes to check for stage‑1 reminders
// //   cron.schedule("*/15 * * * *", sendStage1Reminders);
//     cron.schedule("* * * * *", sendStage1Reminders);

//   // Run every hour to check for stage‑2 reminders
//   cron.schedule("0 * * * *", sendStage2Reminders);
//   // Run every 6 hours to clean expired tokens
//   cron.schedule("0 */6 * * *", removeExpiredCarts);
//   console.log("Abandoned cart jobs scheduled.");
// };



// import cron from "node-cron";
// import AbandonedCart from "../models/abandonedcartModel.js";
// import { prepareRestoreLink } from "../controllers/abandonedcartController.js";
// import { sendAbandonedCartEmail } from "../utils/mailer.js";
// import User from "../models/authModel.js";   // adjust path if needed

// // ---------- STAGE 1 ----------
// export const sendStage1Reminders = async () => {
//   try {
//     const oneMinuteAgo = new Date(Date.now() - 1 * 60 * 1000); // 1 min
//     const carts = await AbandonedCart.find({
//       lastActivity: { $lte: oneMinuteAgo },
//       "remindersSent.stage1": false,
//       isRestored: false,
//       items: { $exists: true, $not: { $size: 0 } },
//     });

//     for (const cart of carts) {
//       const restoreLink = await prepareRestoreLink(cart);
//       const user = await User.findById(cart.userId).lean();
//       const email = user?.email || cart.email;
//       if (email) {
//         await sendAbandonedCartEmail(email, restoreLink, cart.items);
//       }
//       cart.remindersSent.stage1 = true;
//       await cart.save();
//     }
//     console.log(`Stage 1 reminders sent to ${carts.length} users`);
//   } catch (error) {
//     console.error("Error sending stage 1 reminders:", error);
//   }
// };

// // ---------- STAGE 2 ----------
// export const sendStage2Reminders = async () => {
//   try {
//     const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000); // 2 min
//     const carts = await AbandonedCart.find({
//       lastActivity: { $lte: twoMinutesAgo },
//       "remindersSent.stage1": true,
//       "remindersSent.stage2": false,
//       isRestored: false,
//       items: { $exists: true, $not: { $size: 0 } },
//     });

//     for (const cart of carts) {
//       // Reuse the existing restore link – it's still valid (24h expiry)
//       const restoreLink = `${process.env.FRONTEND_URL}/cart/restore?token=${cart.restoreToken}`;
//       const user = await User.findById(cart.userId).lean();
//       const email = user?.email || cart.email;
//       if (email) {
//         await sendAbandonedCartEmail(email, restoreLink, cart.items);
//       }
//       cart.remindersSent.stage2 = true;
//       await cart.save();
//     }
//     console.log(`Stage 2 reminders sent to ${carts.length} users`);
//   } catch (error) {
//     console.error("Error sending stage 2 reminders:", error);
//   }
// };

// // ---------- STAGE 3 ----------
// export const sendStage3Reminders = async () => {
//   try {
//     const threeMinutesAgo = new Date(Date.now() - 3 * 60 * 1000); // 3 min
//     const carts = await AbandonedCart.find({
//       lastActivity: { $lte: threeMinutesAgo },
//       "remindersSent.stage2": true,
//       "remindersSent.stage3": false,
//       isRestored: false,
//       items: { $exists: true, $not: { $size: 0 } },
//     });

//     for (const cart of carts) {
//       const restoreLink = `${process.env.FRONTEND_URL}/cart/restore?token=${cart.restoreToken}`;
//       const user = await User.findById(cart.userId).lean();
//       const email = user?.email || cart.email;
//       if (email) {
//         await sendAbandonedCartEmail(email, restoreLink, cart.items);
//       }
//       cart.remindersSent.stage3 = true;
//       await cart.save();
//     }
//     console.log(`Stage 3 reminders sent to ${carts.length} users`);
//   } catch (error) {
//     console.error("Error sending stage 3 reminders:", error);
//   }
// };

// // ---------- CLEANUP ----------
// export const removeExpiredCarts = async () => {
//   try {
//     const result = await AbandonedCart.deleteMany({
//       restoreTokenExpiry: { $lt: new Date() },
//       isRestored: false,
//     });
//     console.log(`Removed ${result.deletedCount} expired abandoned carts`);
//   } catch (error) {
//     console.error("Error removing expired carts:", error);
//   }
// };

// // ---------- SCHEDULE (TEST MODE) ----------
// export const scheduleAbandonedCartJobs = () => {
//   // ALL run every minute – for testing only!
//   cron.schedule("* * * * *", sendStage1Reminders);
//   cron.schedule("* * * * *", sendStage2Reminders);
//   cron.schedule("* * * * *", sendStage3Reminders);
//   cron.schedule("* * * * *", removeExpiredCarts);
//   console.log("Abandoned cart jobs scheduled (TEST MODE – all stages every minute).");
// };




import cron from "node-cron";
import AbandonedCart from "../models/abandonedcartModel.js";
import { prepareRestoreLink } from "../controllers/abandonedcartController.js";
import { sendAbandonedCartEmail } from "../utils/mailer.js";
import User from "../models/authModel.js";

const REMINDER_HOURS = [1, 24, 48, 72, 96, 120, 144]; // hours after lastActivity
// const REMINDER_HOURS = [0.0167, 0.0333, 0.05]; // hours after lastActivity


export const sendReminders = async () => {
  try {
    const now = new Date();
    const carts = await AbandonedCart.find({
      isRestored: false,
      items: { $exists: true, $not: { $size: 0 } },
    });

    let sent = 0;

    for (const cart of carts) {
      const elapsedHours = (now - cart.lastActivity) / (1000 * 60 * 60);
      const nextReminderIndex = cart.reminderCount; // 0,1,2…

      // No more reminders to send
      if (nextReminderIndex >= REMINDER_HOURS.length) continue;

      const requiredHours = REMINDER_HOURS[nextReminderIndex];

      if (elapsedHours >= requiredHours) {
        // First reminder generates a restore link; later reminders reuse it
        let restoreLink;
        if (!cart.restoreToken) {
          restoreLink = await prepareRestoreLink(cart);
        } else {
          restoreLink = `${process.env.FRONTEND_URL}/frontend/cart/restore?token=${cart.restoreToken}`;
        }

        const user = await User.findById(cart.userId).lean();
        const email = user?.email || cart.email;
        if (email) {
          await sendAbandonedCartEmail(email, restoreLink, cart.items);
        }

        cart.reminderCount += 1;
        cart.lastReminderSentAt = new Date();
        await cart.save();
        sent++;
      }
    }

    console.log(`Reminders sent to ${sent} carts`);
  } catch (error) {
    console.error("Error sending reminders:", error);
  }
};

// Remove carts older than 7 days (168 hours)
export const removeOldCarts = async () => {
  try {
    const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const result = await AbandonedCart.deleteMany({
      lastActivity: { $lt: cutoff },
      isRestored: false,
    });
    console.log(`Removed ${result.deletedCount} carts older than 7 days`);
  } catch (error) {
    console.error("Error removing old carts:", error);
  }
};

// ---------- SCHEDULE ----------
export const scheduleAbandonedCartJobs = () => {
  // Check reminders every 15 minutes (use "* * * * *" for testing)
  cron.schedule("*/15 * * * *", sendReminders);
    // cron.schedule("* * * * *", sendReminders);


  // Cleanup old carts every hour
  cron.schedule("0 * * * *", removeOldCarts);

  console.log("Abandoned cart jobs scheduled.");
};