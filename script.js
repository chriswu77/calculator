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

const formatDisplayString = (type, value) => {
    if (type === 'string') {
        if (currentValue.includes('.')) {   // check if there's a decimal already in currentValue. split integer and decimal and apply formatting
            const [int, dec] = currentValue.split('.');
            display.textContent = numberWithCommas(int) + '.' + dec;
        } else {
            display.textContent = numberWithCommas(currentValue);
        }
    } else if (type === 'number') {
        let numberString = value.toString();
        const [int, decimal] = numberString.split('.');
        if (!decimal) {
            display.textContent = numberWithCommas(int); 
        } else {
            const [int2, decimal2] = parseFloat(value.toFixed(10)).toString().split('.');   // keep answers fixed to 10 places
            if (decimal2 === undefined) {
                display.textContent = numberString;
            } else {
                display.textContent = numberWithCommas(int2) + '.' + decimal2;
            }
        }
    }
    fitty(display, {maxSize: 45});
};

const pushCurrentValueAndOperator = (operatorSign) => {
    savedValues.push(currentValue);
    currentValue = '';
    selectedOperators.push(operatorSign);
    previousOperatorBtn = operatorSign;
    console.log(selectedOperators);
    console.log(previousOperatorBtn);
};

// DOM objects
const display = document.getElementById('display-answer');
const displayCalc = document.getElementById('display-calc');
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
        if (currentValue.length <= 34) {
            // console.log(currentValue,currentValue.length);
            display.style.fontSize = '45px';
            if (displayVal === 'error') {
                display.textContent = "Oops, you divided by 0";
                workingState = false;
            } else if (typeof displayVal === 'string') {  // when a digit or decimal is passed in
                if (num) {  // we're passing in a digit. displayVal = currentValue right now
                    displayVal += num;
                    currentValue = displayVal;
                    formatDisplayString('string');
                } else {  // we're passing in a decimal
                    if (!currentValue.includes('.')) { // make sure there's no decimal yet
                        currentValue += displayVal;
                        const int = currentValue.slice(0,-1);
                        display.textContent = numberWithCommas(int) + '.';
                    }
                }   
            } else if (typeof displayVal === 'number') {   // when answer is passed in, just display it 
                formatDisplayString('number', displayVal);
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

const resetDisplayFont = () => {
    display.style.fontSize = '45px';
    displayCalc.style.fontSize = '20px';
};

const clear = () => {
    currentValue = '';
    equalAnswer = '';
    savedValues = [];
    selectedOperators = [];
    display.textContent = '0';
    displayCalc.textContent = '';
    workingState = true;
    previousOperatorBtn = '';
    resetDisplayFont();
};

window.addEventListener('load', clear);

const pressedNumber = event => {
    if (workingState) {
        let number;
        if (event.type === 'click') {
            number = event.target.id.substr(-1,1).toString();
        } else if (event.type === 'keydown') {
            number = event.key;
        }
        checkForAnAnswer();
        if ((number === '0' && currentValue === '0') || (number === '0' && display.textContent === '0')) return;
        if (number !== '0' && currentValue === '0') {    // allow user to replace the 0 with new number
            currentValue = '';
        }
        previousOperatorBtn = '';
        displayDigits(currentValue, number);
    }
};

const numberBtnArr = Array.from(document.querySelectorAll('.number'));
numberBtnArr.forEach(btn => btn.addEventListener('click', pressedNumber));

const updateDisplayCalc = () => {
    const formatCalcDisplay = (string) => {
        const [int, dec]  = string.split('.');
        if (!dec || (dec.split('').every(digit => digit === '0'))) {
            if (int.length > 21) {
                return parseFloat(int).toExponential(10);
            }
            return numberWithCommas(int);
        } else {
            const number = parseFloat(string);
            const [int2, decimal2] = parseFloat(number.toFixed(10)).toString().split('.');   // keep answers fixed to 10 places
            if (decimal2 === undefined) {
                return number.toString();
            } else {
                return numberWithCommas(int2) + '.' + decimal2;
            }
        }
    };
    const signs = {
        'plus': '+',
        'minus': '-',
        'divide': '÷',
        'multiply': 'x',
        'equal': '='
    };
    let calcString = '';
    let valuesCount = 0;
    let operatorsCount = 0;
    for (let i = 0; i < savedValues.length + selectedOperators.length; i++) {
        if (i === 0) {
            calcString += formatCalcDisplay(savedValues[valuesCount]);
            valuesCount++;
        } else if (i % 2 === 1) {
            calcString += ' ' + signs[selectedOperators[operatorsCount]] + ' ';
            operatorsCount++;
        } else if (i % 2 === 0) {
            calcString += formatCalcDisplay(savedValues[valuesCount]);
            valuesCount++;
        }
    }
    displayCalc.style.fontSize = '20px';
    displayCalc.textContent = calcString;
    fitty(displayCalc, {maxSize: 20});
};

const pressedOperator = event => {
    if (workingState) {
        let operatorSign;
        if (event.type === 'click') {
            operatorSign = event.target.id;
        } else if (event.type === 'keydown') {
            switch(event.key) {
                case '+':
                    operatorSign = 'plus'
                    break;
                case '-':
                    operatorSign = 'minus'
                    break;
                case '/':
                    operatorSign = 'divide'
                    break;
                case '*':
                    operatorSign = 'multiply'
                    break; 
            }
        }

        if (previousOperatorBtn !== operatorSign && previousOperatorBtn !== '') {   // set to latest operator button clicked
            selectedOperators.pop();
            selectedOperators.push(operatorSign);
            previousOperatorBtn = operatorSign;
        } 

        if (currentValue !== '' && currentValue !== '-' && currentValue !== '.') {  // make sure theres a valid current value before operator is run
            pushCurrentValueAndOperator(operatorSign);
        } else if ((currentValue === '' || currentValue === '-') && display.textContent === '0')  { // set currentValue to 0 if you backspace into a defaulted 0
            currentValue = '0';
            pushCurrentValueAndOperator(operatorSign);
        } 
        updateDisplayCalc();
    }
};

const operatorBtnArr = Array.from(document.querySelectorAll('.operator'));
operatorBtnArr.forEach(operator => operator.addEventListener('click', pressedOperator));

const calcAndRenderAnswer = () => {
    previousOperatorBtn = '';
    savedValues.push(currentValue);  // push in the currentValue you entered just before pressing equal
    updateDisplayCalc();
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
};

const pressedEqual = () => {
    if (workingState) {
        if (savedValues.length > 0 && currentValue !== '' && currentValue !== '-' && currentValue !== '.') {
            calcAndRenderAnswer();
        } else if (savedValues.length > 0 && display.textContent === '0' && (currentValue === '' || currentValue === '-')) {
            currentValue = '0';
            calcAndRenderAnswer();
        }
    }
};

equalBtn.addEventListener('click', pressedEqual);

clearBtn.addEventListener('click', clear);

const pressedDecimal = () => {
    if (workingState) {
        if ((currentValue === '' || currentValue === '-') && display.textContent === '0') {
            currentValue = '0';
        }
        checkForAnAnswer();
        previousOperatorBtn = '';
        displayDigits('.');
    }
};

decimalBtn.addEventListener('click', pressedDecimal);

const removeDigits = () => {
    if (workingState) {
        if (currentValue !== '' && equalAnswer === '') {
            let digitArr = currentValue.split('');
            digitArr.pop();
            currentValue = digitArr.join('');
            // update UI
            if (currentValue === '' || currentValue === '-') {
                display.textContent = '0';
            } else {
                formatDisplayString('string');
            }
        }
    }
};

backSpaceBtn.addEventListener('click', removeDigits);

const changeSign = () => {
    if (workingState) {
        if (currentValue !== '' && currentValue !== '0' && currentValue !== '.') {
            let digitArr = currentValue.split('');
            if (parseFloat(currentValue) > 0) {
                digitArr.unshift('-');
                currentValue = digitArr.join('');
            } else {
                digitArr.shift();
                currentValue = digitArr.join('');
            }
            formatDisplayString('number', parseFloat(currentValue));
        }
    }
};

signBtn.addEventListener('click', changeSign);

document.addEventListener('keydown', e => {
    e.preventDefault();
    if (e.key >= 0 && e.key <= 9) {
        pressedNumber(e);
    } else if (e.key === '+' || e.key === '-' || e.key === '/' || e.key === '*') {
        pressedOperator(e);
    } else if (e.key === '.') {
        pressedDecimal();
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
        removeDigits();
    } else if (e.key === 'Enter' || e.key === '=') {
        pressedEqual();
    } else if (e.key === 'Clear') {
        clear();
    }
});

// document.addEventListener('keydown', e => console.log(e));