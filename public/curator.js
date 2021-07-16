// ===== Mini Player - Play/Pause Switch =====

/* $(".btn-play").click(function () {
	TweenMax.to($(".btn-play"), 0.2, {
		x: 20,
		opacity: 0,
		scale: 0.3,
		display: "none",
		ease: Power2.easeInOut
	});
	TweenMax.fromTo(
		$(".btn-pause"),
		0.2,
		{ x: -20, opacity: 0, scale: 0.3, display: "none" },
		{ x: 0, opacity: 1, scale: 1, display: "block", ease: Power2.easeInOut }
	);
});

$(".btn-pause").click(function () {
	TweenMax.to($(".btn-pause"), 0.2, {
		x: 20,
		opacity: 0,
		display: "none",
		scale: 0.3,
		ease: Power2.easeInOut
	});
	TweenMax.fromTo(
		$(".btn-play"),
		0.2,
		{ x: -20, opacity: 0, scale: 0.3, display: "none" },
		{ x: 0, opacity: 1, display: "block", scale: 1, ease: Power2.easeInOut }
	);
}); */

// ===== HoverIn/HoverOut Flash Effect =====

/* $(".track_info").hover(
	function () {
		TweenMax.fromTo(
			$(this),
			0.5,
			{ opacity: 0.5, ease: Power2.easeInOut },
			{ opacity: 1 }
		);
	},
	function () {
		$(this).css("opacity", "1");
	}
); */

// $(".burger-wrapper, .logo-text, .back_btn").hover(
// 	function () {
// 		TweenMax.fromTo(
// 			$(this),
// 			0.5,
// 			{ opacity: 0.5, ease: Power2.easeInOut },
// 			{ opacity: 1 }
// 		);
// 	},
// 	function () {
// 		$(this).css("opacity", "1");
// 	}
// ); 

$(".btn-open-player").hover(
	function () {
		TweenMax.fromTo(
			$(this),
			0.5,
			{ opacity: 0.5, ease: Power2.easeInOut },
			{ opacity: 1 }
		);
	},
	function () {
		$(this).css("opacity", "1");
	}
);

$(".nav a").hover(
	function () {
		TweenMax.fromTo(
			$(this),
			0.5,
			{ opacity: 0.5, ease: Power2.easeInOut },
			{ opacity: 1 }
		);
	},
	function () {
		$(this).css("opacity", "1");
	}
);

// ===== Player - List Items =====
$(".list_item").click(function () {
	$(".list_item").removeClass("selected");
	$(this).addClass("selected");
});

// ===== Main Play Button - Hover =====

$(".text-wrap .text").hover(
	function () {
		TweenMax.to($(".main-btn_wrapper"), 0.5, {
			opacity: 1,
			display: "block",
			position: "absolute",
			scale: 1,
			ease: Elastic.easeOut.config(1, 0.75)
		}),
			TweenMax.to($(".line"), 0.5, {
				css: { scaleY: 0.6, transformOrigin: "center center" },
				ease: Expo.easeOut
			});
	},

	function () {
		TweenMax.to($(".main-btn_wrapper"), 0.5, {
			opacity: 0,
			display: "none",
			scale: 0,
			ease: Elastic.easeOut.config(1, 0.75)
		}),
			TweenMax.to($(".line"), 0.5, {
				css: { scaleY: 1, transformOrigin: "center center" },
				ease: Expo.easeOut
			});
	}
);


// ===== Home Page to Curation Page Transition  =====
// ===== Main Play Button Activate =====

/* $(".text-wrap .text").click(function () {
	var homeToMain = new TimelineMax({});

	// Hide
	$(".logo-text").css("display", "none"),
		homeToMain.to(
			$(".line, .text-wrap"),
			0.5,
			{ display: "none", opacity: 0, y: -20, ease: Power2.easeInOut },
			0
		),
		// Background down
		homeToMain.to(
			$(".wave-container"),
			1,
			{ yPercent: 30, ease: Power2.easeInOut },
			0
		),
		// Show
		$("#curator").css("display", "block"),
		homeToMain.fromTo(
			$(".back_btn"),
			0.8,
			{ x: 15 },
			{ display: "flex", opacity: 1, x: 0, ease: Power2.easeInOut },
			1
		),
		homeToMain.fromTo(
			$(".curator_title_wrapper"),
			0.8,
			{ opacity: 0, x: 30 },
			{ opacity: 1, x: 0, ease: Power2.easeInOut },
			1
		),
		homeToMain.fromTo(
			$(".curator_list"),
			0.8,
			{ opacity: 0, display: "none", x: 30 },
			{ opacity: 1, x: 0, display: "block", ease: Power2.easeInOut },
			1.2
		);
}); */

