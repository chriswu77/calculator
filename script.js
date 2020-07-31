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

const numberWithCommas = x => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const checkForAnAnswer = () => {
    if (equalAnswer !== '') { // if you just pressed equal and got an answer before this
        currentValue = '';
        equalAnswer = ''; // set it back to empty string
    }
};

const formatDisplayString = () => {
    if (currentValue.includes('.')) {   // check if there's a decimal already in currentValue. split integer and decimal and apply formatting
        const [int, dec] = currentValue.split('.');
        display.textContent = numberWithCommas(int) + '.' + dec;
    } else {
        display.textContent = numberWithCommas(currentValue);
    }
};

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
        if (displayVal === 'error') {
            display.textContent = "Oops, you divided by 0";
            workingState = false;
        } else if (typeof displayVal === 'string') {  // when a digit or decimal is passed in
            if (num) {  // we're passing in a digit. displayVal = currentValue right now
                displayVal += num;
                currentValue = displayVal;
                formatDisplayString();
            } else {  // we're passing in a decimal
                if (!currentValue.includes('.')) { // make sure there's no decimal yet
                    currentValue += displayVal;
                    display.textContent = currentValue;
                }
            }
        } else if (typeof displayVal === 'number') {   // when answer is passed in, just display it 
            numString = displayVal.toString();
            const [int, decimal] = numString.split('.');
            if (!decimal) {
                display.textContent = numberWithCommas(int); 
            } else {
                const [int2, decimal2] = parseFloat(displayVal.toFixed(10)).toString().split('.');
                display.textContent = numberWithCommas(int2) + '.' + decimal2;
            }
        }
    }
};

let workingState;
let currentValue;
let equalAnswer;
let savedValues;
let selectedOperators;
let previousOperatorBtn;

const clear = () => {
    currentValue = '';
    equalAnswer = '';
    savedValues = [];
    selectedOperators = [];
    display.textContent = '0';
    workingState = true;
    previousOperatorBtn = '';
};

window.addEventListener('load', clear);

const numberBtnArr = Array.from(document.querySelectorAll('.number'));
numberBtnArr.forEach(btn => btn.addEventListener('click', e => {
    if (workingState) {
        checkForAnAnswer();
        previousOperatorBtn = '';
        const number = e.target.id.substr(-1,1).toString();
        displayDigits(currentValue, number);
    }
}));

const operatorBtnArr = Array.from(document.querySelectorAll('.operator'));
operatorBtnArr.forEach(operator => operator.addEventListener('click', e => {
    if (workingState) {
        const operatorSign = e.target.id;
        if (previousOperatorBtn !== operatorSign && previousOperatorBtn !== '') {   // set to latest operator button clicked
            selectedOperators.pop();
            selectedOperators.push(operatorSign);
            previousOperatorBtn = operatorSign;
        }
        if (currentValue !== '' && currentValue !== '.') {  // make sure theres a current value before operator is run
            savedValues.push(currentValue);
            currentValue = '';
            selectedOperators.push(operatorSign);
            previousOperatorBtn = operatorSign;
            console.log(selectedOperators);
            console.log(previousOperatorBtn);
        }
    }
}));

equalBtn.addEventListener('click', () => {
    if (workingState) {
        if (savedValues.length > 0 && currentValue !== '' && currentValue !== '.') {
            previousOperatorBtn = '';
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
                equalAnswer = answer.toString();
                displayDigits(answer);
                console.log(savedValues);
                console.log(selectedOperators);
                savedValues = [];
                selectedOperators = [];
            }
        }
    }
});

clearBtn.addEventListener('click', clear);

decimalBtn.addEventListener('click', () => {
    if (workingState) {
        checkForAnAnswer();
        previousOperatorBtn = '';
        displayDigits('.');
    }
});

const removeDigits = () => {
    if (workingState) {
        if (currentValue !== '' && equalAnswer === '') {
            let digitArr = currentValue.split('');
            digitArr.pop();
            currentValue = digitArr.join('');
            // update UI
            if (currentValue === '') {
                currentValue = '0';
                display.textContent = '0';
            } else {
                formatDisplayString();
            }
        }
    }
};

backSpaceBtn.addEventListener('click', removeDigits);