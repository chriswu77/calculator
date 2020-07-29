// math functions
const add = (num1, num2) => num1 + num2;
const subtract = (num1, num2) => num1 - num2;
const multiply = (num1, num2) => num1 * num2;
const divide = (num1, num2) => num1 / num2;

const operate = (operator, num1, num2) => {
    switch(operator) {
        case 'plus':
            return add(num1, num2)
            break;
        case 'minus': 
            return subtract(num1, num2)
            break;
        case 'multiply':
            return multiply(num1, num2)
            break;
        case 'divide':
            return divide(num1, num2)
            break;
    }
};

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// DOM objects
const display = document.getElementById('display');
const clearBtn = document.getElementById('clear');
const signBtn = document.getElementById('sign');
const backSpaceBtn = document.getElementById('backspace');
const divideBtn = document.getElementById('divide');
const multiplyBtn = document.getElementById('multiply');
const minusBtn = document.getElementById('minus');
const plusBtn = document.getElementById('plus');
const equalBtn = document.getElementById('equal');
const decimalBtn = document.getElementById('decimal');

// UI function
const displayDigits = (displayVal, num) => {
    if (workingState) {
        let displayAnswer;
        if (displayVal === 'error') {
            displayAnswer = "Oops, you divided by 0";
            workingState = false;
        } else if (typeof displayVal === 'string') {  // when string is passed in, keep concatenating to get current value
            displayVal += num;
            currentValue = displayVal;
            displayAnswer = numberWithCommas(currentValue);
        } else if (typeof displayVal === 'number') {   // when answer is passed in, just display it 
            numString = displayVal.toString();
            const [int, decimal] = numString.split('.');
            if (!decimal) {
                displayAnswer = numberWithCommas(int); 
            } else {
                const [int2, decimal2] = parseFloat(displayVal.toFixed(5)).toString().split('.');
                displayAnswer = numberWithCommas(int2) + '.' + decimal2;
            }
        }
        display.textContent = displayAnswer;
    }
}

let currentValue;
let savedValues;
let selectedOperators;
let workingState;

const clear = () => {
    currentValue = '';
    savedValues = [];
    selectedOperators = [];
    display.textContent = '0';
    workingState = true;
}

window.addEventListener('load', clear);

const numberBtnArr = Array.from(document.querySelectorAll('.number'));
numberBtnArr.forEach(btn => btn.addEventListener('click', e => {
    if (workingState) {
        const number = e.target.id.substr(-1,1).toString();
        displayDigits(currentValue, number);
    }
}));

const operatorBtnArr = Array.from(document.querySelectorAll('.operator'));
operatorBtnArr.forEach(operator => operator.addEventListener('click', e => {
    if (workingState) {
        if (currentValue !== '') {  // make sure theres a current value before operator is run
            savedValues.push(currentValue);
            currentValue = '';
            selectedOperators.push(e.target.id);
        }
    }
}))

equalBtn.addEventListener('click', () => {
    if (workingState) {
        if (savedValues.length > 0 && currentValue !== '') {
            savedValues.push(currentValue);  // push in the currentValue you entered just before pressing equal
            let answer;
        
            for (let i = 0; i < selectedOperators.length; i++) {
                if (i === 0) {
                    answer = operate(selectedOperators[0], parseFloat(savedValues[0]), parseFloat(savedValues[1]))
                } else {
                    answer = operate(selectedOperators[i], answer, parseFloat(savedValues[i+1]));
                }
            }
        
            if (answer === Infinity) {
                currentValue = '';
                displayDigits('error');
            } else {
                currentValue = answer.toString();
                displayDigits(answer);
                console.log(savedValues);
                console.log(selectedOperators);
                savedValues = [];
                selectedOperators = [];
            }
        }
    }
})

clearBtn.addEventListener('click', clear);




