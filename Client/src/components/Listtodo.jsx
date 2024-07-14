import React, { useState, useEffect } from 'react';
import Edittodo from './Edittodo';

const apiUrl = process.env.REACT_APP_API_URL;

const Listtodo = () => {
    const [todos, setTodos] = useState([]);

    async function deleteTodo(id) {
        try {
            const response = await fetch(`${apiUrl}/todos/${id}`, {
                method: "DELETE"
            });
            if (!response.ok) {
                throw new Error('Failed to delete todo');
            }
            setTodos(todos.filter(todo => todo.todo_id !== id));
            console.log(`Todo with ID ${id} deleted successfully`);
        } catch (err) {
            console.error(err.message);
        }
    }

    async function getTodos() {
        try {
            const response = await fetch(`${apiUrl}/todos`);
            if (!response.ok) {
                throw new Error('Failed to fetch todos');
            }
            const jsonData = await response.json();
            setTodos(jsonData);
        } catch (err) {
            console.error(err.message);
        }
    }

    useEffect(() => {
        getTodos();
    }, []);

    return (
        <div>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">Description</th>
                        <th scope="col">Edit</th>
                        <th scope="col">Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {todos.map(todo => (
                        <tr key={todo.todo_id}>
                            <td>{todo.description}</td>
                            <td><Edittodo todo={todo} /></td>
                            <td className='btn btn-danger' onClick={() => deleteTodo(todo.todo_id)}>Delete</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Listtodo;
