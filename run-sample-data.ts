import { addSampleData } from "./add-sample-data";

// Run the script
addSampleData()
 .then(() => {
  console.log("Script completed successfully!");
  process.exit(0);
 })
 .catch((error) => {
  console.error("Script failed:", error);
  process.exit(1);
 });
