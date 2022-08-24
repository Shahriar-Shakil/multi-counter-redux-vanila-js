// select dom elements
const counterEl = document.getElementById("counter");
const countersContainerEl = document.getElementById("countersContainer");

// action types
const INCREMENT = "increment";
const DECREMENT = "decrement";
const ADD_COUNTER = "addCounter";
const RESET_COUNTER = "resetCounter";
const UPDATE_COUNTING_VALUE = "updateCountingValue";
const REMOVE_COUNTER = "removeCounter";

// action creators
const incrementAction = (id) => {
  return {
    type: INCREMENT,
    payload: id,
  };
};
const decrementAction = (id) => {
  return {
    type: DECREMENT,
    payload: id,
  };
};
const addCounterAction = () => {
  return {
    type: ADD_COUNTER,
  };
};
const resetCounterAction = () => {
  return {
    type: RESET_COUNTER,
  };
};
const updateCountingValueAction = (value) => {
  return {
    type: UPDATE_COUNTING_VALUE,
    payload: value,
  };
};
const removeCounterAction = (id) => {
  return {
    type: REMOVE_COUNTER,
    payload: id,
  };
};

// initial state
const initialState = {
  counters: [{ id: 1, value: 0, countBy: 1 }],
};

// create Reducer function
function multiCounterReducer(state = initialState, action) {
  switch (action.type) {
    case INCREMENT:
      return {
        ...state,
        counters: state.counters.map((counter) =>
          counter.id === action.payload
            ? { ...counter, value: counter.value + counter.countBy }
            : counter
        ),
      };
    case DECREMENT:
      return {
        ...state,
        counters: state.counters.map((counter) =>
          counter.id === action.payload
            ? { ...counter, value: counter.value - counter.countBy }
            : counter
        ),
      };
    case ADD_COUNTER:
      return {
        ...state,
        counters: [
          ...state.counters,
          {
            id: state.counters[state.counters.length - 1]?.id
              ? state.counters[state.counters.length - 1]?.id + 1
              : 1,
            value: 0,
            countBy: state.counters[state.counters.length - 1]?.id
              ? state.counters[state.counters.length - 1]?.id + 1
              : 1,
          },
        ],
      };
    case RESET_COUNTER:
      return {
        ...state,
        counters: state.counters.map((counter) => {
          return {
            ...counter,
            value: 0,
            countBy: counter.countBy,
          };
        }),
      };

    case UPDATE_COUNTING_VALUE:
      return {
        ...state,
        counters: state.counters.map((counter) =>
          counter.id === action.payload.id
            ? { ...counter, countBy: action.payload.countBy }
            : counter
        ),
      };
    case REMOVE_COUNTER:
      return {
        ...state,
        counters: state.counters.filter(
          (counter) => counter.id !== action.payload
        ),
      };
    default:
      return state;
  }
}

const store = Redux.createStore(multiCounterReducer);

// UI template
var template = function () {
  const state = store.getState();

  if (state.counters.length < 1)
    return "<p><em>You do not have any counter</em></p>";

  return state.counters
    .map(function (item) {
      return `<div
        class="p-4 h-auto flex flex-col items-center justify-center space-y-5 bg-white rounded shadow"
      >
   
        <button data-key=${item.id}  id="removeCounterBtn" type="button" class="w-full  inline-flex justify-center self-end rounded-md border border-transparent shadow-sm px-1 py-1 bg-red-400 text-sm font-small text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto ">
         
        Remove
        </button>
      <form class="w-full max-w-sm">
  <div class="flex items-center border-b border-teal-500 py-2">
    <input id="countingValue" data-key=${item.id}  class="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" type="text" placeholder=${item.countBy} aria-label="Full name">
    <button
    data-key=${item.id}
    id="updateCountedBy"
    class="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded" type="button">
     Update Counting Value
    </button>
   
  </div>
</form>
        <div id="counter" class="text-2xl font-semibold">${item.value}</div>
        <div class="flex space-x-3">
          <button
            id="increment"
            class="bg-indigo-400 hover:bg-indigo-600 text-white px-3 py-2 rounded shadow"
            data-key=${item.id}
          >
            Increment
          </button>
          <button
            id="decrement"
            class="bg-red-400 hover:bg-red-600 text-white px-3 py-2 rounded shadow"
            data-key=${item.id}

          >
            Decrement
          </button>
          
        </div>
      </div>`;
    })
    .join("");
};

const render = () => {
  countersContainerEl.innerHTML = template();
};

// update UI initially
render();

store.subscribe(render);

// button click listeners

document.addEventListener("click", function (e) {
  if (e.target && e.target.id == "increment") {
    const trackingId = e.target.getAttribute("data-key");
    store.dispatch(incrementAction(Number(trackingId)));
  }
});
document.addEventListener("click", function (e) {
  if (e.target && e.target.id == "decrement") {
    const trackingId = e.target.getAttribute("data-key");

    store.dispatch(decrementAction(Number(trackingId)));
  }
});
document.addEventListener("click", function (e) {
  if (e.target && e.target.id == "addCounter") {
    store.dispatch(addCounterAction());
  }
});
document.addEventListener("click", function (e) {
  if (e.target && e.target.id == "resetCounter") {
    store.dispatch(resetCounterAction());
  }
});

document.addEventListener("click", function (e) {
  if (e.target && e.target.id == "updateCountedBy") {
    const trackingId = e.target.getAttribute("data-key");
    const parentDiv = e.target.parentNode;
    const inputVal = parseInt(parentDiv.childNodes[1].value);
    if (Number(inputVal)) {
      store.dispatch(
        updateCountingValueAction({
          countBy: Number(inputVal),
          id: Number(trackingId),
        })
      );
    }
  }
});
document.addEventListener("click", function (e) {
  if (e.target && e.target.id == "removeCounterBtn") {
    const trackingId = e.target.getAttribute("data-key");
    store.dispatch(removeCounterAction(Number(trackingId)));
  }
});
