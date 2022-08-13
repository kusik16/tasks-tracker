import { useState } from "react";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { useSelector  } from "react-redux";

import { taskCreated, selectAll } from "../tasksList/tasksSlice";

import "./tasksAddInput.scss";

const TasksAddForm = () => {
    const [taskName, setTaskName] = useState("");
    const dispatch = useDispatch();
    const tasks = useSelector(selectAll);

    const calculateEmptyTasks = (tasks) => {
        let counter = 0;
        tasks.forEach(task => {
            if (task.name.includes('No name tracker #')) {
                counter++;
            }
        });
        return counter;
    };

    const onSubmitHandler = (e) => {
        e.preventDefault();
        const newTask = {
            id: uuidv4(),
            name: taskName || ('No name tracker #' + (calculateEmptyTasks(tasks) +1)),
            date: new Date().toISOString(),
            createDate: new Date().toISOString(),
            dateDiff: 0,
            isPlay: true,
        };
        dispatch(taskCreated(newTask));
        setTaskName("");
    };

    return (
        <form className='addform' onSubmit={onSubmitHandler}>
            <div className='addform_wrapper'>
                <input
                    type='text'
                    name='name'
                    className='addform_input'
                    id='name'
                    placeholder='Enter tracker name...'
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                />
                <button type='submit' className='material-icons addform_btn'>
                    play_circle
                </button>
            </div>
        </form>
    );
};

export default TasksAddForm;
