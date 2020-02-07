const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.querySelector('.list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const addBTN = document.querySelector('.btn');
const incList = document.getElementById('incList')
const incExpList = document.querySelector('.incomeExpenseList')
const clearBTN = document.getElementById('clearBTN')

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

function clearLocalStorage(){
  localStorage.removeItem('transactions');
  transactions = []
  // init()
  // updateValues()
  list.innerHTML=''
  balance.innerText = '$0.00'
  money_plus.innerText = '$0.00'
  money_minus.innerText = '$0.00'  
}

// 2 Add Transaction
function addTransaction(e){
  e.preventDefault();

  if(text.value === '' || amount.value === ''){
    return false;
  }else{
    const transaction = {
      id: randomID(),
      text: text.value,
      amount: +amount.value,
    }
    transactions.push(transaction)
    addtransactionDOM(transaction)
    updateValues();
    updateLocalStorage();
    text.value = ''
    amount.value = ''
  }
}

// 3
function randomID() {
  return Math.floor(Math.random() * 100000000);
}

// remove transactions
function removeTransactions(id){
  transactions = transactions.filter(transaction => transaction.id !== id);

  updateLocalStorage()  
  init();
  sortStuff()
}

// 1 Add transactions to DOM list
function addtransactionDOM(transaction){
  const sign = transaction.amount < 0 ? '-' : '+';
  const item = document.createElement('li');

 if(transaction.amount < 0){
   item.classList.add('minus')
 }else{
   item.classList.add('plus')
 }

  item.innerHTML = `
    ${transaction.text} <span>${sign}$${Math.abs(transaction.amount)}</span> <button class="delete-btn" onclick="removeTransactions(${transaction.id})">X</button>
  ` 
 incList.appendChild(item)
}

// 5 update balance, income and expenses
function updateValues() {
  const amounts = transactions.map(item => item.amount)
  
  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2)
  
  const income = amounts
            .filter(item => item > 0)
            .reduce((acc, item) => (acc += item), 0)
            .toFixed(2)

  const expense = amounts 
                  .filter(item => item < 0)
                  .reduce((acc, item) => (acc -= item), 0)
                  .toFixed(2)

  balance.innerText = `$${total}`
  money_plus.innerText = `$${income}`
  money_minus.innerText = `$${expense}`
  if(total < 0){
    balance.style.color = '#c0391b'
  }else{
    balance.style.color = '#2ecc72'
  }
}

function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// 4
function init() {
  list.innerHTML = '';

  transactions.forEach(addtransactionDOM);
  
  updateValues()
}
init();


function sortStuff() {
  incList.innerHTML = ''
  let result = transactions.filter(item => {
    return item.amount < 0;
  })
  result.sort((a, b) => {
    return a.amount - b.amount
  })


  let plusResult = transactions.filter(item => {
    return item.amount > 0
  })
  plusResult.sort((a, b) => {
    return b.amount - a.amount
  })
  
  result.forEach(addtransactionDOM)
  plusResult.forEach(addtransactionDOM)
}

const sortbtn = document.getElementById('sortBTN')

form.addEventListener('submit', addTransaction)
clearBTN.addEventListener('click', clearLocalStorage)
sortbtn.addEventListener('click', sortStuff)
