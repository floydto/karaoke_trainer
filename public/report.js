// dispaly inaccuracy (resultDisplayBar)
function displayReport(i) {
  reportIndex = i;
  toggleInterface(templateEnum.showPerformaceReport)
}

// function showTitle(){
//   let title = reportTitle[reportIndex]
//   document.getElementById("reportName").innerHTML = title
//   console.log(title)
// }

// Score and Ranking
function showScore() {
  if (reportData[reportIndex] instanceof Array) {
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    const currentScore = reportData[reportIndex].reduce(reducer);
    const highestScore = reportData[reportIndex].length * 10;
    const score = 100 - Math.round(currentScore / highestScore * 100); // accuracy
    let ranking;
      if (score < 20) {
        ranking = "Poor <i class='fas fa-poo'></i>";
      } else if (score < 40) {
        ranking = "Not good <i class='far fa-sad-tear'></i>";
      } else if (score < 60) {
        ranking = "Not Bad  <i class='far fa-grin-squint-tears'></i>";
      } else if (score < 80) {
        ranking = "Nice <i class='far fa-smile'></i>";
      } else {
        ranking = "Excellent <i class='far fa-laugh-beam'></i>";
      }
      document.getElementById("score").innerHTML = ranking + "<br>" + "Accuracy: " + score + "%";
  } else {
    document.getElementById("score").innerHTML = "";
  }
  const rank = document.getElementById("score")
  if (rank.style.display === "none") {
    rank.style.display = "block";
  } else {
    rank.style.display = "none";
  }
}









