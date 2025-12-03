import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

class SavingsGoalService {
  constructor() {
    this.tableName = 'savings_goal_c';
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
          {"field": {"Name": "current_amount_c"}},
          {"field": {"Name": "target_amount_c"}},
          {"field": {"Name": "target_date_c"}},
          {"field": {"Name": "description_c"}},
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
      console.error("Error fetching savings goals:", error?.response?.data?.message || error);
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
          {"field": {"Name": "current_amount_c"}},
          {"field": {"Name": "target_amount_c"}},
          {"field": {"Name": "target_date_c"}},
          {"field": {"Name": "description_c"}},
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
      console.error(`Error fetching savings goal ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

  async create(goalData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        records: [{
          Name: goalData.name,
          current_amount_c: goalData.currentAmount,
          target_amount_c: goalData.targetAmount,
          target_date_c: goalData.targetDate ? goalData.targetDate.split('T')[0] : null,
          description_c: goalData.description || null
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
          console.error(`Failed to create ${failed.length} savings goals:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error creating savings goal:", error?.response?.data?.message || error);
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
          Name: updateData.name,
          current_amount_c: updateData.currentAmount,
          target_amount_c: updateData.targetAmount,
          target_date_c: updateData.targetDate ? updateData.targetDate.split('T')[0] : null,
          description_c: updateData.description || null
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
          console.error(`Failed to update ${failed.length} savings goals:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error updating savings goal:", error?.response?.data?.message || error);
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
          console.error(`Failed to delete ${failed.length} savings goals:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length > 0;
      }
    } catch (error) {
      console.error("Error deleting savings goal:", error?.response?.data?.message || error);
      throw error;
    }
  }
}

export const savingsGoalService = new SavingsGoalService();