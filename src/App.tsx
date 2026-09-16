/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';

import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { TodoModal } from './components/TodoModal';
import { Loader } from './components/Loader';
import { getTodos } from './api';
import { Todo } from './types/Todo';

function filterBy(todos: Todo[], filter = '', query = ''): Todo[] {
  let currentFilteredTodos = [...todos];

  if (query.length !== 0) {
    currentFilteredTodos = currentFilteredTodos.filter(todo =>
      todo.title.toLowerCase().includes(query.toLowerCase()),
    );
  }

  switch (filter) {
    case 'completed':
      currentFilteredTodos = currentFilteredTodos.filter(
        todo => todo.completed,
      );
      break;

    case 'active':
      currentFilteredTodos = currentFilteredTodos.filter(
        todo => !todo.completed,
      );
      break;
  }

  return currentFilteredTodos;
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isTodosLoading, setIsTodosLoading] = useState(true);
  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);
  const [filter, setFilter] = useState('');
  const [query, setQuery] = useState('');

  const selectedTodo = todos.find(todo => todo.id === selectedTodoId) ?? null;
  const filteredTodos = filterBy(todos, filter, query);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .finally(() => setIsTodosLoading(false));
  }, []);

  const handleTodoSelect = (todoId: number) => {
    setSelectedTodoId(current => (current === todoId ? null : todoId));
  };

  const handleModalClose = () => {
    setSelectedTodoId(null);
  };

  return (
    <>
      <div className="section">
        <div className="container">
          <div className="box">
            <h1 className="title">Todos:</h1>

            <div className="block">
              <TodoFilter
                filterBy={(currentFilter, currentQuery) => {
                  setFilter(currentFilter);
                  setQuery(currentQuery);
                }}
              />
            </div>

            <div className="block">
              {isTodosLoading ? (
                <Loader />
              ) : (
                <TodoList
                  todos={filteredTodos}
                  selectedTodoId={selectedTodoId}
                  onTodoSelect={handleTodoSelect}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {selectedTodo && (
        <TodoModal todo={selectedTodo} onClose={handleModalClose} />
      )}
    </>
  );
};
