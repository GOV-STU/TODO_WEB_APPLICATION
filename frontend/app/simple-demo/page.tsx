"use client";

import { useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, PaperAirplaneIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

export default function SimpleTodoChat() {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Review project proposal', completed: false, category: 'today' },
    { id: 2, title: 'Team meeting at 2 PM', completed: false, category: 'today' },
    { id: 3, title: 'Submit expense report', completed: true, category: 'today' },
    { id: 4, title: 'Prepare presentation slides', completed: false, category: 'upcoming' },
    { id: 5, title: 'Call with client', completed: false, category: 'upcoming' },
  ]);

  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState('all');
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'assistant', text: 'Hello! How can I assist you today?' },
    { id: 2, sender: 'user', text: "What's on my agenda for today?" },
    { id: 3, sender: 'assistant', text: 'You have 3 tasks for today: Review project proposal, Team meeting at 2 PM, and Submit expense report (completed).' },
  ]);

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, {
        id: Date.now(),
        title: newTask,
        completed: false,
        category: 'today'
      }]);
      setNewTask('');
    }
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const clearCompleted = () => {
    setTasks(tasks.filter(task => !task.completed));
  };

  const sendMessage = () => {
    if (message.trim()) {
      setChatMessages([...chatMessages, {
        id: Date.now(),
        sender: 'user',
        text: message
      }]);
      setMessage('');

      // Simulate assistant response
      setTimeout(() => {
        setChatMessages(prev => [...prev, {
          id: Date.now() + 1,
          sender: 'assistant',
          text: 'I understand. Let me help you with that!'
        }]);
      }, 1000);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'today') return task.category === 'today';
    if (filter === 'upcoming') return task.category === 'upcoming';
    if (filter === 'completed') return task.completed;
    return true;
  });

  const tasksLeft = tasks.filter(t => !t.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-4rem)]">

          {/* Todo Section - Left Panel (65%) */}
          <div className="lg:col-span-2 flex flex-col">
            <div className="bg-white rounded-xl shadow-md flex flex-col h-full overflow-hidden">

              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">My To-Do List</h1>

                {/* Add Task Row */}
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTask()}
                    placeholder="Add a new task…"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={addTask}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
                  >
                    <PlusIcon className="h-5 w-5" />
                    Add Task
                  </button>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 mt-6">
                  {['all', 'today', 'upcoming', 'completed'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setFilter(tab)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                        filter === tab
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Task List */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Today's Tasks */}
                {filter === 'all' || filter === 'today' ? (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-700 mb-3">Today's Tasks</h2>
                    <div className="space-y-2">
                      {filteredTasks.filter(t => t.category === 'today').map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                        >
                          <button
                            onClick={() => toggleTask(task.id)}
                            className="flex-shrink-0"
                          >
                            {task.completed ? (
                              <CheckCircleIcon className="h-6 w-6 text-green-500" />
                            ) : (
                              <div className="h-6 w-6 border-2 border-gray-300 rounded-full hover:border-blue-500 transition-colors" />
                            )}
                          </button>
                          <span className={`flex-1 ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                            {task.title}
                          </span>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                              <PencilIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => deleteTask(task.id)}
                              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {/* Upcoming Tasks */}
                {filter === 'all' || filter === 'upcoming' ? (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-700 mb-3">Upcoming Tasks</h2>
                    <div className="space-y-2">
                      {filteredTasks.filter(t => t.category === 'upcoming').map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                        >
                          <button
                            onClick={() => toggleTask(task.id)}
                            className="flex-shrink-0"
                          >
                            {task.completed ? (
                              <CheckCircleIcon className="h-6 w-6 text-green-500" />
                            ) : (
                              <div className="h-6 w-6 border-2 border-gray-300 rounded-full hover:border-blue-500 transition-colors" />
                            )}
                          </button>
                          <span className={`flex-1 ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                            {task.title}
                          </span>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                              <PencilIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => deleteTask(task.id)}
                              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {/* Completed Tasks */}
                {filter === 'completed' && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-700 mb-3">Completed Tasks</h2>
                    <div className="space-y-2">
                      {filteredTasks.map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                        >
                          <CheckCircleIcon className="h-6 w-6 text-green-500 flex-shrink-0" />
                          <span className="flex-1 line-through text-gray-400">{task.title}</span>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-200 flex items-center justify-between">
                <span className="text-gray-600">{tasksLeft} tasks left</span>
                <button
                  onClick={clearCompleted}
                  className="px-4 py-2 text-gray-600 hover:text-red-600 font-medium transition-colors"
                >
                  Clear Completed
                </button>
              </div>
            </div>
          </div>

          {/* Chatbot Section - Right Panel (35%) */}
          <div className="lg:col-span-1 flex flex-col">
            <div className="bg-white rounded-xl shadow-md flex flex-col h-full overflow-hidden">

              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <ChatBubbleLeftIcon className="h-6 w-6 text-blue-600" />
                  Chat with Assistant
                </h2>
              </div>

              {/* Chat Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-4 ${
                        msg.sender === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {msg.sender === 'assistant' && (
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-6 w-6 bg-blue-600 rounded-full flex items-center justify-center">
                            <ChatBubbleLeftIcon className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-xs font-semibold text-gray-600">Assistant</span>
                        </div>
                      )}
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Area */}
              <div className="p-6 border-t border-gray-200">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message…"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={sendMessage}
                    className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <PaperAirplaneIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
