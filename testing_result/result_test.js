// dispaly inaccuracy

let reportData = [1,2,3,4,5,6,7,8,9,10,,4,5,8,9,,2,4,6,8,9,6,4,10];

let scoreColor = ["#2A805A","#36a473","#5bc998","#c9dc23","#e7d318",
    "#d6b329","#e3965f","#d97026","#ba3d74","#a53667","#802A50"];

var ul = document.getElementById("placeHolder");
var fragment = document.createDocumentFragment();
reportData.forEach(function(color){
    let li = document.createElement("li");
    li.className = 'colorize'
    li.style.backgroundColor = scoreColor[color];
    fragment.appendChild(li);
})

ul.appendChild(fragment);

// Score and Ranking
  
  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  const currentScore = reportData.reduce(reducer);
  const highestScore = reportData.length * 10;
  const score = 100 - Math.round(currentScore/highestScore * 100); // accuracy

  function showScore() {
    var rank = document.getElementById("score")
    if (rank.style.display === "none") {
        rank.style.display = "block";
    var ranking;
    if (score < 20) {
      ranking = "Poor";
    } else if (score < 40) {
      ranking = "Average";
    } else if (score < 60) {
      ranking = "Not Bad";
    } else if (score < 80) {
        ranking = "Nice";
    }else {
      ranking = "Excellent";
    }
    document.getElementById("score").innerHTML = ranking + "<br>" + "Accuracy: " + score + "%";
  }else {
    rank.style.display = "none";
  }
}

// show and hide function

// function myFunction() {
//     var ul = document.getElementById("myList");
//     var fragment = document.createDocumentFragment();
//     if (ul.style.display === "none") {
//       ul.style.display = "block";
//         for(let color of reportData){
//           let li = document.createElement("li");
//           li.className = 'colorize'
//           li.style.backgroundColor = scoreColor[color];
//           fragment.appendChild(li);
//       }
//       ul.appendChild(fragment)
//     } else {
//       ul.style.display = "none";
//     }
//   }

 






