import { toast } from 'react-toastify'

const preferencesService = {
  async getPreferences() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "categories" } },
          { field: { Name: "saved_articles" } },
          { field: { Name: "swiped_articles" } }
        ],
        pagingInfo: { limit: 1 }
      };

      const response = await apperClient.fetchRecords('preference', params);

      if (!response.success) {
        console.error(response.message);
        // Return default preferences if none found
        return {
          categories: ['World', 'Technology', 'Business', 'Sports', 'Health'],
          savedArticles: [],
          swipedArticles: []
        };
      }

      const preferences = response.data?.[0];
      if (!preferences) {
        return {
          categories: ['World', 'Technology', 'Business', 'Sports', 'Health'],
          savedArticles: [],
          swipedArticles: []
        };
      }

      return {
        categories: preferences.categories ? preferences.categories.split(',') : ['World', 'Technology', 'Business', 'Sports', 'Health'],
        savedArticles: preferences.saved_articles ? preferences.saved_articles.split(',').filter(Boolean) : [],
        swipedArticles: preferences.swiped_articles ? preferences.swiped_articles.split(',').filter(Boolean) : []
      };
    } catch (error) {
      console.error("Error fetching preferences:", error);
      toast.error("Failed to fetch preferences");
      return {
        categories: ['World', 'Technology', 'Business', 'Sports', 'Health'],
        savedArticles: [],
        swipedArticles: []
      };
    }
  },

  async updateCategories(categories) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Get existing preferences
      const existingPrefs = await this.getPreferences();
      
      // Check if preferences record exists
      const existingRecord = await this.getPreferencesRecord();
      
      const updateData = {
        categories: categories.join(',')
      };

      if (existingRecord) {
        // Update existing record
        const params = {
          records: [{
            Id: existingRecord.Id,
            ...updateData
          }]
        };

        const response = await apperClient.updateRecord('preference', params);

        if (!response.success) {
          console.error(response.message);
          toast.error(response.message);
          return existingPrefs;
        }
      } else {
        // Create new record
        const params = {
          records: [updateData]
        };

        const response = await apperClient.createRecord('preference', params);

        if (!response.success) {
          console.error(response.message);
          toast.error(response.message);
          return existingPrefs;
        }
      }

      return {
        ...existingPrefs,
        categories: [...categories]
      };
    } catch (error) {
      console.error("Error updating categories:", error);
      toast.error("Failed to update categories");
      const existingPrefs = await this.getPreferences();
      return existingPrefs;
    }
  },

  async toggleCategory(category) {
    try {
      const preferences = await this.getPreferences();
      const categories = [...preferences.categories];
      const index = categories.indexOf(category);
      
      if (index > -1) {
        categories.splice(index, 1);
      } else {
        categories.push(category);
      }
      
      return await this.updateCategories(categories);
    } catch (error) {
      console.error("Error toggling category:", error);
      toast.error("Failed to toggle category");
      return await this.getPreferences();
    }
  },

  async getAvailableCategories() {
    return ['World', 'Technology', 'Business', 'Sports', 'Health', 'Science', 'Entertainment', 'Politics'];
  },

  // Helper method to get the raw preferences record
  async getPreferencesRecord() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "categories" } },
          { field: { Name: "saved_articles" } },
          { field: { Name: "swiped_articles" } }
        ],
        pagingInfo: { limit: 1 }
      };

      const response = await apperClient.fetchRecords('preference', params);

      if (!response.success) {
        return null;
      }

      return response.data?.[0] || null;
    } catch (error) {
      console.error("Error fetching preferences record:", error);
      return null;
    }
  }
};

export default preferencesService