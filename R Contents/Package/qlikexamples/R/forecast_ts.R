#' Dynamic function to return time series forecasting plot
#' 
#' Based on data sent from Qlik Sense this function will call ts() from R's forecast library and plot it based on ets().
#' 
#' @keywords time, series, forecast, ts, ets, plot, qlik, sense
#' @export 
#' @examples
#' forecast_ts(data_table)
forecast_ts <- function(datos, year, month) {
  require(forecast)
  myframe <- data.frame(matrix(unlist(datos), ncol = 3))
  d <- ts(myframe[,3], start = c(year, month), frequency = 12)
  fit<-ets(d)
  plot(forecast(fit), main="Forecasting For Your Selections")
}