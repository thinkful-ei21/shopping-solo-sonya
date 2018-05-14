'use strict';

// `STORE` is responsible for storing the underlying data
// that our app needs to keep track of in order to work.
//
// for a shopping list, our data model is pretty simple.
// we just have an array of shopping list items. each one
// is an object with a `name` and a `checked` property that
// indicates if it's checked off or not.
// we're pre-adding items to the shopping list so there's
// something to see when the page first loads.
const STORE = {
  items: [{name: 'apples', checked: false},
    {name: 'oranges', checked: false},
    {name: 'milk', checked: true},
    {name: 'bread', checked: false}],
  checkFilterCheckbox: false,
  search: '', 
  editInput: {},
};

//Render the page

function generateItemElement(item,index){
  return  `<li class="js-item-index-element" data-item-index="${index}">
  <form class='js-item-edit-form'>
    <span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name}</span>
    <label for='edited-item-value'>Edit your Item</label>
    <input type='text' name='edited-item-value' class='js-edited-item-value' 'edited-item-text-box'>
    <button type='submit'>Edit</button>
  </form><br>
  <div class="shopping-item-controls">
    <button class="shopping-item-toggle js-item-toggle">
        <span class="button-label">check</span>
    </button>
    <button class="shopping-item-delete js-item-delete">
        <span class="button-label">delete</span>
    </button>
  </div>
</li>`;
}

function generateShoppingItemsString(shoppingList){
  const items = shoppingList.map((item, index) => generateItemElement(item,index));
  if (STORE.search !== '') {
    return findSearchItem(items);
  } else if (STORE.checkFilterCheckbox === true) {
    const filteredCheckedItems = filterCheckedItems(items); 
    return filteredCheckedItems.join(' ');
  } else {
    return items.join(' ');
  }
}

// function editShoppingItemsStringNames(items) {
//   const shoppingItemsString = generateShoppingItemsString(items);
// }


function renderShoppingList() {
  const items = [...STORE.items];  
  //let editedItems = editItem(items);
  let shoppingListItemsString = generateShoppingItemsString(items);
  //if name is edited, run function that changes the name in STORE.items array;
  $('.js-shopping-list').html(shoppingListItemsString);  
  //handleItemEditSubmit();
} 

//add new items to shopping list

function addItemToShoppingList(itemName) {
  STORE.items.push({name: itemName, checked: false});
}

function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function(event) {
    event.preventDefault();
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
}


//check and uncheck items

function toggleCheckedForListItem(index) {
  STORE.items[index].checked = !STORE.items[index].checked;
}

function getItemIndexFromElement(item) {
  const itemIndexString = $(item)
    .closest('.js-item-index-element')
    .attr('data-item-index');
  return (parseInt(itemIndexString, 10));
}

function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', '.js-item-toggle', event => {
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    toggleCheckedForListItem(itemIndex);
    renderShoppingList();
  });
}

//delete list items

function deleteListItem(index) {
  return STORE.items.splice(index, 1);
}

function handleDeleteItemClicked() {
  $('.js-shopping-list').on('click', '.js-item-delete', event => {
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    deleteListItem(itemIndex);
    renderShoppingList();
  });
}

//filter out all checked items from list

function handleCheckedFilterCheckbox() {
  $('.js-check-filter-checkbox').on('change', function(event) {
    if (event.currentTarget.checked) {
      STORE.checkFilterCheckbox = true;
    } else {
      STORE.checkFilterCheckbox = false;
    }
    renderShoppingList();
  });
}

function filterCheckedItems(items) {
  return items.filter(item => item.indexOf('shopping-item__checked') === -1);
}

//search for specific item regardless of checked status

function findSearchItem(items) {
  return items.find(item => item.includes(STORE.search));
}

function handleSearchSubmit() {
  $('#js-search-form').submit(function(event) {
    event.preventDefault();
    const searchInput = $('.js-search-box').val();
    STORE.search = searchInput;
    renderShoppingList();
  });
}

//edit the item

function handleItemEditSubmit() {
  $('.shopping-list').on('submit', '.js-item-edit-form', function(event) {
    event.preventDefault();
    const index = getItemIndexFromElement(event.currentTarget);
    const editedItemInput = $(event.currentTarget).closest('form').find('.js-edited-item-value').val();
    $('.js-edited-item-text-box').val('');
    STORE.items[index].name = editedItemInput;
    renderShoppingList();
  });
}

// this function will be our callback when the page loads. it's responsible for
// initially rendering the shopping list, and activating our individual functions
// that handle new item submission and user clicks on the "check" and "delete" buttons
// for individual shopping list items.
function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleCheckedFilterCheckbox();
  handleSearchSubmit();
  handleItemEditSubmit();
}

// when the page loads, call `handleShoppingList`
$(handleShoppingList);