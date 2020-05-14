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
    },
    budget: 0,
    percentage: -1,
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

    calculateTotal: function(type) {
      let sum = 0;
      data.allItems[type].forEach((cur) => {
        sum += cur.value;
      });
      data.total[type] = sum;
    },

    calculateBudget: function() {
      // 1. calculate expnexes nad income
      this.calculateTotal('inc');
      this.calculateTotal('exp');

      // 2. calculate budget
      data.budget = data.total.inc - data.total.exp;

      //3. calculate the percentage of income we spent
      if(data.total.inc > 0) {
        data.percentage = Math.round((data.total.exp / data.total.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },

    getBudget: function() {
      return {
        budget: data.budget,
        totalInc: data.total.inc,
        totalExp: data.total.exp,
        percentage: data.percentage,
      }
    }
  };


})();


// user interface controller
const UIController = (() => {
  const DOMStrings = {
    inputType: '.add-type',
    inputDescription: '.add-description',
    inputValue: '.add-value',
    inputBtn: '.add-btn',
    incomeContainer: '.income-list',
    expensesContainer: '.expenses-list',
  }

  return {
    getInput: () => {
      return {
        type: document.querySelector(DOMStrings.inputType).value,
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMStrings.inputValue).value),
      }
    },

    addListItem: (obj,type) => {
      let html,newHtml,element;
      //create html string with placeholder
      if(type === 'inc') {
        element = DOMStrings.incomeContainer;
        html = '<div class="item" id="income-%id%"><div class="item-description">%description%</div><div class="right"><div class="item-value">+ %value%</div><div class="item-delete"><button class="item-delete-btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
      } else if(type === 'exp') {
        element = DOMStrings.expensesContainer;
        html =  '<div class="item" id="expense-%id%"><div class="item-description">%description%</div><div class="right"><div class="item-value">- %value%</div><div class="item__percentage">21%</div><div class="item-delete"><button class="item-delete-btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
      }
      // replace place holder with some actual date
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', obj.value);
      // insert html to DOM
      document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);

    },

    clearFields: function() {
      let fields,fieldsArr;

      fields = document.querySelectorAll(DOMStrings.inputDescription + ',' + DOMStrings.inputValue);
      fieldsArr = Array.prototype.slice.call(fields);

      fieldsArr.forEach((item)=> {
        item.value = '';
      });

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

  function updateBudget() {
    let budget;
    // 1. calculate budget
    budgetCtrl.calculateBudget();

    // 2.return budget
    budget = budgetCtrl.getBudget();

    //3. display budget
    console.log(budget);
  }

  function ctrlAddItems() {

    // 1. get input date
    const input = UICtrl.getInput();
    // 2.add item to budget controlor
    if(input.description !== '' && !isNaN(input.value) && input.value > 0) {
      const newItem = budgetCtrl.addItem(input.type, input.description, input.value);
      // 3. add item to ui
      UICtrl.addListItem(newItem,input.type);
      // 4. clear filed
      UICtrl.clearFields();
      // 5. calculate and update budget
      updateBudget();

    }
  }

  return {
    init: () => {
      console.log('Aplication has started.');
      setupEventListener();
    }
  };

})(budgetController,UIController);
controller.init();
