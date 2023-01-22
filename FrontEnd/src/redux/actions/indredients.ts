// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// // import { setCredentials, logOut } from "../reducers/auth"

// const baseQuery = fetchBaseQuery({
    
//     baseUrl: "http://localhost:4000/",
//     credentials: "include",
//     prepareHeaders: (headers, { getState }: any) => {
//         //TODO why is this any?
//         const token = getState().auth.token;
//         console.log(token)
//         if (token) {
//             headers.set("authorization", `Bearer ${token}`);
//         }
//         return headers;
//     },
// });

// export const apiSlice = createApi({
//     baseQuery: baseQuery,
//     endpoints: (builder) => ({}),
// });
