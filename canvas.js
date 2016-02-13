	
//document.addEventListener('DOMContentLoaded', function()) {

	var canvas = document.getElementById("game");
	var context = canvas.getContext("2d");
	/*-- Listen for click event --*/
	canvas.addEventListener("mousedown", getPosition, false);

	var BugList = [];
	var FoodHorizontal = [];
	var FoodVertical = [];
	var foodImage = new Image();
	foodImage.src = "images/burger.jpg";
	var scores = 0;
	var pause = false;

	/// Response to user tapping/clicking
	function getPosition(event) {
		var x = event.offsetX;
	    var y = event.offsetY;
		//ref: http://www.w3schools.com/tags/canvas_beziercurveto.asp
		
		//normal shapes
		//context.beginPath();
		//context.moveTo(20,20);
		//context.bezierCurveTo(20,100,200,100,200,20);
		//context.stroke();

		//draw objects
		//setInterval("BugBuilder()", 1000);
		for (var i in BugList){
			var bug_x = BugList[i].horizontal_position;
			var bug_y = BugList[i].vertical_position;
			var distance = Math.sqrt(Math.pow((x - bug_x), 2) + Math.pow((y - bug_y), 2));
			if (distance < 30){
				if (BugList[i].color == "black"){
					scores = scores + 5;
				}
				if (BugList[i].color == "red"){
					scores = scores + 3;
				}
				else {
					scores = scores + 1;

				}
				BugList.splice(i, 1);

			}
		}
	}

	function GameBuilder(){
		FoodCreator();
		setInterval('BugBuilder()', 1000);
		setInterval('BugsMoving()', 1);

	}

	function BugsMoving(){

	if (pause == false){
		context.clearRect(0, 0, canvas.width, canvas.height);

		for (var key in BugList) {
			for (var i in FoodHorizontal){
				context.drawImage(foodImage, FoodHorizontal[i], FoodVertical[i], foodImage.width/6, foodImage.height/6);

				var food_x = FoodHorizontal[i];
				var food_y = FoodVertical[i];
				var bug_x = BugList[key].horizontal_position;
				var bug_y = BugList[key].vertical_position;

				if (Math.abs(food_x - bug_x) < 5 && Math.abs(food_y - bug_y) < 5){
					FoodHorizontal.splice(i, 1);
					FoodVertical.splice(i, 1);
					for (var bug in BugList){
						setTarget(BugList[bug]);
					}
				}
			}
			//context.clearRect(BugList[key].horizontal_position, BugList[key].vertical_position, 400, 400);
			if (BugList[key].vertical_position < 550){
				var speed = 0.2;
				var slope = BugList[key].slope;
				var x_speed = Math.sqrt((speed * speed)/(1 + slope * slope));
				var y_speed = x_speed * slope;
				if (BugList[key].horizontal_position < BugList[key].target_x){
					BugList[key].horizontal_position = BugList[key].horizontal_position + x_speed;
				}
				else {
					BugList[key].horizontal_position = BugList[key].horizontal_position - x_speed;
				}

				if (BugList[key].vertical_position < BugList[key].target_y){
					BugList[key].vertical_position = BugList[key].vertical_position + y_speed;
				}
				else {
					BugList[key].vertical_position = BugList[key].vertical_position - y_speed;
				}

            	//BugList[key].vertical_position = BugList[key].vertical_position + 0.2; //only change the positon of every bug
				makeBug(BugList[key].horizontal_position, BugList[key].vertical_position, BugList[key].color);
			}

			else{
				BugList.splice(key, 1);
			}
        }

    }

	}

	function FoodCreator(){
		var food_horizontal = Math.random()*350;
		var food_vertical = Math.random()*250 + 300;
		for (var i=0;i<5;i++){
			FoodHorizontal.push(food_horizontal);
	 		FoodVertical.push(food_vertical);
			food_horizontal = Math.random()*350;
			food_vertical = Math.random()*250 + 300;
		}
	}

	function BugBuilder(){
	if (pause == false){
		var horizontal_position = Math.random()*400;
		var vertical_position = 0;
		var color_probability = Math.random();
		var color;
		var speed;

        if (color_probability <= 0.3){
            color = "black";
            speed = 150;
        }
        else if (color_probability <= 0.6){
            color = "red";
            speed = 75;

        }
        else{
            color = "orange";
            speed = 60;
        }

		var Bug = new BugConstructor(horizontal_position, vertical_position, speed, color);
		setTarget(Bug);
        BugList.push(Bug);

        makeBug(horizontal_position, vertical_position, color);

    }
    
	}

	function BugConstructor(horizontal_position, vertical_position, speed, color){
		this.horizontal_position = horizontal_position;
		this.vertical_position = vertical_position;
		this.speed = speed;
		this.color = color;

	}

	function setTarget(Bug){

		var target_x;
		var target_y;
		var distance = 2000;
		for (var i in FoodHorizontal){
			var target_distance = Math.sqrt(Math.pow((Bug.horizontal_position - FoodHorizontal[i]), 2) + Math.pow((Bug.vertical_position - FoodVertical[i]), 2));
			if (target_distance <= distance){
				target_x = FoodHorizontal[i];
				target_y = FoodVertical[i];
				distance = target_distance;
			}
		}

		var slope = Math.abs((Bug.vertical_position - target_y)/(Bug.horizontal_position - target_x));
		Bug.target_x = target_x;
		Bug.target_y = target_y;
		Bug.slope = slope;
		Bug.distance = distance;		
	}

	function Pause(){
		if (pause == true){
			pause = false;
		}
		else{
			pause = true;
		}
	}
//}



	

	

	