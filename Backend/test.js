import { Interview } from "./src/models/interview.model.js";
const data = { cname: "akshat", iname: "rishi" };

// setInterval(()=>{
//   console.log(Date.now());
// },2000)

export const fn = async () => {
  const currentTime = Date.now();

  const user = await Interview.findOne({
    candidateId: "67b954e8ab11597515bf1663",
  });

  const start = await user.scheduledAt.getTime();
  const duration = (await user.durationMinutes) * 60 * 1000;

  console.log("Current Time:", currentTime);
  console.log("User:", user);
  console.log("Start Time:", start);
  console.log("Duration:", duration);
};
