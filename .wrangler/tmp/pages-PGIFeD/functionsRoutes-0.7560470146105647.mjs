import { onRequestPost as __api_booking_ts_onRequestPost } from "/Users/Ryan/Documents/WebDev/elmapt/functions/api/booking.ts"

export const routes = [
    {
      routePath: "/api/booking",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_booking_ts_onRequestPost],
    },
  ]