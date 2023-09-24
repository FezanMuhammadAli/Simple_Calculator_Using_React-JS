import { useReducer } from "react";
import { DigitButton } from "./digitButton";
import { OperationButton } from "./operationButton";
import "./style.css";
export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  EVALUATE: "evaluate",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
};

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        };
      }
      if (payload.digit === "0" && state.currentOperand === "0") {
        return state;
      }

      if (payload.digit === "." && state.currentOperand.includes(".")) {
        return state;
      }
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""} ${payload.digit}`,
      };

    case ACTIONS.CLEAR:
      return {};

    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.privousOperand == null) {
        return state;
      }
      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }
      if (state.privousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          privousOperand: state.currentOperand,
          currentOperand: null,
        };
      }
      return {
        ...state,
        privousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null,
      };

    case ACTIONS.EVALUATE:
      if (
        state.operation == null ||
        state.currentOperand == null ||
        state.privousOperand == null
      ) {
        return state;
      }

      return {
        ...state,
        overwrite: true,
        privousOperand: null,
        operation: null,
        currentOperand: evaluate(state),
      };

    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return { ...state, overwrite: false, currentOperand: null };
      }
      if (state.currentOperand == null) {
        return state;
      }
      if (state.currentOperand.length === 1) {
        return {
          ...state,
          currentOperand: null,
        };
      }

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };

    // Default case to handle any other action types.
    default:
      return state;
  }
}

function evaluate({ currentOperand, privousOperand, operation }) {
  const prev = parseFloat(privousOperand);
  const current = parseFloat(currentOperand);
  if (isNaN(prev) || isNaN(current)) return "";

  let computation;
  switch (operation) {
    case "+":
      computation = prev + current;
      break;
    case "-":
      computation = prev - current;
      break;
    case "*":
      computation = prev * current;
      break;
    case "÷":
      computation = prev / current;
      break;
    default:
      console.error(`Unsupported operation: ${operation}`);
      computation = ""; // Set computation to a default value or handle it as needed.
  }

  return computation.toString();
}

// const INTEGER_FORMATTOR = new Intl.NumberFormat("en-us", {
//   maximumFractionDigits: 0,
// });

// function formatOperand(operand) {
//   if (operand == null) return;
//   const [integer, decimal] = operand.split(".");
//   if (decimal == null) return INTEGER_FORMATTOR.format(integer);
//   return `${INTEGER_FORMATTOR.format(integer)}.${decimal}`;
// }

function App() {
  const [{ currentOperand, privousOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  );
  // dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: 1 } });
  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="privous-operand">
          {privousOperand}
          {operation}
        </div>
        <div className="current-operand">{currentOperand}</div>
      </div>
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}
      >
        AC
      </button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>
        DEL
      </button>

      <OperationButton operation="÷" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />

      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
      >
        =
      </button>
    </div>
  );
}

export default App;
