const budgetController = (() => {

  const Expenses = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  }

  const Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  }

  const data = {
    allItems: {
      exp: [],
      inc: []
    },
    total: {
      exp: 0,
      inc: 0,
    }
  }

  return {
    addItem: (type, des, val) => {
      let newItem;
      let ID;
      //create new id
      if(data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }
      //create new item
      if(type === 'exp') {
        newItem = new Expenses(ID, des, val);
      } else if(type === 'inc') {
        newItem = new Income(ID, des, val);
      }
      // push into data structure
      data.allItems[type].push(newItem);
      // return new element
      return newItem;
    },
    testing: () => {
      console.log(data);
    }
  };


})();

const UIController = (() => {
  const DOMStrings = {
    inputType: '.add-type',
    inputDescription: '.add-description',
    inputValue: '.add-value',
    inputBtn: '.add-btn'
  }

  return {
    getInput: () => {
      return {
        type: document.querySelector(DOMStrings.inputType).value,
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: document.querySelector(DOMStrings.inputValue).value,
      }
    },
    getDOMStrings: () => {
      return DOMStrings;
    }
  }
})();

const controller = ((budgetCtrl,UICtrl) => {

  // functions
  function setupEventListener() {
    const DOM = UICtrl.getDOMStrings();
    const addItemBtn = document.querySelector(DOM.inputBtn);

    addItemBtn.addEventListener('click',ctrlAddItems);
    addItemBtn.addEventListener('keypress', (event) => {
    if( event.keyCode === 13 ) {
      ctrlAddItems();
    }
  })
  }

  function ctrlAddItems() {

    // 1. get input date
    input = UICtrl.getInput();
    // 2.add item to budget controlor
    budgetCtrl.addItem(input.type, input.description, input.value);
  }

  return {
    init: () => {
      console.log('Aplication has started.');
      setupEventListener();
    }
  };

})(budgetController,UIController);
controller.init();
