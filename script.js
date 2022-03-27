window.addEventListener("load", main, false);
function main () {
	var ctx = c.getContext('2d');
	var w = c.width;
	var h = c.height;
	var FPS = 60;
	var timeSpeed = document.getElementById("timeSpeed").value;
	var scale = document.getElementById("scale").value;
	var sputnik = document.getElementById("sputnik").checked;
	var planet = document.getElementById("planet").checked;
	var oldScale = scale;

	// космический объект
	function SpaceObject (name,breed,x, y, r, vx, vy, m, color = "black"){
		var that = this;
		this.name = name;
		this.breed = breed;
		this.x = w/2 + x/scale;
		this.y = h/2 + y/scale;
		this.r = r/scale;
		this.vx = vx/scale;
		this.vy = vy/scale;
		this.m = m;
		this.color = color;
		this.draw = function(ctx){
			ctx.beginPath ();
			ctx.fillStyle = this.color;
			ctx.arc( that.x, that.y, that.r, 0, 2*Math.PI);
			if(this.breed == "planet" && planet){
				ctx.textAlign = "center";
				ctx.strokeStyle = "#ffffff";
				ctx.strokeText(this.name + " ("+this.breed+")", this.x, this.y-this.r-20);
			}
			else if(this.breed == "sputnik" && sputnik){
				ctx.textAlign = "center";
				ctx.strokeStyle = "#ffffff";
				ctx.strokeText(this.name + " ("+this.breed+")", this.x, this.y-this.r-20);
			}
			ctx.fill();
		}
	}

	function F(m1,m2,d){
		const G = 6.67*10**(-11);
		return (G*m1*m2)/(d**2);
	}

	function distance(a,b){
		return Math.sqrt( (a.x - b.x)**2 + (a.y-b.y)**2 )
	}

	function cos(a,b){
		return (b.x - a.x)/distance(a,b);
	}

	function sin(a,b){
		return (b.y - a.y)/distance(a,b);
	}

	function ChangeScale(oldScale, scale){
		var X,Y;
		for(var i = 0; i < objects.length; i++){
			var x = objects[i].x - w/2;
			var y = objects[i].y - h/2;
			X = x*oldScale/scale;
			Y = y*oldScale/scale;
			objects[i].x = w/2 + X;
			objects[i].y = h/2 + Y;
			objects[i].r = objects[i].r*oldScale/scale;
			objects[i].vx = objects[i].vx*oldScale/scale;
			objects[i].vy = objects[i].vy*oldScale/scale;
			
 		}
	}





	var a = new SpaceObject("Земля","planet",0, 0, 6371000, 0, 0, 6*10**24, "blue");
	var b = new SpaceObject("Луна","sputnik", 384400000, 0, 1737000, 0, 1023,7.6*10**22, "white");

	var objects = [];
	objects.push(a);
	objects.push(b);

	// отрисовка всех объектов симуляции
	function draw (){
		ctx.clearRect(0, 0, w, h);
		ctx.fillStyle = "black";
		ctx.rect(0, 0, w, h);
		ctx.fill();
		for(var i = 0; i < objects.length; i++){
			objects[i].draw(ctx);
		}
	}

	// физика симуляции
	function phys() {
		for(var i = 0; i < objects.length; i++){
			for(var j = 0; j < objects.length; j++){
				if(j == i){
					continue;
				}
				var m1 = objects[i].m, m2 = objects[j].m;
				var d = distance(objects[i],objects[j])*scale;
				var f = F(m1,m2,d);
				var a = f*timeSpeed/(m1*FPS*scale);
				objects[i].vx += a*cos(objects[i],objects[j]);
				objects[i].vy += a*sin(objects[i],objects[j]);
			}
		}
		for(var i = 0; i < objects.length; i++){
			objects[i].x +=objects[i].vx*timeSpeed/FPS;
			objects[i].y +=objects[i].vy*timeSpeed/FPS;
		}
	}

	// реагирование на изменение характеристик
	function process(){
		scale = document.getElementById("scale").value;
		document.getElementById("scaleValue").innerHTML = "Scale: " + scale;
		if(oldScale != scale){
			ChangeScale(oldScale,scale);
			oldScale = scale;
		}
		timeSpeed = document.getElementById("timeSpeed").value;
		document.getElementById("timeSpeedValue").innerHTML = "Time speed: " + timeSpeed;
		sputnik = document.getElementById("sputnik").checked;
		planet = document.getElementById("planet").checked;
	}

	// управление камерой с помощью клавиатуры
	function manage(){
		document.addEventListener('keydown', function(event) {
			if (event.code == 'KeyW') {
			  for(var i = 0; i<objects.length; i++){
				objects[i].y -= 50000/scale;
			  }
			}
			else if (event.code == 'KeyA') {
				for(var i = 0; i<objects.length; i++){
				  objects[i].x -= 50000/scale;
				}
			}
			else if (event.code == 'KeyD') {
			  for(var i = 0; i<objects.length; i++){
				objects[i].x += 50000/scale;
			  }
			}
			else if (event.code == 'KeyS') {
				for(var i = 0; i<objects.length; i++){
				  objects[i].y += 50000/scale;
				}
			}
		});
	}

	

	function control () {
		phys();
		draw();
		process();
		manage();
	}

	draw();
	var program = setInterval( control, 1000/FPS);
}