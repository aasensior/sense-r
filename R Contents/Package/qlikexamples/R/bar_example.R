#' A Static Bar Chart example
#' 
#' This is just a simple example about how to have a function that starts to create a bar chart and label it.
#' This chart is inspired in the tutorial available here - http://tryr.codeschool.com/levels/2/challenges/1
#' 
#' @keywords barchart, vector, legend, pirates
#' @export
#' @examples
#' bar_example()
bar_example<-function(){
  vesselsSunk<-c(4,5,1)
  names(vesselsSunk)<-c("England","France","Norway")
  barplot(vesselsSunk, main="Pirates Vessels Sunk")
}