import { apiSlice } from "../apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: "/auth/login",
                method: "POST",
                body: { ...credentials },
            }),
        }),
        getUserName: builder.query({
            query: (userId) => ({
                url: `/api/recipes/name/${userId}`,
                method: "GET",
            }),
        }),
    }),
});

export const { useLoginMutation } = authApiSlice;
export const { useGetUserNameQuery } = authApiSlice;
