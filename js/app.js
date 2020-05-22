const budgetController = (() => {

  class Expenses  {
    constructor(id,description,value) {
      this.id = id;
      this.description = description;
      this.value = value;
      this.percentage = -1;
    }
    /*calcPercenate(totalINcome) {
      if(totalIncome > 0) {
        console.log(this.va)
        this.percentage = Math.round((this.value / totalIncome) * 100);
      } else {
      this.percentage = -1;
      }
      getPercentage() {
        return this.percentage
      }
    }*/
  }
  class Income {
    constructor(id,description,value) {
      this.id = id;
      this.description = description;
      this.value = value;
    }
  }

  let data = {
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

    deleteItem: (type, id)=> {
      let ids,index;

      ids = data.allItems[type].map(current => current.id);
      index = ids.indexOf(id);
      if(index !== -1) {
        data.allItems[type].splice(index, 1)
      }
    },

    calculateTotal: function(type) {
      let sum = 0;
      let totalBudget;
      data.allItems[type].forEach((cur) => {
        sum += cur.value;
      });
      data.total[type] = sum;

      if(localStorage.getItem('totalBudget') === null) {
        totalBudget = {
          inc: 0,
          exp: 0,
        }
      } else {
        totalBudget = JSON.parse(localStorage.getItem('totalBudget'))
      }

      totalBudget[type] = data.total[type];
      localStorage.setItem('totalBudget',JSON.stringify(totalBudget));

    },

    calculateBudget: function(type) {
      let budget;
      // 1. calculate expnexes nad income
      this.calculateTotal(type);

      if(localStorage.getItem('budget') === null) {
        budget = 0;
      } else {
        budget = JSON.parse(localStorage.getItem('budget'));
      }
      data.budget = data.total.inc - data.total.exp;
      budget = data.total.inc - data.total.exp;

      localStorage.setItem('budget',JSON.stringify(budget));
      //3. calculate the percentage of income we spent
      if(data.total.inc > 0) {
        data.percentage = Math.round((data.total.exp / data.total.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },

    getBudget: ()=> {
      return {
        budget: data.budget,
        totalInc: data.total.inc,
        totalExp: data.total.exp,
        percentage: data.percentage,
      }
    },

    testing: ()=> {
      console.log(data)
    },

    returnLocal: ()=> {
      items = JSON.parse(localStorage.getItem('items'));
      return items;
    },

    updateData: (budget,items,totalBudget)=>{
      data.budget = budget;
      data.percentage = -1;
      data.total.exp = totalBudget.exp;
      data.total.inc = totalBudget.inc;
      data.allItems.inc = items.inc;
      data.allItems.exp = items.exp;
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
    budgetLabel: '.budget-value',
    incomeLabel: '.budget-income-value',
    expenseLabel: '.budget-expenses-value',
    container: '.budget-content',
    nowDate: '.budget-title-month',
  }

  function formatNumber(num,type) {
    num = Math.abs(num);
    num = num.toFixed(2);

    let numSplit = num.split('.');
    let int = numSplit[0];
    if(int.length > 3) {
      int = int.substr(0, int.length - 3) + ',' + int.substr(int.length -3, 3)
    }
    let dec = numSplit[1];
    return (type === 'exp' ? '-' : '+' ) + ' ' + int + '.' + dec;
  };

  const nodeListForEach = (list, callback)=> {
    for (i = 0; i < list.length ; i++) {
      callback(list[i],i);
    }
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
        html = '<div class="item" id="inc-%id%"><div class="item-description">%description%</div><div class="right"><div class="item-value">%value%</div><div class="item-delete"><button class="item-delete-btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
      } else if(type === 'exp') {
        element = DOMStrings.expensesContainer;
        html =  '<div class="item" id="exp-%id%"><div class="item-description">%description%</div><div class="right"><div class="item-value">%value%</div><div class="item-percentage">21%</div><div class="item-delete"><button class="item-delete-btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
      }
      // replace place holder with some actual date
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%',formatNumber(obj.value, type));
      // insert html to DOM
      document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);

    },

    addItemFromLocal: () => {
      let items, html, newHtml,element;
      items = JSON.parse(localStorage.getItem('items'));
      for(i = 0; i < items['inc'].length; i++) {
        element = DOMStrings.incomeContainer;
        html = '<div class="item" id="inc-%id%"><div class="item-description">%description%</div><div class="right"><div class="item-value">%value%</div><div class="item-delete"><button class="item-delete-btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
        newHtml = html.replace('%id%',items.inc[i].id);
        newHtml = newHtml.replace('%description%',items.inc[i].description);
        newHtml = newHtml.replace('%value%', formatNumber(items.inc[i].value, 'inc'));
        document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
      }
      for(i = 0; i < items['exp'].length; i++) {
        element = DOMStrings.expensesContainer;
        html =  '<div class="item" id="exp-%id%"><div class="item-description">%description%</div><div class="right"><div class="item-value">%value%</div><div class="item-percentage"></div><div class="item-delete"><button class="item-delete-btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
        newHtml = html.replace('%id%',items.exp[i].id);
        newHtml = newHtml.replace('%description%',items.exp[i].description);
        newHtml = newHtml.replace('%value%', formatNumber(items.exp[i].value, 'exp'));
        document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
      }
    },

    deleteListItem: (selectorID)=>{
      const el = document.getElementById(selectorID);
      el.parentNode.removeChild(el);
    },

    clearFields: ()=> {
      let fields,fieldsArr;

      fields = document.querySelectorAll(DOMStrings.inputDescription + ',' + DOMStrings.inputValue);
      fieldsArr = Array.prototype.slice.call(fields);

      fieldsArr.forEach((item)=> {
        item.value = '';
      });

    },

    displayBudget: (obj)=> {
      let type
      obj.budget > 0 ? type = 'inc' : type = 'exp';

      document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget,type);
      document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalInc,'inc');
      document.querySelector(DOMStrings.expenseLabel).textContent =  formatNumber(obj.totalExp, 'exp');
    },

    displayPercentage: (percentage)=> {
      const filds = document.querySelectorAll(DOMStrings.itemPercentage);

      nodeListForEach(filds,(current, index)=> {
        if(percentage[index] > 0) {
          current.textContent = percentage[index] + '%';
        } else {
          current.textContent = '--';
        }
      })
    },

    displayMonth: () => {
      const now = new Date();
      const months = ['January','February','March','April','May','June','July','August','Septe,ber','October','November','December'];
      const year = now.getFullYear();
      const month = now.getMonth();
      document.querySelector(DOMStrings.nowDate).textContent = months[month] + ' ' +year;
    },

    changeType: ()=> {
      let x = document.querySelectorAll(
        DOMStrings.inputType + ',' +
        DOMStrings.inputDescription + ',' +
        DOMStrings.inputValue);

      nodeListForEach(x, function(cur) {
        cur.classList.toggle('red-focus');

      });
      document.querySelector(DOMStrings.inputBtn).classList.toggle('red');
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
    const container = document.querySelector(DOM.container);
    const pickType = document.querySelector(DOM.inputType);

    addItemBtn.addEventListener('click',ctrlAddItems);
    pickType.addEventListener('change', UICtrl.changeType);
    container.addEventListener('click', ctrlDeleteItem);
    addItemBtn.addEventListener('keypress', (event) => {
    if( event.key === 13 || event.which == 13) {
      ctrlAddItems();
    }

  })
  }

  function updateBudget(type) {
    let budget;
    // 1. calculate budget
    budgetCtrl.calculateBudget(type);
    // 2.return budget
    budget = budgetCtrl.getBudget();
    //3. display budget
    UICtrl.displayBudget(budget);
  }

   function saveLocalItems(item,type) {
    let items;
    if(localStorage.getItem('items') === null) {
      items = {
        inc: [],
        exp: [],
      }
    } else {
      items = JSON.parse(localStorage.getItem('items'))
    }
    items[type].push(item);
    localStorage.setItem('items',JSON.stringify(items))
  }

  function deleteLocalItems(type,id) {
    let items,ids,index;
    if(localStorage.getItem('items') === null) {
      items = {
        inc: [],
        exp: [],
      }
    } else {
      items = JSON.parse(localStorage.getItem('items'))
    }
    ids = items[type].map((cur)=>{
      return cur.id
    });
    index = ids.indexOf(id);
    items[type].splice(index,1);
    localStorage.setItem('items',JSON.stringify(items))
  }

  // add items on click
  function ctrlAddItems() {
    // 1. get input date
    const input = UICtrl.getInput();
    // 2.add item to budget controlor
    if(input.description !== '' && !isNaN(input.value) && input.value > 0) {

      const newItem = budgetCtrl.addItem(input.type, input.description, input.value);
      // 3. add item to ui
      UICtrl.addListItem(newItem, input.type);
      // 4. save to local
      saveLocalItems(newItem,input.type);
      // 4. clear filed
      UICtrl.clearFields();
      // 5. calculate and update budget
      updateBudget(input.type);
      // 6. upodate and calc percentage
    }
  }
  // delete items
  function ctrlDeleteItem(event) {
    const itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
    if(itemId) {
      const splitId = itemId.split('-')
      const type = splitId[0];
      let ID = parseInt(splitId[1]);
      // delete from data
      budgetCtrl.deleteItem(type,ID);
      // delete from ui
      UICtrl.deleteListItem(itemId);
      // 3. update budget
      updateBudget(type);

      deleteLocalItems(type,ID);
    }
  }


  return {
    init: () => {
      console.log('Aplication has started.');
      setupEventListener();
      UICtrl.displayMonth();
      UICtrl.addItemFromLocal();
      const budget = JSON.parse(localStorage.getItem('budget'));
      const totalBudget = JSON.parse(localStorage.getItem('totalBudget'));
      const items = JSON.parse(localStorage.getItem('items'));
      budgetCtrl.updateData(budget,items,totalBudget);
      if(totalBudget === '') {
        UICtrl.displayBudget({
          budget: 0,
          totalInc: 0,
          totalExp: 0,
          percentage: -1
        })
      } else {
        UICtrl.displayBudget({
          budget: budget,
          totalInc: totalBudget['inc'],
          totalExp: totalBudget['exp'],
          percentage: -1
        })
      }
    }
  };

})(budgetController,UIController);
controller.init();
