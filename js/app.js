const budgetController = (function() {

})();

const UIController = (function() {
  const DOMStrings = {
    inputType: '.add-type',
    inputDescription: '.add-description',
    inputValue: '.add-value',
    inputBtn: '.add-btn'
  }

  return {
    getInput: function() {
      return {
        addType: document.querySelector(DOMStrings.inputType).value,
        addDescription: document.querySelector(DOMStrings.inputDescription).value,
        addValue: document.querySelector(DOMStrings.inputValue).value,
      }
    },
    getDOMStrings: function() {
      return DOMStrings;
    }
  }
})();

const controller = (function(budgetCtrl,UICtrl) {
  // variables


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
    const input = UICtrl.getInput();
  }

  return {
    init: function() {
      console.log('Aplication has started.');
      setupEventListener();
    }
  };

})(budgetController,UIController);
controller.init();
