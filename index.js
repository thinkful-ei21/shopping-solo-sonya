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
  checkFilterCheckbox: false 
};

function generateItemElement(item,index){

  return  `<li class="js-item-index-element" data-item-index="${item[index]}">
  <span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name}</span>
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
  const items = shoppingList.map((item,index) => generateItemElement(item,index));
  return items.join(' ');
}

function filterShoppingList(items) {
  let shoppingListItemsString;
  if (STORE.checkFilterCheckbox === true) {
    const filteredShoppingList = items.filter((element, index) => {
      element[index] = index;
      return element.checked === false;
    });
    console.log(filteredShoppingList);
    shoppingListItemsString = generateShoppingItemsString(filteredShoppingList);
    return shoppingListItemsString;
  } else {
    shoppingListItemsString = generateShoppingItemsString(items);
    return shoppingListItemsString;
  }
}


function renderShoppingList() {
  const items = [...STORE.items];  
  let shoppingListItemsString = filterShoppingList(items);
  $('.js-shopping-list').html(shoppingListItemsString);  
}


// const shoppingListItemString = generateShoppingItemsString(STORE.items);  
// $('.js-shopping-list').html(shoppingListItemString); 



function addItemToShoppingList(itemName) {
  console.log(`Adding ${itemName} to shopping list`);
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

function toggleCheckedForListItem(index) {
  console.log(index);
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



function handleCheckedFilterCheckbox() {
  $('.js-check-filter-checkbox').on('change', function(event) {
    console.log('you checked the box');
    if (event.currentTarget.checked) {
      STORE.checkFilterCheckbox = true;
      console.log('it`s set to true');
    } else {
      STORE.checkFilterCheckbox = false;
      console.log('it`s set to false');
    }
   
    console.log(STORE.checkFilterCheckbox);
    renderShoppingList();
  });
}

//capture checkbox input from user

function checkedFilter() {}
//filter data to show only unchecked items



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
}

// when the page loads, call `handleShoppingList`
$(handleShoppingList);