// ===== Curation Page to Playlist Page Transition  =====
// ===== Back Button Activate =====

/* $(".back_btn").click(function () {
	// ===== From Playlist(3) to Main(2)
	if ($("#curator").css("display") == "none") {
		var playlistToMain = new TimelineMax({});

		// Hide
		playlistToMain.fromTo(
			$("#curator"),
			0.8,
			{ display: "none", opacity: 0, scale: 1.1 },
			{ display: "block", opacity: 1, scale: 1, ease: Power2.easeInOut },
			0
		);
	}

	// From Main(2) to Home(1)
	else {
		var mainToHome = new TimelineMax({});
		// Hide
		mainToHome.fromTo(
			$(".curator_title_wrapper"),
			0.5,
			{ opacity: 1, x: 0 },
			{ opacity: 0, x: 30, ease: Power2.easeInOut },
			0.2
		),
			mainToHome.fromTo(
				$(".curator_list"),
				0.5,
				{ opacity: 1, display: "block", x: 0 },
				{ opacity: 0, x: 30, display: "none", ease: Power2.easeInOut },
				0.5
			),
			mainToHome.to(
				$(".back_btn"),
				0.5,
				{ display: "none", opacity: 0, x: 15, ease: Power2.easeInOut },
				0.5
			),
			mainToHome.to(
				$("#curator"),
				0,
				{ display: "none", ease: Power2.easeInOut },
				1
			),
			// Background Up
			mainToHome.to(
				$(".wave-container"),
				1,
				{ yPercent: 0, ease: Power2.easeInOut },
				1
			),
			// 	Show
			mainToHome.to(
				$(".text-wrap"),
				0.5,
				{ display: "flex", opacity: 1, y: 0, ease: Power2.easeInOut },
				1.2
			),
			mainToHome.to(
				$(".logo-text, .line"),
				0.5,
				{ display: "block", opacity: 1, y: 0, ease: Power2.easeInOut },
				1.2
			),
			// 	Force to redraw by using y translate
			mainToHome.fromTo(
				$(".text-wrap .text"),
				0.1,
				{ y: 0.1, position: "absolute" },
				{ y: 0, position: "relative", ease: Power2.easeInOut },
				1.3
			);
		// $('.text-wrap .text').css('position', 'relative');
	}
}); */

// ===== Audio Progress Bar =====

var file_z =
	"https://drive.google.com/uc?export=download&id=1fGF5DFOgoI5znFYekojEn910lvwobJ8x";
var player = new AudioPlayer(file_z);
// player.init();

