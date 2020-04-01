console.log("before begining in my main");

const run = require("./get-release");

if (require.main === module) {
  console.log("calling run in my main");
  run();
}
