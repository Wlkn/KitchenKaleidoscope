import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { setCredentials, logOut } from "../reducers/auth"

const baseQuery = fetchBaseQuery({
    // baseUrl: "https://kitchenkaleidoscope-server.onrender.com/",
    baseUrl: "http://localhost:4000/",
    //attempt at bypassin cors
    credentials: "omit",

    prepareHeaders: (headers, { getState }: any) => {
        //TODO why is this any?

        const token = localStorage.getItem("token") || getState().auth.token;

        if (token) {
            headers.set("authorization", `Bearer ${token}`);
        }
        return headers;
    },
});

export const apiSlice = createApi({
    baseQuery: baseQuery,
    endpoints: (builder) => ({}),
});
