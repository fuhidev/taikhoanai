import { addSampleData } from "./add-sample-data";

// Run the script
addSampleData()
 .then(() => {
  // Script completed successfully!
  process.exit(0);
 })
 .catch((error) => {
  // Script failed: ${error}
  process.exit(1);
 });
