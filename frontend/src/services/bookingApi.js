import { baseApi } from "./baseApi";

/**
 * Booking API
 * RTK Query endpoints for booking players
 */
export const bookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createBooking: builder.mutation({
      query: (data) => ({
        url: "/bookings",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Transaction", "User"], // Invalidate user to update balance
    }),
    getMyBookings: builder.query({
      query: () => "/bookings/my-bookings",
    }),
  }),
});

export const {
  useCreateBookingMutation,
  useGetMyBookingsQuery,
} = bookingApi;
