import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import moment from "moment";
import { useDrag } from "react-dnd";

import { taskUpdated } from "../tasksList/tasksSlice";

import "./tasksListItem.scss";

const TasksListItem = ({ name, id, date, dateDiff, onDelete, isPlay }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        // "type" is required. It is used by the "accept" specification of drop targets.
        type: "BOX",
        // The collect function utilizes a "monitor" instance (see the Overview for what this is)
        // to pull important pieces of state from the DnD system.
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }));

    const dispatch = useDispatch();

    const [visibleTime, setVisibleTime] = useState(
        isPlay
            ? dateDiff + (new Date().getTime() - new Date(date).getTime())
            : dateDiff
    );
    const timer = useRef(null);

    useEffect(() => {
        if (isPlay) {
            timer.current = setInterval(() => {
                setVisibleTime((visibleTime) => {
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

    // console.log(visibleTime);

    return (
        <li
            ref={drag}
            style={{ opacity: isDragging ? 0.5 : 1 }}
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
                onClick={onDelete}>
                remove_circle_outline
            </button>
        </li>
    );
};

export default TasksListItem;
