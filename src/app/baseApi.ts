import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { AUTH_TOKEN } from "@/common/constants"
import { handleError } from "@/common/utils/handleError.ts"

export const baseApi = createApi({
  reducerPath: "baseApi",
  refetchOnFocus: true,
  refetchOnReconnect: true,
  tagTypes: ["Todolist", "Task"],
  baseQuery: async (args, api, extraOptions) => {
    const res = await fetchBaseQuery({
      baseUrl: import.meta.env.VITE_BASE_URL,
      headers: {
        "API-KEY": import.meta.env.VITE_API_KEY,
      },
      prepareHeaders: (headers) => {
        const token = localStorage.getItem(AUTH_TOKEN)
        if (token) {
          headers.set("Authorization", `Bearer ${token} `)
        }
        return headers
      },
    })(args, api, extraOptions)

    handleError(api, res)
    return res
  },
  endpoints: () => ({}),
})
