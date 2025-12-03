import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

class BudgetService {
  constructor() {
    this.tableName = 'budget_c';
  }

  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "current_spent_c"}},
          {"field": {"Name": "month_c"}},
          {"field": {"Name": "monthly_limit_c"}},
          {"field": {"Name": "year_c"}},
          {"field": {"Name": "CreatedOn"}}
        ]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching budgets:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "current_spent_c"}},
          {"field": {"Name": "month_c"}},
          {"field": {"Name": "monthly_limit_c"}},
          {"field": {"Name": "year_c"}},
          {"field": {"Name": "CreatedOn"}}
        ]
      };

      const response = await apperClient.getRecordById(this.tableName, parseInt(id), params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching budget ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

async create(budgetData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      // Ensure category_c is an integer ID
      const categoryId = parseInt(budgetData.category?.Id || budgetData.category);
      if (!categoryId || isNaN(categoryId)) {
        throw new Error("Valid category ID is required");
      }

      const params = {
        records: [{
          Name: `Budget ${budgetData.month} ${budgetData.year}`,
          category_c: categoryId,
          current_spent_c: budgetData.currentSpent || 0,
          month_c: budgetData.month,
          monthly_limit_c: parseFloat(budgetData.monthlyLimit),
          year_c: parseInt(budgetData.year)
        }]
      };

      const response = await apperClient.createRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} budgets:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error creating budget:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, updateData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
records: [{
          Id: parseInt(id),
          Name: `Budget ${updateData.month} ${updateData.year}`,
          category_c: parseInt(updateData.category?.Id || updateData.category),
          current_spent_c: updateData.currentSpent || 0,
          month_c: updateData.month,
          monthly_limit_c: parseFloat(updateData.monthlyLimit),
          year_c: parseInt(updateData.year)
        }]
      };

      const response = await apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} budgets:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error updating budget:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} budgets:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length > 0;
      }
    } catch (error) {
      console.error("Error deleting budget:", error?.response?.data?.message || error);
      throw error;
    }
  }
}

export const budgetService = new BudgetService();