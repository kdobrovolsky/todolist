import { ResultCode } from "@/common/enums"

import { BaseQueryApi, FetchBaseQueryError, FetchBaseQueryMeta, QueryReturnValue } from "@reduxjs/toolkit/query/react"
import { isErrorWithMessage } from "@/common/utils/isErrorWithMessage.ts"
import { setAppErrorAC } from "@/app/appSlice.ts"

export const handleError = (
  api: BaseQueryApi,
  res: QueryReturnValue<unknown, FetchBaseQueryError, FetchBaseQueryMeta>,
) => {
  let error = "Some error occurred"
  if (res.error) {
    switch (res.error.status) {
      case "FETCH_ERROR":
      case "PARSING_ERROR":
      case "CUSTOM_ERROR":
        error = res.error.error
        break
      case 403:
        error = "403 Forbidden Error. Check API-KEY"
        break
      case 400:
        if (isErrorWithMessage(res.error.data)) {
          error = res.error.data.message
        } else {
          error = JSON.stringify(res.error.data)
        }
        break
      default:
        if (res.error.status >= "500" && res.error.status < "600") {
          error = "Server error occurred. Please try again later."
        } else {
          error = JSON.stringify(res.error)
        }
        break
    }
    api.dispatch(setAppErrorAC({ error }))
  }
  if ((res.data as { resultCode: ResultCode }).resultCode === ResultCode.Error) {
    const messages = (res.data as { messages: string[] }).messages
    error = messages.length ? messages[0] : error
    api.dispatch(setAppErrorAC({ error }))
  }
  return res
}
