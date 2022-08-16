import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";

const tasksAdapter = createEntityAdapter({});

const tasksSlice = createSlice({
    name: "tasks",
    initialState: tasksAdapter.getInitialState(),
    reducers: {
        taskCreated: tasksAdapter.addOne,
        taskDeleted: tasksAdapter.removeOne,
        taskUpdated: tasksAdapter.updateOne,
        taskAllUpdated: tasksAdapter.setAll,
        taskAllDeleted: tasksAdapter.removeAll,
    },
});

const { actions, reducer } = tasksSlice;

export const { selectAll, selectEntities, selectIds } =
    tasksAdapter.getSelectors((state) => state.tasks);
export default reducer;
export const {
    taskCreated,
    taskDeleted,
    taskUpdated,
    taskAllUpdated,
    taskAllDeleted,
} = actions;
