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
    current: '0',
    operator: null,
    operand: '0',
    history: [0],
    state: 'num',
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
    updateDisplay: function(value){
        if (isNaN(Number(value))){
            $('.screenText').text('How dare you?');
            setTimeout(function(){
                stateObj.reset();
            }, 1000);
        } else if (String(Number(value)).length > 12){
            $('.screenText').text(expo(Number(value), 3));
        } else {
            $('.screenText').text(Number(value));
        }
        // value = Number(value);
        // if (value > 99999999999 || value < -99999999999){
        //     $('.screenText').text(expo(value, 3));
        // } else if (isNaN(value)){
        //     $('.screenText').text('How could you?');
        //     setTimeout(function(){
        //         stateObj.reset();
        //     }, 1000);
        // } else {
        //     $('.screenText').text(Number(value));
        // }
    },
    reset: function(){
        this.current = '0';
        this.operator = null;
        this.operand = '0';
        this.history = [];
        this.state = 'num';
        this.updateDisplay('0');
    },
    clearEntry: function(){
        if (this.history.length > 1){
            this.history.pop();
            let value = this.history[this.history.length-1];
            this.updateDisplay(value);
            this.current = value;
        }
    }
};

function expo(x, f) {
    return Number.parseFloat(x).toExponential(f);
}

function initializeKeyPress(){
    document.onkeydown = function(evt) {
        if (evt.keyCode === 13 || evt.keyCode === 187){ //enter and equals
            stateObj.eval();
        } else if (evt.keyCode === 48 || evt.keyCode === 96){ //0
            stateObj.digit(0);
        } else if (evt.keyCode === 49 || evt.keyCode === 97){ //1
            stateObj.digit(1);
        } else if (evt.keyCode === 50 || evt.keyCode === 98){ //2
            stateObj.digit(2);
        } else if (evt.keyCode === 51 || evt.keyCode === 99){ //3
            stateObj.digit(3);
        } else if (evt.keyCode === 52 || evt.keyCode === 100){ //4
            stateObj.digit(4);
        } else if (evt.keyCode === 53 || evt.keyCode === 101){ //5
            stateObj.digit(5);
        } else if (evt.keyCode === 54 || evt.keyCode === 102){ //6
            stateObj.digit(6);
        } else if (evt.keyCode === 55 || evt.keyCode === 103){ //7
            stateObj.digit(7);
        } else if (evt.keyCode === 56 || evt.keyCode === 104){ //8
            stateObj.digit(8);
        } else if (evt.keyCode === 57 || evt.keyCode === 105){ //9
            stateObj.digit(9);
        } else if (evt.keyCode === 106){ //mult
            stateObj.operation('×');
        } else if (evt.keyCode === 107){ //add
            stateObj.operation('+');
        } else if (evt.keyCode === 109){ //sub
            stateObj.operation('-');
        } else if (evt.keyCode === 111){ //div
            stateObj.operation('÷');
        } else if (evt.keyCode === 110 || evt.keyCode === 190){ //decimal
            stateObj.digit('.');
        } else if (evt.keyCode === 27){ //esc
            stateObj.reset();
        }
    };
}
