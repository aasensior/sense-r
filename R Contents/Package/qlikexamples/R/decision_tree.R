#' Dynamic function to return a decision tree
#' 
#' Based on data sent from Qlik Sense this function will call rpart and plot it's result.
#' 
#' @keywords tree, decision, rpart, plot, qlik, sense
#' @export 
#' @examples
#' decision_tree(formula, data_table)
decision_tree<-function(formula, data_table){
  require(rpart)
  local_tree<-rpart(formula, data_table,method="class")
  plot(local_tree, uniform=TRUE, main="Decision Tree for Your Selections")
  text(local_tree, use.n=TRUE, all=TRUE, cex=.8)
}