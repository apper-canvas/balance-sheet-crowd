import { useState, useEffect } from 'react';
import { cn } from '@/utils/cn';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Card from '@/components/atoms/Card';
import Loading from '@/components/ui/Loading';
import ErrorView from '@/components/ui/ErrorView';
import Empty from '@/components/ui/Empty';
import TaskForm from '@/components/organisms/TaskForm';
import TaskItem from '@/components/molecules/TaskItem';
import { taskService } from '@/services/api/taskService';

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'Open', label: 'Open' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Completed', label: 'Completed' },
  { value: 'Blocked', label: 'Blocked' }
];

const priorityOptions = [
  { value: 'all', label: 'All Priorities' },
  { value: 'High', label: 'High' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Low', label: 'Low' }
];

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    filterTasks();
  }, [tasks, searchTerm, statusFilter, priorityFilter]);

  const loadTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await taskService.getAll();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterTasks = () => {
    let filtered = [...tasks];

    // Search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(task => 
        task.title_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.category_c?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status_c === statusFilter);
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(task => task.priority_c === priorityFilter);
    }

    setFilteredTasks(filtered);
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setShowForm(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleDeleteTask = async (task) => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    const success = await taskService.delete(task.Id);
    if (success) {
      await loadTasks();
    }
  };

  const handleSubmitTask = async (formData) => {
    setIsSubmitting(true);
    try {
      let success;
      if (editingTask) {
        success = await taskService.update(editingTask.Id, formData);
      } else {
        success = await taskService.create(formData);
      }

      if (success) {
        setShowForm(false);
        setEditingTask(null);
        await loadTasks();
      }
    } catch (err) {
      console.error('Error submitting task:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  const getTaskStats = () => {
    const stats = {
      total: tasks.length,
      open: tasks.filter(t => t.status_c === 'Open').length,
      inProgress: tasks.filter(t => t.status_c === 'In Progress').length,
      completed: tasks.filter(t => t.status_c === 'Completed').length,
      overdue: tasks.filter(t => 
        t.due_date_c && 
        new Date(t.due_date_c) < new Date() && 
        t.status_c !== 'Completed'
      ).length
    };
    return stats;
  };

  if (loading && tasks.length === 0) {
    return <Loading message="Loading tasks..." />;
  }

  if (error) {
    return (
      <ErrorView
        title="Error Loading Tasks"
        message={error}
        onRetry={loadTasks}
      />
    );
  }

  const stats = getTaskStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600 mt-1">
            Manage your tasks and track progress
          </p>
        </div>
        <Button
          onClick={handleCreateTask}
          className="flex items-center gap-2"
        >
          <ApperIcon name="Plus" size={20} />
          Add Task
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-500">Total</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">{stats.open}</div>
            <div className="text-sm text-gray-500">Open</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
            <div className="text-sm text-gray-500">In Progress</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-sm text-gray-500">Completed</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
            <div className="text-sm text-gray-500">Overdue</div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Tasks
            </label>
            <div className="relative">
              <ApperIcon 
                name="Search" 
                size={20} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title, description, or category..."
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <Select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              {priorityOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </Card>

      {/* Task Form */}
      {showForm && (
        <Card className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingTask ? 'Edit Task' : 'Create New Task'}
            </h2>
          </div>
          <TaskForm
            task={editingTask}
            onSubmit={handleSubmitTask}
            onCancel={handleCancelForm}
            isLoading={isSubmitting}
          />
        </Card>
      )}

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <Empty
          icon="CheckSquare"
          title="No tasks found"
          message={
            tasks.length === 0 
              ? "Get started by creating your first task"
              : "Try adjusting your search or filters"
          }
          action={tasks.length === 0 ? (
            <Button onClick={handleCreateTask} className="mt-4">
              Create First Task
            </Button>
          ) : null}
        />
      ) : (
        <div className="grid gap-4">
          {filteredTasks.map((task) => (
            <TaskItem
              key={task.Id}
              task={task}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          ))}
        </div>
      )}

      {loading && tasks.length > 0 && (
        <div className="flex justify-center py-4">
          <div className="animate-spin h-6 w-6 border-2 border-primary-500 border-t-transparent rounded-full" />
        </div>
      )}
    </div>
  );
}

export default Tasks;