let container = document.querySelector('#container');
// 定时器，用来检测滚动是否结束
let timer = null;
let diff = Math.abs(container.children[0].getBoundingClientRect().top - container.getBoundingClientRect().top)
// 滚动事件开始
container.addEventListener('scroll', function () {
	clearTimeout(timer);
	timer = setTimeout(function () {
		[].slice.call(container.children).forEach(function (ele, index) {
            // console.log(diff);
			if (Math.abs(ele.getBoundingClientRect().top - container.getBoundingClientRect().top) < (diff + 20)) {
				document.getElementById(ele.id.replace("contain","name")).classList.add('highlight');
                console.log("highlight added!");
			} 
            else {
				document.getElementById(ele.id.replace("contain","name")).classList.remove('highlight');
			}
		});
	}, 200);	
});