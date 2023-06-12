// Adding event listener to entore document for content to be loaded
document.addEventListener("DOMContentLoaded", function () {
  // Selecting document items
  const itemInput = document.getElementById("item-input");
  const addButton = document.getElementById("add-button");
  const itemList = document.getElementById("item-list");

  //Adding on click listener to add item button
  addButton.addEventListener("click", function () {
    // Sets item value equal to user input
    const newItem = itemInput.value;
    // If else to validate input to not be empty
    if (newItem !== "") {
      // Calls callback functnio to add the new item to the list if input field is not empty
      addListItem(newItem);
      // Reset input to empty
      itemInput.value = "";
      // Calls on fucntion to add new items in json
      updateJSONFile("", newItem, "added");
    }
    // Validate that user entered input
    if (newItem === "") {
      alert("Please do not create empty tasks!");
    }
  });

  // Creating event listener for item list div to listen for click
  itemList.addEventListener("click", function (event) {
    // Use .target to set target variable to what was clicked in the click event
    const target = event.target;
    // If else statement to see if clicked item contains a class list of "remove-button" vs. edit button and impletemnt corresponding code
    if (target.classList.contains("remove-button")) {
      // Getting the reference to the existing html list item through parentNode
      const listItem = target.parentNode;
      // console.log(parentNode);
      // Grabs the span tag that the text lives inside of
      const itemText = listItem.querySelector(".item-text");
      // This gets the text itself from the span tag
      const item = itemText.textContent;
      // Creates confirm fucntion to ask user if they are sure, if yes, it returns true and vise versa
      const confirmRemove = confirm(`Are you sure you want to remove "${item}"?`);
      // if true, remove with later function, if not, do not remove
      if (confirmRemove) {
        removeListItem(listItem);
        // Here we are updting the json file
        // Item will be replaced with an empty string and it's action will be set to remove
        updateJSONFile(item, "", "removed");
      }
      // If clicked item contains class edit button
    } else if (target.classList.contains("edit-button")) {
      // Grabs parent element of the target element
      const listItem = target.parentNode;
      // Grabs the span tag that the text lives inside of
      const itemText = listItem.querySelector(".item-text");
      // Here we are setting the item variable to the item's original text content
      const item = itemText.textContent;
      // Setting the new text entered in prompt to updatedItem variable
      const updatedItem = prompt("Enter the updated value:", item);
      // If the field is left empty implemetn folong code
      if (updatedItem !== null && updatedItem !== "") {
        // Setting text content to what is enetered in prompt
        itemText.textContent = updatedItem;
        // Updating json file and setting action to update
        updateJSONFile(item, updatedItem, "updated");
      }
    }
  });

  // Creates actual elements to page in html, sets their content to be what user entered, and sets class list
  function addListItem(item) {
    const listItem = document.createElement("li");
    const itemText = document.createElement("span");
    itemText.textContent = item;
    itemText.classList.add("item-text");
    const removeButton = createButton("Remove", "remove-button");
    const editButton = createButton("Edit", "edit-button");
    listItem.appendChild(itemText);
    listItem.appendChild(removeButton);
    listItem.appendChild(editButton);
    itemList.appendChild(listItem);
  }

  // Removing the child element of list of items
  function removeListItem(listItem) {
    itemList.removeChild(listItem);
  }

  // Function used in addListItem
  function createButton(text, className) {
    const button = document.createElement("button");
    button.textContent = text;
    button.className = className;
    return button;
  }

  // Using fetch to hit the endpoint with a post request
  // Passing it a body
  function updateJSONFile(oldItem, newItem, action) {
    // We are building the body of the message with this object
    const requestBody = { oldItem: oldItem, newItem: newItem, action: action };
    fetch("/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        alert(`Your task has been ${action}! :)`);
      })
      .catch((error) => console.error(error));
  }
});
