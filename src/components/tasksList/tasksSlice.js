import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";

const tasksAdapter = createEntityAdapter({
    sortComparer: (a, b) => b.createDate.localeCompare(a.createDate)
});

const tasksSlice = createSlice({
    name: "tasks",
    initialState: tasksAdapter.getInitialState(),
    reducers: {
        taskCreated: tasksAdapter.addOne,
        taskDeleted: tasksAdapter.removeOne,
        taskUpdated: tasksAdapter.updateOne,
    }
});

const { actions, reducer } = tasksSlice;

export const { selectAll } = tasksAdapter.getSelectors((state) => state.tasks);
export default reducer;
export const { taskCreated, taskDeleted, taskUpdated } = actions;
