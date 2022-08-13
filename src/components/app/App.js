import TasksList from "../tasksList/TasksList";
import TasksAddInput from "../tasksAddInput/TasksAddInput";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import "./app.scss";

const App = () => {
    return (
        <main className='app'>
            <div className='content'>
                <TasksAddInput />
                <DndProvider backend={HTML5Backend}>
                    <TasksList />
                </DndProvider>
            </div>
        </main>
    );
};

export default App;
