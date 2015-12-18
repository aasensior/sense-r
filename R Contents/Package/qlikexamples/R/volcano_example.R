#' A static perspective example for a 3D Volcano
#' 
#' This is an example to show 3 Dimensional plot. The data is a sample R data of a dormant New Zealand Volcano.
#' This is inspired in the tutorial available here - http://tryr.codeschool.com/levels/3/challenges/1
#' 
#' @keywords plot, 3d, matrix, advanced
#' @export
#' @examples
#' volcano_example()
volcano_example<-function(){
  persp(volcano, expand=0.3)
}