function AudioPlayer(file_src) {
	self = this;
	this.audioPlayer = new Audio(file_src);
	//   this.progress_bar = document.querySelector("#progress_bar");
	//   this.progress;
	//   this.bar, this.vAudioSrc, this.analyser, this.frequencyData, this.cmc;
	//   (this.barc = 64), this.AnimatedEffects;
	//   this.context;
	//   this.file = document.querySelector("input[type=file]");
	//   this.duration;
	//   this.currentTime;
	//   this.play_btn = document.querySelector("#play");

	this.file.addEventListener("change", function () {
		// var reader = new FileReader();
		// reader.onload = function (e) {
		//   self.audioPlayer.src = this.result;
		//   self.setmeta();
		//   //self.showVisual();
		// };
		// reader.readAsDataURL(this.files[0]);
	});
	//   this.progress_bar.addEventListener("click", function (e) {
	//     var progress_bar = e.offsetX;
	//     var barWidth = e.target.offsetWidth;
	//     var audio = self.audioPlayer.duration;
	//     self.progress = (progress_bar / barWidth) * 100;
	//     document.querySelector("#progress").style.width = progress + "%";
	//     self.audioPlayer.currentTime = (self.progress * audio) / 100;
	//   });
	//   this.play_btn.addEventListener("click", function (e) {
	//     if (self.audioPlayer.paused) {
	//       this.classList.remove("play");
	//       this.classList.add("pause");
	//       self.audioPlayer.play();
	//       //self.showVisual();
	//     } else {
	//       this.classList.remove("pause");
	//       this.classList.add("play");
	//       self.audioPlayer.pause();
	//     }
	//   });
	//   this.audioPlayer.ontimeupdate = function (e) {
	//     this.progress();
	//   };
	//   this.audioPlayer.onended = function () {
	//     this.audioPlayer.play();
	//     //self.showVisual();
	//     $("#play").removeClass("pause").addClass("play");
	//   };
	//   this.draw = function () {
	//     self.AnimatedEffects = requestAnimationFrame(self.draw);
	//     var ex = 0;
	//     self.analyser.getByteFrequencyData(self.frequencyData);
	//     self.bars.each(function (i, b) {
	//       if (self.frequencyData[i] <= 100) {
	//         $("#canvas").css({
	//           "box-shadow": "0px 0px " + self.frequencyData[i] + "px #FFFB00"
	//         });
	//       }

	//       if (self.frequencyData[i] > 100 && self.frequencyData[i] <= 200) {
	//         $("#canvas").css({
	//           "box-shadow": "0px 0px " + self.ffrequencyData[i] + "px #FFA100"
	//         });
	//       }

	//       if (self.frequencyData[i] > 200) {
	//         $("#canvas").css({
	//           "box-shadow": "0px 0px " + self.frequencyData[i] + "px #FF2B00"
	//         });
	//       }
	//       b.style.height = self.frequencyData[i] * (1 + i / 32) + "px";

	//       $(b).attr("data-id", i);
	//     });
	//   };
	//   this.showVisual = function () {
	//     if (self.cmc) {
	//       self.connectors();
	//       self.draw();
	//     }
	//   };
	//   this.connectors = function () {
	//     self.analyser.fftSize = self.barc; //Math.floor(window.innerWidth);
	//     //self.vAudioSrc.connect(self.analyser); //connects out audio and analyser
	//     self.frequencyData = new Uint8Array(self.analyser.frequencyBinCount);
	//     var barS = 100 / self.analyser.frequencyBinCount;

	//     $("#canvas").html("");
	//     var div = $("#canvas");
	//     for (var i = 0; i < self.analyser.frequencyBinCount; i++) {
	//       $("<div class='bar1' />")
	//         .css("left", i * barS + "%")
	//         .appendTo(div);
	//     }

	//     self.bars = $("#canvas > div.bar1");
	//     self.vAudioSrc.connect(self.analyser);
	//     self.analyser.connect(self.context.destination);
	//   };
	//   this.move = function () {};
	//   this.setUpVisual = function () {
	//     if (
	//       window.AudioContext ||
	//       window.webkitAudioContext ||
	//       window.oAudioContext ||
	//       window.msAudioContext ||
	//       window.mozAudioContext
	//     ) {
	//       $("#canvas").show();
	//       self.cmc = true;
	//       self.context =
	//         new window.AudioContext() ||
	//         new window.webkitAudioContext() ||
	//         new window.oAudioContext() ||
	//         new window.msAudioContext() ||
	//         new window.mozAudioContext();

	//       self.vAudioSrc = self.context.createMediaElementSource(self.audioPlayer); //creates audio  node for our analyser
	//       self.analyser = self.context.createAnalyser(); //create our analyser
	//       self.analyser.smoothingTimeConstant = 0.5;
	//     } else {
	//       self.cmc = false;
	//       $("#canvas").hide();
	//     }
	//   };
	//   this.setProgress = function () {
	//     var audio = self.audioPlayer.duration;
	//     var cur = self.audioPlayer.currentTime;
	//     progress = (cur / audio) * 100;
	//     document.querySelector("#track_time .seek").innerHTML = (cur / 60).toFixed(
	//       2
	//     );
	//     document.querySelector("#progress").style.width = progress + "%";
	//   };
	//   this.audioPlayer.onended = function () {
	//     self.audioPlayer.play();
	//   };
	//   this.audioPlayer.ontimeupdate = function () {
	//     self.setProgress();
	//   };
	//   this.setmeta = function () {
	//     self.audioPlayer.addEventListener("canplaythrough", function () {
	//       self.audioPlayer.play();

	//       document.querySelector("#track_time .total").innerHTML = (
	//         self.audioPlayer.duration / 60
	//       ).toFixed(2);
	//     });
	//   };
	//   this.init = function () {
	//     //self.setUpVisual();
	//     self.setmeta();
	//   };
}
