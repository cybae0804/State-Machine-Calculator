$(document).ready(init);

function init() {
    $('button').click(handleClick);
    $('.screenText').text(0);
    initializeKeyPress();
}

function handleClick() {
    let input = $(this).text().trim();
    if ((!isNaN(input)) || input === '.'){
        stateObj.digit(input);
    } else if (input === '+' || input === '-' || input === '÷' || input === '×'){
        stateObj.operation(input);
    } else if (input === '='){
        stateObj.eval();
    } else if (input === 'C'){
        stateObj.reset();
    } else if (input === 'CE'){
        stateObj.clearEntry();
    }
}

const stateObj = {
    current: '0',   // current is used for the first number and accumulating calculated results
    operator: null, // self explanatory
    operand: '0',   // operand is the second number
    history: [0],   // history is used to roll back operations using CE button
    state: 'num',   // possible states are num, operator, operand, eval
    // digit inputs and period run this function.
    digit: function(input){
        switch(this.state){
            case 'num':
                if(!(input === '.' && (this.current.indexOf('.') !== -1))){
                    this.current = this.current + String(input);
                    this.updateDisplay(this.current);
                }
                break;
            case 'operator':
                this.state = 'operand';
                this.operand = String(0);
                this.operand = this.operand + String(input);
                this.updateDisplay(this.operand);
                break;
            case 'operand':
                if(!(input === '.' && (this.operand.indexOf('.') !== -1))){
                    this.operand = this.operand + String(input);
                    this.updateDisplay(this.operand);
                }
                break;
            case 'eval':
                this.reset();
                this.digit(input);
                break;
        }
    },
    // operators run this function
    operation: function (input) {
        switch(this.state){
            case 'num':
                this.state = 'operator';
                this.operator = input; 
                break;
            case 'operator':
                this.operator = input;
                break;
            case 'operand':
                this.state = 'operator';
                this.doMath(this.current, this.operator, this.operand);
                this.operator = input;
                this.operand = 0;
                this.updateDisplay(this.current);
                break;
            case 'eval':
                this.state = 'operator';
                this.operator = input;
                break;
        }
    },
    // when = is pressed, it runs this function
    eval: function() {
        switch(this.state){
            case 'num':
                this.state = 'eval';
                this.operator = '+';
                this.doMath(this.current, this.operator, this.operand);
                break;
            case 'operator':
                this.doMath(this.current, this.operator, this.current);
                break;
            case 'operand':
                this.state = 'eval';
                this.doMath(this.current, this.operator, this.operand);
                break;
            case 'eval':
                this.doMath(this.current, this.operator, this.operand);
                break;
        }
        this.updateDisplay(this.current);
    },
    // the actual function for doing math. It also pushes the result into the history
    doMath: function(op1, operator, op2) {
        let value;
        op1 = Number(op1);
        op2 = Number(op2);
        switch(operator){
            case '+':
                value = op1 + op2;
                break;
            case '-':
                value = op1 - op2;
                break;
            case '÷':
                if (op2 === 0){
                    value = 'error';
                } else {
                    value = op1 / op2;
                }
                break;
            case '×':
                value = op1 * op2;
                break;
        }
        this.history.push(value);
        this.current = String(value);
    },
    // display should be updated in certain states. The function also handles number length overflows
    updateDisplay: function(value){
        if (isNaN(Number(value))){
            $('.screenText').text('error');
            setTimeout(function(){
                stateObj.reset();
            }, 1000);
        } else if (String(Number(value)).length > 12){
            $('.screenText').text(exponential(Number(value), 2));
        } else {
            $('.screenText').text(Number(value));
        }
    },
    // pressing C runs this function
    reset: function(){
        this.current = '0';
        this.operator = null;
        this.operand = '0';
        this.history = [];
        this.state = 'num';
        this.updateDisplay('0');
    },
    // CE runs this function
    clearEntry: function(){
        if (this.history.length > 1){
            this.history.pop();
            let value = this.history[this.history.length-1];
            this.updateDisplay(value);
            this.current = value;
        }
    }
};

// for converting longer numbers into a exponential form
function exponential(num, prec) {
    return Number.parseFloat(num).toExponential(prec);
}

// self explanatory
function initializeKeyPress(){
    document.onkeydown = function(evt) {
        if (evt.which === 13 || evt.which === 187){ //enter and equals
            stateObj.eval();
        } else if (evt.which === 48 || evt.which === 96){ //0
            stateObj.digit(0);
        } else if (evt.which === 49 || evt.which === 97){ //1
            stateObj.digit(1);
        } else if (evt.which === 50 || evt.which === 98){ //2
            stateObj.digit(2);
        } else if (evt.which === 51 || evt.which === 99){ //3
            stateObj.digit(3);
        } else if (evt.which === 52 || evt.which === 100){ //4
            stateObj.digit(4);
        } else if (evt.which === 53 || evt.which === 101){ //5
            stateObj.digit(5);
        } else if (evt.which === 54 || evt.which === 102){ //6
            stateObj.digit(6);
        } else if (evt.which === 55 || evt.which === 103){ //7
            stateObj.digit(7);
        } else if (evt.which === 56 || evt.which === 104){ //8
            stateObj.digit(8);
        } else if (evt.which === 57 || evt.which === 105){ //9
            stateObj.digit(9);
        } else if (evt.which === 106){ //mult
            stateObj.operation('×');
        } else if (evt.which === 107){ //add
            stateObj.operation('+');
        } else if (evt.which === 109){ //sub
            stateObj.operation('-');
        } else if (evt.which === 111){ //div
            stateObj.operation('÷');
        } else if (evt.which === 110 || evt.which === 190){ //decimal
            stateObj.digit('.');
        } else if (evt.which === 27){ //esc
            stateObj.reset();
        }
    };
}