import { baseApi } from './baseApi';

export const uploadApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadImage: builder.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append('image', file);
        return {
          url: '/upload',
          method: 'POST',
          body: formData,
        };
      },
      // Backend now returns { success: true, data: { url: "...", filename: "..." } }
      transformResponse: (response) => {
        return response.data; // Return the inner data object
      },
    }),
  }),
});

export const { useUploadImageMutation } = uploadApi;
