class UI {
  constructor() {
    this.budgetFeedback = document.querySelector(".budget-feedback");
    this.expenseFeedback = document.querySelector(".expense-feedback");
    this.budgetForm = document.getElementById("budget-form");
    this.budgetInput = document.getElementById("budget-input");
    this.budgetAmount = document.getElementById("budget-amount");
    this.expenseAmount = document.getElementById("expense-amount");
    this.balance = document.getElementById("balance");
    this.balanceAmount = document.getElementById("balance-amount");
    this.expenseForm = document.getElementById("expense-form");
    this.expenseInput = document.getElementById("expense-input");
    this.amountInput = document.getElementById("amount-input");
    this.expenseList = document.getElementById("expense-list");
    this.itemList = [];
    this.itemID = 0;
  }

  //* submit to budget form
  submitBudgetForm() {
    const value = this.budgetInput.value;

    if (value === "" || value < 0) {
      this.budgetFeedback.classList.add("showItem");
      this.budgetFeedback.innerHTML = `<p class="alert-feedback"> value cannot be empty or negative !</p>`;
      setTimeout(() => {
        this.budgetFeedback.classList.remove("showItem");
      }, 5000);
    } else {
      this.budgetAmount.textContent = value;
      this.budgetInput.value = "";
      this._showBalance();
    }
  }

  //* submit expense form
  submitExpenseForm() {
    const expenseValue = this.expenseInput.value;
    const amountValue = this.amountInput.value;
    if (expenseValue === "" || amountValue === "" || amountValue < 0) {
      this.expenseFeedback.classList.add("showItem");
      this.expenseFeedback.innerHTML = `<p class="alert-feedback"> damn son, shouldnt be empty!</p>`;
      setTimeout(() => {
        this.expenseFeedback.classList.remove("showItem");
      }, 4000);
    } else {
      let amount = parseInt(amountValue);
      this.expenseInput.value = "";
      this.amountInput.value = "";
      let expense = {
        id: this.itemID,
        title: expenseValue,
        amount: amount,
      };

      this.itemID++;
      this.itemList.push(expense);
      this._addExpense(expense);
      this._showBalance();
    }
  }

  //* add expense
  _addExpense(expense) {
    const div = document.createElement("div");
    div.classList.add("expense");
    div.innerHTML = `
    <div class="expense-item d-flex justify-content-between align-items-baseline">
      <h6 class="expense-title mb-0 text-uppercase list-item">- ${expense.title}</h6>
      <h5 class="expense-amount mb-0 list-item">${expense.amount}</h5>
      <div class="expense-icons list-item">
        <a href="#" class="edit-icon mx-2" data-id="${expense.id}">
          <i class="fas fa-edit"></i>
        </a>
        <a href="#" class="delete-icon" data-id="${expense.id}">
          <i class="fas fa-trash"></i>
        </a>
      </div>
    </div>`;
    this.expenseList.appendChild(div);
  }

  //* show the balance

  _showBalance() {
    const expense = this._totalExpense();
    const total = parseInt(this.budgetAmount.textContent) - expense;
    this.balanceAmount.textContent = total;
    if (total < 0) {
      this.balanceAmount.classList.remove("showGreen", "showBlack");
      this.balanceAmount.classList.add("showRed");
    } else if (total > 0) {
      this.balanceAmount.classList.remove("showRed", "showBlack");
      this.balanceAmount.classList.add("showGreen");
    } else if (total === 0) {
      this.balanceAmount.classList.remove("showGreen", "showRed");
      this.balanceAmount.classList.add("showBlack");
    }
  }

  //* total expense
  _totalExpense() {
    let total = 0;
    if (this.itemList.length > 0) {
      total = this.itemList.reduce((acc, curr) => {
        // console.log(`total is ${acc} and current value is ${curr.amount}`);
        acc += curr.amount;
        return acc;
      }, 0);
      console.log(this.itemList);
    }
    this.expenseAmount.textContent = total;
    return total;
  }

  editExpense(element) {
    let id = parseInt(element.dataset.id);
    let parent = element.parentElement.parentElement.parentElement;
    //* remove from DOM
    this.expenseList.removeChild(parent);
    //* remove from the list
    let expenses = this.itemList.filter((item) => item.id === id);
    //* show value
    this.expenseInput.value = expenses[0].title;
    this.amountInput.value = expenses[0].amount;
    //* remove from the list
    let templist = this.itemList.filter((item) => item.id !== id);

    // update
    this.itemList = templist;
    this._showBalance();
  }

  deleteExpense(element) {
    let id = parseInt(element.dataset.id);
    let parent = element.parentElement.parentElement.parentElement;
    //* remove from DOM
    this.expenseList.removeChild(parent);
    //* remove from the list
    let templist = this.itemList.filter((item) => item.id !== id);

    // update
    this.itemList = templist;
    this._showBalance();
  }
}

function eventListeners() {
  const budgetForm = document.getElementById("budget-form");
  const expenseForm = document.getElementById("expense-form");
  const expenseList = document.getElementById("expense-list");

  //* new instance UI class
  const ui = new UI();

  //? budget form submit
  budgetForm.addEventListener("submit", function (e) {
    e.preventDefault();
    ui.submitBudgetForm();
  });
  //? expense form submit
  expenseForm.addEventListener("submit", function (e) {
    e.preventDefault();
    ui.submitExpenseForm();
  });
  //? expense list submit
  expenseList.addEventListener("click", function (e) {
    const edit = e.target.parentElement.classList.contains("edit-icon");
    const deleteExp = e.target.parentElement.classList.contains("delete-icon");
    if (edit) {
      ui.editExpense(e.target.parentElement);
    }

    if (deleteExp) {
      ui.deleteExpense(e.target.parentElement);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  eventListeners();
});
