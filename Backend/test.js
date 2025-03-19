import { Interview } from "./src/models/interview.model.js";
const data = { cname: "akshat", iname: "rishi" };

// setInterval(()=>{
//   console.log(Date.now());
// },2000)

export const fn = async () => {
  const interviewId = "67dade1c4b347ee9efd8ce06";
  const timeZoneOffset = 5.5 * 60 * 60 * 1000; // Offset for IST (UTC+5:30)

  // Fetch the interview details
  const interview = await Interview.findById(interviewId);
  if (!interview) {
    console.error("Interview not found");
    return;
  }

  // Extract relevant details
  const scheduledAt = interview.scheduledAt.getTime();
  const durationMs = interview.durationMinutes * 60 * 1000;
  const endTime = scheduledAt + durationMs;

  // Adjust current time for the time zone
  const currentTime = Date.now() + timeZoneOffset;

  // Calculate remaining time
  const remainingTime = endTime - currentTime;

  // Log the details
  console.log("Start time is:", scheduledAt);
  console.log("Total duration is:", durationMs);
  console.log("End time is:", endTime);
  console.log("Current time (adjusted) is:", currentTime);
  console.log("Remaining time is:", remainingTime, "ms");

  // Check if the current time is within the interview time slot
  const isWithinInterviewTime = currentTime > scheduledAt && currentTime < endTime;
  console.log("Is within interview time:", isWithinInterviewTime);

  // Additional check to display a user-friendly message
  if (isWithinInterviewTime) {
    console.log(`Interview is ongoing. Time remaining: ${Math.floor(remainingTime / (60 * 1000))} minutes.`);
  } else if (currentTime < scheduledAt) {
    console.log(`Interview has not started yet. It will start in ${Math.floor((scheduledAt - currentTime) / (60 * 1000))} minutes.`);
  } else {
    console.log("Interview has already ended.");
  }
};
