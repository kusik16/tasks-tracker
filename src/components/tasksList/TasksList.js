import { useCallback } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useSelector, useDispatch } from "react-redux";
import { useDrop } from "react-dnd";

import TasksListItem from "../tasksListItem/TasksListItem";
import { taskDeleted, selectAll } from "./tasksSlice";

import "./taskList.scss";

const TasksList = () => {
    const [{ isOver }, drop] = useDrop(
        () => ({
            accept: "BOX",
            collect: (monitor) => ({
                isOver: !!monitor.isOver(),
            }),
        }),
        []
    );

    const tasks = useSelector(selectAll);

    const dispatch = useDispatch();

    const onDelete = useCallback((id) => {
        dispatch(taskDeleted(id));
        // eslint-disable-next-line
    }, []);

    const renderTasksList = (arr) => {
        if (arr.length === 0) {
            return (
                <CSSTransition timeout={500} classNames='list'>
                    <h5>No tasks yet</h5>
                </CSSTransition>
            );
        }

        return arr
            .sort((a, b) => b.date - a.date)
            .map(({ id, ...props }) => {
                return (
                    <CSSTransition key={id} timeout={500} classNames='list'>
                        <TasksListItem
                            ref={drop}
                            {...props}
                            id={id}
                            onDelete={() => onDelete(id)}
                        />
                    </CSSTransition>
                );
            });
    };

    const elements = renderTasksList(tasks);
    return (
        <TransitionGroup component='ul' className='list'>
            {elements}
        </TransitionGroup>
    );
};

export default TasksList;
