import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import moment from "moment";
import { useDrag, useDrop } from "react-dnd";

import { taskUpdated, taskDeleted } from "../tasksList/tasksSlice";

import "./tasksListItem.scss";

const TasksListItem = ({
    name,
    id,
    date,
    dateDiff,
    isPlay,
    index,
    moveTasks,
}) => {
    const dispatch = useDispatch();
    const timer = useRef(null);
    const ref = useRef(null);

    const [visibleTime, setVisibleTime] = useState(
        isPlay
            ? dateDiff + (new Date().getTime() - new Date(date).getTime())
            : dateDiff
    );

    useEffect(() => {
        if (isPlay) {
            timer.current = setInterval(() => {
                setVisibleTime(() => {
                    if (dateDiff === 0) {
                        return new Date().getTime() - new Date(date).getTime();
                    } else {
                        return (
                            dateDiff +
                            (new Date().getTime() - new Date(date).getTime())
                        );
                    }
                });
            }, 100);
        } else {
            clearInterval(timer.current);
        }
        // eslint-disable-next-line
    }, [isPlay]);

    const [{ handlerId }, drop] = useDrop({
        accept: "task",
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            };
        },
        hover(item, monitor) {
            if (!ref.current) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;
            if (dragIndex === hoverIndex) {
                return;
            }
            const hoverBoundingRect = ref.current?.getBoundingClientRect();
            const hoverMiddleY =
                (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const clientOffset = monitor.getClientOffset();
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }
            moveTasks(dragIndex, hoverIndex);
            item.index = hoverIndex;
        },
    });
    const [{ isDragging }, drag] = useDrag({
        type: "task",
        item: () => {
            return { id, index };
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });
    const opacity = isDragging ? 0 : 1;
    drag(drop(ref));

    const handleToggleTimer = () => {
        const newIsPlay = !isPlay;

        let newDateDiff = dateDiff;
        if (!newIsPlay) {
            newDateDiff = visibleTime;
        }

        dispatch(
            taskUpdated({
                id,
                changes: {
                    date: new Date().toISOString(),
                    dateDiff: newDateDiff,
                    isPlay: newIsPlay,
                },
            })
        );
    };

    const onDelete = (id) => {
        clearInterval(timer.current);
        dispatch(taskDeleted(id));
        // eslint-disable-next-line
    };

    return (
        <li
            ref={ref}
            style={{ opacity }}
            data-handler-id={handlerId}
            className={`tasks__item ${isPlay ? "active" : ""}`}>
            <div className='tasks__item_description flex'>{name}</div>
            <div className='tasks__item_time flex'>
                {moment()
                    .hour(0)
                    .minute(0)
                    .second(0)
                    .millisecond(visibleTime)
                    .format("HH:mm:ss.SSS")}
            </div>
            <button
                className='material-icons tasks__item_btn-toggle flex'
                onClick={() => handleToggleTimer()}>
                {isPlay ? "pause_circle_outline" : "play_circle_outline"}
            </button>
            <button
                className='material-icons tasks__item_btn-delete flex'
                onClick={() => onDelete(id)}>
                remove_circle_outline
            </button>
        </li>
    );
};

export default TasksListItem;
