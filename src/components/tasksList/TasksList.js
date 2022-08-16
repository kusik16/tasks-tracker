import { useCallback, useRef } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useSelector, useDispatch } from "react-redux";
import update from "immutability-helper";

import TasksListItem from "../tasksListItem/TasksListItem";
import { selectAll, taskAllUpdated, taskAllDeleted } from "./tasksSlice";

import "./taskList.scss";

const TasksList = () => {
    const tasks = useSelector(selectAll);

    const dispatch = useDispatch();

    const onDeleteAll = (tasks) => {
        // tasks.forEach((item) => {
        //     clearInterval(timer.current);
        // });
        // clearInterval(timer.current);

        dispatch(taskAllDeleted(tasks));
    };

    const moveTasks = useCallback(
        (dragIndex, hoverIndex) => {
            const updated = update(tasks, {
                $splice: [
                    [dragIndex, 1],
                    [hoverIndex, 0, tasks[dragIndex]],
                ],
            });
            dispatch(taskAllUpdated(updated));
        },
        // eslint-disable-next-line
        [tasks]
    );

    const renderTasksList = useCallback(
        (task, index) => {
            return (
                <CSSTransition key={task.id} timeout={500} classNames='list'>
                    <TasksListItem
                        key={task.id}
                        index={index}
                        id={task.id}
                        text={task.text}
                        moveTasks={moveTasks}
                        name={task.name}
                        date={task.date}
                        dateDiff={task.dateDiff}
                        isPlay={task.isPlay}
                    />
                </CSSTransition>
            );
        },
        // eslint-disable-next-line
        [tasks]
    );

    if (tasks.length === 0) {
        return (
            <CSSTransition timeout={500} classNames='list'>
                <h5>No tasks yet</h5>
            </CSSTransition>
        );
    } else {
        return (
            <>
                <TransitionGroup component='ul' className='list'>
                    {tasks.map((task, index) => renderTasksList(task, index))}
                </TransitionGroup>
                <button onClick={() => onDeleteAll(tasks)}>Delete all</button>
            </>
        );
    }
};

export default TasksList;
