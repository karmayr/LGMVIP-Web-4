import React, { useState } from 'react';
import './Calculator.css';
import Button from './Button';

function Calculator() {
    const [display, setDisplay] = useState('');
    const [expression, setExpression] = useState('');
    const [currentNumber, setCurrentNumber] = useState('');
    const [previousNumber, setPreviousNumber] = useState('');
    const [operator, setOperator] = useState('');
    const [openParentheses, setOpenParentheses] = useState(0);


    const handleNumberClick = (number) => {
        if (expression.endsWith(')')) return; // Prevent adding numbers after closing parenthesis
        setCurrentNumber((prevCurrentNumber) => prevCurrentNumber + number);
        setExpression((prevExpression) => prevExpression + number);
        setDisplay((prevDisplay) => prevDisplay + number);
    };

    const handleOperatorClick = (selectedOperator) => {
        if (currentNumber === '' && selectedOperator !== '-') return;

        // If there's an open parenthesis, add the operator inside the parenthesis
        if (openParentheses > 0) {
            setExpression((prevExpression) => prevExpression + selectedOperator);
        } else {
            setOperator(selectedOperator);
            setPreviousNumber(currentNumber);
            setCurrentNumber('');
            setExpression((prevExpression) => prevExpression + ' ' + selectedOperator + ' ');
            setDisplay((prevDisplay) => prevDisplay + ' ' + selectedOperator + ' ');
        }
    };

    const handleEqualsClick = () => {
        if (!currentNumber && !previousNumber && !operator) return;

        // Close any open parenthesis
        let closingParentheses = '';
        for (let i = 0; i < openParentheses; i++) {
            closingParentheses += ')';
        }

        setExpression((prevExpression) => prevExpression + currentNumber + closingParentheses);
        setOpenParentheses(0);

        let evaluatedExpression = expression;

        // Evaluate expressions inside parentheses first
        while (evaluatedExpression.includes('(')) {
            const startIndex = evaluatedExpression.lastIndexOf('(');
            const endIndex = evaluatedExpression.indexOf(')', startIndex);

            const subExpression = evaluatedExpression.slice(startIndex + 1, endIndex);
            const subResult = evaluateExpression(subExpression);
            evaluatedExpression =
                evaluatedExpression.slice(0, startIndex) + subResult + evaluatedExpression.slice(endIndex + 1);
        }

        const result = evaluateExpression(evaluatedExpression);
        setPreviousNumber('');
        setCurrentNumber(result.toString());
        setOperator('');
        setDisplay(result.toString());
        setExpression(result.toString());
    };


    const evaluateExpression = (exp) => {
        try {
            // eslint-disable-next-line
            return Function(`"use strict"; return (${exp})`)();
        } catch (error) {
            return 'Error';
        }
    };

    const handleClearClick = () => {
        setDisplay('');
        setExpression('');
        setCurrentNumber('');
        setPreviousNumber('');
        setOperator('');
        setOpenParentheses(0);
    };

    const handleDecimalClick = () => {
        if (!currentNumber.includes('.')) {
            setCurrentNumber((prevCurrentNumber) => prevCurrentNumber + '.');
            setExpression((prevExpression) => prevExpression + '.');
            setDisplay((prevDisplay) => prevDisplay + '.');
        }
    };
    const handleBackspaceClick = () => {
        if (expression.endsWith(')')) return; // Prevent backspace after closing parenthesis

        // Remove the last character from the currentNumber and expression
        setCurrentNumber((prevCurrentNumber) => prevCurrentNumber.slice(0, -1));
        setExpression((prevExpression) => prevExpression.slice(0, -1));
        setDisplay((prevDisplay) => prevDisplay.slice(0, -1));
    };






    return (
        <div className="calculator">
            <div className="display">{display || '0'}</div>
            <div className="buttons">
                <Button label="C" onClick={() => handleClearClick()} />
                <Button label="/" onClick={() => handleOperatorClick('/')} />
                <Button label="*" onClick={() => handleOperatorClick('*')} />
                <Button label="-" onClick={() => handleOperatorClick('-')} />
                <Button label="7" onClick={() => handleNumberClick('7')} />
                <Button label="8" onClick={() => handleNumberClick('8')} />
                <Button label="9" onClick={() => handleNumberClick('9')} />
                <Button label="+" onClick={() => handleOperatorClick('+')} />
                <Button label="4" onClick={() => handleNumberClick('4')} />
                <Button label="5" onClick={() => handleNumberClick('5')} />
                <Button label="6" onClick={() => handleNumberClick('6')} />
                <Button label="=" onClick={() => handleEqualsClick()} />
                <Button label="1" onClick={() => handleNumberClick('1')} />
                <Button label="2" onClick={() => handleNumberClick('2')} />
                <Button label="3" onClick={() => handleNumberClick('3')} />
                <Button label="0" onClick={() => handleNumberClick('0')} />
                <Button label="." onClick={() => handleDecimalClick()} />
                <Button label="⌫" onClick={() => handleBackspaceClick()} /> {/* Backspace button */}
            </div>
        </div>
    );
}

export default Calculator;
