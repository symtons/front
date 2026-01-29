import api from './authService';

export const bulkImportService = {
  // Upload and parse Excel file
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/BulkImport/Upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  // Import employees
  importEmployees: async (data) => {
    const response = await api.post('/BulkImport/Import', data);
    return response.data;
  },

  // Get import history
  getHistory: async () => {
    const response = await api.get('/BulkImport/History');
    return response.data;
  },
};