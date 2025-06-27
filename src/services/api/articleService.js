import { toast } from 'react-toastify'

const articleService = {
  async getAll() {
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
          { field: { Name: "headline" } },
          { field: { Name: "summary" } },
          { field: { Name: "imageUrl" } },
          { field: { Name: "source" } },
          { field: { Name: "category" } },
          { field: { Name: "publishedAt" } },
          { field: { Name: "url" } },
          { field: { Name: "readingTime" } }
        ]
      };

      const response = await apperClient.fetchRecords('article', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching articles:", error);
      toast.error("Failed to fetch articles");
      return [];
    }
  },

  async getById(id) {
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
          { field: { Name: "headline" } },
          { field: { Name: "summary" } },
          { field: { Name: "imageUrl" } },
          { field: { Name: "source" } },
          { field: { Name: "category" } },
          { field: { Name: "publishedAt" } },
          { field: { Name: "url" } },
          { field: { Name: "readingTime" } }
        ]
      };

      const response = await apperClient.getRecordById('article', parseInt(id, 10), params);

      if (!response || !response.data) {
        throw new Error('Article not found');
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching article with ID ${id}:`, error);
      throw error;
    }
  },

  async getFeedArticles(excludeIds = []) {
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
          { field: { Name: "headline" } },
          { field: { Name: "summary" } },
          { field: { Name: "imageUrl" } },
          { field: { Name: "source" } },
          { field: { Name: "category" } },
          { field: { Name: "publishedAt" } },
          { field: { Name: "url" } },
          { field: { Name: "readingTime" } }
        ]
      };

      if (excludeIds.length > 0) {
        params.where = [{
          FieldName: "Id",
          Operator: "ExactMatch",
          Values: excludeIds,
          Include: false
        }];
      }

      const response = await apperClient.fetchRecords('article', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching feed articles:", error);
      toast.error("Failed to fetch feed articles");
      return [];
    }
  },

  async getSavedArticles() {
    try {
      // Get user preferences to find saved articles
      const preferences = await this.getUserPreferences();
      const savedArticleIds = preferences?.saved_articles ? preferences.saved_articles.split(',').map(id => parseInt(id, 10)) : [];

      if (savedArticleIds.length === 0) {
        return [];
      }

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
          { field: { Name: "headline" } },
          { field: { Name: "summary" } },
          { field: { Name: "imageUrl" } },
          { field: { Name: "source" } },
          { field: { Name: "category" } },
          { field: { Name: "publishedAt" } },
          { field: { Name: "url" } },
          { field: { Name: "readingTime" } }
        ],
        where: [{
          FieldName: "Id",
          Operator: "ExactMatch",
          Values: savedArticleIds,
          Include: true
        }]
      };

      const response = await apperClient.fetchRecords('article', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching saved articles:", error);
      toast.error("Failed to fetch saved articles");
      return [];
    }
  },

  async saveArticle(id) {
    try {
      const preferences = await this.getUserPreferences();
      const savedArticleIds = preferences?.saved_articles ? preferences.saved_articles.split(',').filter(Boolean) : [];
      const articleId = parseInt(id, 10).toString();

      if (!savedArticleIds.includes(articleId)) {
        savedArticleIds.push(articleId);
        await this.updateUserPreferences({
          saved_articles: savedArticleIds.join(',')
        });
      }

      return true;
    } catch (error) {
      console.error("Error saving article:", error);
      throw error;
    }
  },

  async unsaveArticle(id) {
    try {
      const preferences = await this.getUserPreferences();
      const savedArticleIds = preferences?.saved_articles ? preferences.saved_articles.split(',').filter(Boolean) : [];
      const articleId = parseInt(id, 10).toString();

      const updatedIds = savedArticleIds.filter(savedId => savedId !== articleId);
      await this.updateUserPreferences({
        saved_articles: updatedIds.join(',')
      });

      return true;
    } catch (error) {
      console.error("Error unsaving article:", error);
      throw error;
    }
  },

  async markAsSwipedLeft(id) {
    try {
      const preferences = await this.getUserPreferences();
      const swipedArticleIds = preferences?.swiped_articles ? preferences.swiped_articles.split(',').filter(Boolean) : [];
      const articleId = parseInt(id, 10).toString();

      if (!swipedArticleIds.includes(articleId)) {
        swipedArticleIds.push(articleId);
        await this.updateUserPreferences({
          swiped_articles: swipedArticleIds.join(',')
        });
      }

      return true;
    } catch (error) {
      console.error("Error marking article as swiped:", error);
      throw error;
    }
  },

  async refreshFeed() {
    try {
      // Clear swiped articles to refresh feed
      await this.updateUserPreferences({
        swiped_articles: ''
      });

      // Return all articles
      return await this.getAll();
    } catch (error) {
      console.error("Error refreshing feed:", error);
      toast.error("Failed to refresh feed");
      return [];
    }
  },

  async searchSavedArticles(query) {
    try {
      const savedArticles = await this.getSavedArticles();
      if (!query) return savedArticles;

      const searchTerm = query.toLowerCase();
      const filtered = savedArticles.filter(article =>
        article.headline?.toLowerCase().includes(searchTerm) ||
        article.summary?.toLowerCase().includes(searchTerm) ||
        article.source?.toLowerCase().includes(searchTerm) ||
        article.category?.toLowerCase().includes(searchTerm)
      );

      return filtered;
    } catch (error) {
      console.error("Error searching saved articles:", error);
      toast.error("Failed to search articles");
      return [];
    }
  },

  async filterSavedByCategory(category) {
    try {
      const savedArticles = await this.getSavedArticles();
      if (!category || category === 'All') return savedArticles;

      const filtered = savedArticles.filter(article => article.category === category);
      return filtered;
    } catch (error) {
      console.error("Error filtering saved articles:", error);
      toast.error("Failed to filter articles");
      return [];
    }
  },

  // Helper methods for user preferences
  async getUserPreferences() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
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
      console.error("Error fetching user preferences:", error);
      return null;
    }
  },

  async updateUserPreferences(data) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const preferences = await this.getUserPreferences();

      if (preferences) {
        // Update existing preferences
        const params = {
          records: [{
            Id: preferences.Id,
            ...data
          }]
        };

        const response = await apperClient.updateRecord('preference', params);

        if (!response.success) {
          console.error(response.message);
          throw new Error(response.message);
        }
      } else {
        // Create new preferences
        const params = {
          records: [data]
        };

        const response = await apperClient.createRecord('preference', params);

        if (!response.success) {
          console.error(response.message);
          throw new Error(response.message);
        }
      }
    } catch (error) {
      console.error("Error updating user preferences:", error);
      throw error;
    }
  }
};

export default articleService