import { useState, useEffect } from 'react';
import { cn } from '@/utils/cn';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import FormField from '@/components/molecules/FormField';

const statusOptions = [
  { value: 'Open', label: 'Open' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Completed', label: 'Completed' },
  { value: 'Blocked', label: 'Blocked' }
];

const priorityOptions = [
  { value: 'High', label: 'High' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Low', label: 'Low' }
];

function TaskForm({ task, onSubmit, onCancel, isLoading = false, className }) {
  const [formData, setFormData] = useState({
    title_c: '',
    description_c: '',
    status_c: 'Open',
    priority_c: 'Medium',
    due_date_c: '',
    category_c: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      setFormData({
        title_c: task.title_c || '',
        description_c: task.description_c || '',
        status_c: task.status_c || 'Open',
        priority_c: task.priority_c || 'Medium',
        due_date_c: task.due_date_c || '',
        category_c: task.category_c || ''
      });
    }
  }, [task]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title_c.trim()) {
      newErrors.title_c = 'Title is required';
    }

    if (formData.due_date_c && new Date(formData.due_date_c) < new Date()) {
      newErrors.due_date_c = 'Due date cannot be in the past';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSubmit(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-6", className)}>
      <FormField
        label="Title"
        required
        error={errors.title_c}
      >
        <Input
          value={formData.title_c}
          onChange={(e) => handleChange('title_c', e.target.value)}
          placeholder="Enter task title"
          disabled={isLoading}
        />
      </FormField>

      <FormField
        label="Description"
        error={errors.description_c}
      >
        <textarea
          value={formData.description_c}
          onChange={(e) => handleChange('description_c', e.target.value)}
          placeholder="Enter task description"
          disabled={isLoading}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
        />
      </FormField>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Status"
          error={errors.status_c}
        >
          <Select
            value={formData.status_c}
            onChange={(e) => handleChange('status_c', e.target.value)}
            disabled={isLoading}
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField
          label="Priority"
          error={errors.priority_c}
        >
          <Select
            value={formData.priority_c}
            onChange={(e) => handleChange('priority_c', e.target.value)}
            disabled={isLoading}
          >
            {priorityOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormField>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Due Date"
          error={errors.due_date_c}
        >
          <Input
            type="date"
            value={formData.due_date_c}
            onChange={(e) => handleChange('due_date_c', e.target.value)}
            disabled={isLoading}
          />
        </FormField>

        <FormField
          label="Category"
          error={errors.category_c}
        >
          <Input
            value={formData.category_c}
            onChange={(e) => handleChange('category_c', e.target.value)}
            placeholder="Enter category"
            disabled={isLoading}
          />
        </FormField>
      </div>

      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading ? 'Saving...' : (task ? 'Update Task' : 'Create Task')}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

export default TaskForm;