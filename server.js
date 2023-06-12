// Import modules
const express = require("express");
const fs = require("fs");
const app = express();
const port = 3000;

app.use(express.static(__dirname));
app.use(express.json());

// Giving (serving) home page
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Only fires when you hit add, edit, or delete and only has the context of that one action
app.post("/update", (req, res) => {
  // Here we are storing the value of the action of list items
  const action = req.body.action;
  // Here we are stroing a value of old and new items from our json data
  const oldItem = req.body.oldItem;
  const newItem = req.body.newItem;

  // Here we are using the readFile built i function to read and display json data
  fs.readFile("data.json", "utf8", (err, data) => {
    // Error handling
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to read JSON file" });

      // If able to read file, implement following code
    } else {
      // Set jsonData equal to empty string so we can add items to it
      let jsonData = [];
      // If there is data, parse it
      if (data) {
        jsonData = JSON.parse(data);
      }
      // If the item's action is set to add, push it to the empty json array
      if (action === "added") {
        jsonData.push(newItem);
        // If the item's action is set to removed, use splice of that item's index to remove the item from the josn array
      } else if (action === "removed") {
        const rmvIndex = jsonData.indexOf(oldItem);
        // Use if statement to ensure the item is in the array
        if (rmvIndex !== -1) {
          jsonData.splice(rmvIndex, 1);
        }
        // If the item's action is set to update, use indexOf to find and replace that item in the array
      } else if (action === "updated") {
        const updatedIndex = jsonData.indexOf(oldItem);
        if (updatedIndex !== -1) {
          jsonData[updatedIndex] = newItem;
        }
      }

      // Here is where we actually rewrite the json data as items are added, removed, and updated
      fs.writeFile("data.json", JSON.stringify(jsonData), "utf8", (err) => {
        // Error handling
        if (err) {
          console.error(err);
          res.status(500).json({ error: "Failed to update JSON file" });
        } else {
          res.json({ message: "JSON file updated successfully" });
        }
      });
    }
  });
});

// Set local port
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
