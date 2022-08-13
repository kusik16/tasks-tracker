import { configureStore } from "@reduxjs/toolkit";
import reducer from "../components/tasksList/tasksSlice";

const localStorageMiddleware = ({ getState }) => {
    return (next) => (action) => {
        const result = next(action);
        localStorage.setItem("applicationState", JSON.stringify(getState()));
        return result;
    };
};

const reHydrateStore = () => {
    if (localStorage.getItem("applicationState") !== null) {
        return JSON.parse(localStorage.getItem("applicationState")); // re-hydrate the store
    }
};

const store = configureStore({
    reducer: {
        tasks: reducer,
    },
    preloadedState: reHydrateStore(),
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(localStorageMiddleware),
    devTools: process.env.NODE_ENV !== "production",
});

export default store;
