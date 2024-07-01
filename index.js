const { acType } = require('os');

const prompt = require('prompt-sync')();
let currentUser = null;

const users = {
  "user1": {
      username: "joey",
      password: "1password",
      balance: 10000,
      acType: "ordinary",
  },

  "user2": {
      username: "kobie",
      password: "123456",
      balance: 1000000,
      acType: "premium",
  },

  "user3": {
      username: "jack",
      password: "987654",
      balance: 10000000,
      acType: "premium",
  }
};

//const userList = [user1, user2, user3];
let notes = {
  100: 200,
  500: 40,
  1000: 30
};

function login() {
  const username = prompt('Enter your username (or "quit" to exit): ');
  if (username.toLowerCase() === 'quit') {
      return null;
  }
  const password = prompt('Enter your password: ');
  const acType = prompt('Enter your user actype (premium or ordinary): ');

  // Check if user exists and credentials are correct
  for (const key in users) {
      if (users[key].username === username && users[key].password === password && users[key].acType === acType) {
          currentUser = users[key];
          return mainMenu();
      }
  }
  console.log("Incorrect username, password, or account type.");
  return null;
}

function checkBalance(user) {
  console.log(`Your current balance is: $${user.balance}.`);
  mainMenu();
}

function withdraw(user, amount) {
    if(amount > user.balance){
      console.log("Insufficient balance.");
      mainMenu();
    }
    
    let withdrawLimit;
    if(user.acType === "premium"){
      withdrawLimit = 20000;
    } else {
      withdrawLimit = 1000;
    }

    if(amount > withdrawLimit){
      console.log(`Withdrawal limit exceeded. Your withdrawal limit is $${withdrawLimit}.`);
      mainMenu();
    }
    let totalnotesMoney = notes[1000] * 30 + notes[500] * 40 + notes[100] * 200;
    if(amount > totalnotesMoney){
      console.log("ATM does not have enough cash.");
      mainMenu();
    }
    let remainingAmount = amount;
    let bills = { 1000: 0, 500: 0, 100: 0 };

    while (remainingAmount >=1000) {
      bills[1000]++;
      notes[1000]--;

      remainingAmount -= 1000;
    }

    while (remainingAmount >=500) {
      bills[500]++;
      notes[500]--;

      remainingAmount -= 500;
    }

    while (remainingAmount >=100) {
      bills[100]++;
      notes[100]--;

      remainingAmount -= 100;
    }

    if (remainingAmount > 0) {
      console.log("ATM cannot provide the required combination of banknotes.");
      notes[1000] += bills[1000];
      notes[500] += bills[500];
      notes[100] += bills[100];
    } else {
      console.log(`Successfully withdrew $${amount}. Banknote distribution: `, bills);
      user.balance -= amount;
      mainMenu();
    }


}

function mainMenu() {
  console.log('\nMain Menu:');
  console.log('1. Withdraw');
  console.log('2. Check Balance');
  console.log('3. Logout');

  const choice = prompt('Enter your choice (1-4): ');

  switch (choice) {
    case '1':
      if(currentUser) {
        const withdrawAmount = prompt('Enter the amount you would like to withdraw ("back" to menu): ');
        if (withdrawAmount.toLowerCase() === 'back') {
          return
        }
        withdraw(currentUser, parseInt(withdrawAmount));
      } else {
        console.log('You need to login first.');
      }
      break;

    case '2':
      if(currentUser) {
        checkBalance(currentUser);
      }else {
        console.log('You need to login first.');
      }
      break;

    case '3':
      console.log('Good Bye!')
        login();;
        break;
      default:
        console.log('Invalid choice. Please try again.');
  }
}

login()
// *** INSTRUCTION ***
// 1) There are 2 account types: "premium" and "ordinary"
// 2) For premium, can withdraw up to $20,000 each time
// 3) For ordinary, can withdraw up to $1,000 each time
// 4) To use the ATM, the user has to "login" with username and password
// 5) The user has an option to "logout"
// 6) The ATM has different notes to be withdrawn => always distribute for higher-amount notes first. e.g. for $800 withdrawal => $500 x 3 + $100 x 3
// 7) Notes will run out. You have to consider that.
// 8) The ATM never stops (but with a secret fuse that can stop anytime)

