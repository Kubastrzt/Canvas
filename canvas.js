//Funkcje bazowe

function rotate(velocity, angle) {
    const rotatedVelocities = {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };

    return rotatedVelocities;
}

function resolveCollision(particle, otherParticle) {
    const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
    const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

    const xDist = otherParticle.x - particle.x;
    const yDist = otherParticle.y - particle.y;

    // Prevent accidental overlap of particles
    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

        // Grab angle between the two colliding particles
        const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);

        // Store mass in var for better readability in collision equation
        const m1 = particle.mass;
        const m2 = otherParticle.mass;

        // Velocity before equation
        const u1 = rotate(particle.velocity, angle);
        const u2 = rotate(otherParticle.velocity, angle);

        // Velocity after 1d collision equation
        const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
        const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };

        // Final velocity after rotating axis back to original location
        const vFinal1 = rotate(v1, -angle);
        const vFinal2 = rotate(v2, -angle);

        // Swap particle velocities for realistic bounce effect
        particle.velocity.x = vFinal1.x;
        particle.velocity.y = vFinal1.y;

        otherParticle.velocity.x = vFinal2.x;
        otherParticle.velocity.y = vFinal2.y;
    }
}

function randomINT(min,max){
    return Math.floor(Math.random()* (max - min + 1)+ min)
}
function distance(x1,y1,x2,y2){
    const xDist=  x2-x1
    const yDist=  y2-y1
    return Math.sqrt(Math.pow(xDist,2)+ Math.pow(yDist,2))
}
var colorPallette= ['#45214A','#323050','#21445B','#1A6566','#5D8A66']
var colorPallette2= ['#403747','#AF6EE0','#B399C7','#280047','#887597']
var colorPallette3= ['#FF4858','#1B7F79','#00CCC0','#747F7F','#72F2EB']

function randomColorPicker(colorArray){
    return colorArray[Math.floor(Math.random()*colorArray.length)]
}
var mouse = {
    x: 0,
    y: 0
}




//Connecting circles

var canvas = document.querySelector('#canv1')   //Wybranie kanwy operacyjnej
canvas.width=window.innerWidth/2                //Rozmiar obszaru roboczego (szerokość)
canvas.height=window.innerHeight/2              //Rozmiar obszaru roboczego (wysokość)
var context = canvas.getContext('2d')           //Ustawienie kontekstu dla zmiennej

var maxRadius = 40                              //Maksymalny promień

function Circle(x,y,dx,dy,radius){              //Tworzenie obiektu okrąg
    this.x = x                                  //Wartość x - położenie obiektu na osi X
    this.y = y                                  //Wartość y - położenie obiektu na osi Y
    this.radius = radius                        //Ustawienie promienia
    this.minRadius= radius                      //Ustawienie minimalnej promienia (Wymagane przy animacji powiększania i zmniejszania) (Minimalna to ta którą pierwotnie ona otrzymuje)
    this.dx = dx                                //Prędkość przesuwania obiektu po osi X
    this.dy = dy                                //Prędkość przesuwania obiektu po osi Y

    var colors= ['#10454F','#506266','#818274','#A3AB78','#BDE038'] //Ustalenie palety barw
    var number= Math.round((Math.random()*(colors.length-0)+0))     //Losowanie numeru (dla palety barw)

    this.draw = function(){                                         //Funkcja rysująca okrąg        
        context.beginPath()                                         //Rozpoczęcie ścieżki (obowiązkowe!)
        context.arc(this.x,this.y,this.radius,0, Math.PI*2, false)  //Przypisanie wartości dla zmiennycyh orkęgu
        context.stroke()                                            //Atrybut rysowania samej obręczy
        context.lineWidth=5                                         //Grubość obręczy
        context.strokeStyle= `${colors[number]}`                    //Kolor obręczy
    }

    this.update= function(){                                                //Funkcja odświeżająca wynik na ekranie (porusza obiekty poprzez dodawanie ich wartości prędkości do pozycji X) jest ona zapętlona
        if(this.x+this.radius>canvas.width || this.x-this.radius<0){        //Warunek zapobiegający wyjście kół poza obszar w osi X
            this.dx=-this.dx                                                //Jeśli warunek się spełni odwracamy prędkość obiektu po to aby zmienił kierunek poruszania się
        }
        if(this.y+this.radius>canvas.height || this.y-this.radius<0){       //Warunek zapobiegający wyjście kół poza obszar w osi Y
            this.dy=-this.dy                                                //Jeśli warunek się spełni odwracamy prędkość obiektu po to aby zmienił kierunek poruszania się
        }
        this.x+=this.dx                                                     //Jeżeli nic się nie dzieje dodajemy prędkość do pozycji X i nie zmieniamy ich kierunku
        this.y+=this.dy                                                     //Jeżeli nic się nie dzieje dodajemy prędkość do pozycji X i nie zmieniamy ich kierunku

        //Interakcja
        
        if(mouse.x-this.x<50 && mouse.x-this.x>-50 && mouse.y-this.y<50 && mouse.y-this.y>-50 ) //Warunek sprawdzajacy czy w pobliżu koła (w odległości 50px) znajduje się myszka
        {
            if(this.radius<maxRadius){                                                          //W przypadku spełnienia powyższego warunku sprawdzamy czy obecny promień jest mniejszy od maxymalnego wyżej przypisanego
               this.radius+=5                                                                   //Jeśli powyższy warunek jest spełniony to powiększamy promień o 5px z każdym odświeżeniem wyniku, dopóki myszka jest w pobliżu obiektu, do 40px
            }

        }
        else if(this.radius>this.minRadius){                                                    //Jeżeli myszka nie znajduje się w odległośći 50px a promień jest większy niż jej minimalny promień to go pomniejszamy do minimalnego czyli tego pierwotnego
            this.radius-=1
        }

        
        this.draw()                                       //Uruchomienie funkcji draw (zwykłe uproszczenie kodu aby nie pisać dwókrotnie wywołania metod)
    }
}


var circleArray=[]                                          //Tworzenie tablicy obiektów

function init(){                                            //Funkcja odpowiadająca za nadanie wartości obiektom (kółkom)
    circleArray=[]                                          //Ustawienie tablicy na pustą aby obiekty nowe obiekty sie nie dodawały podczas odświeżania (z każdym odświeżeniem do poprzedniej tablicy dodawalibyśmy kolejną i ilość obiektów rosłaby w nieskończoność)
    for(var i =0; i<60; i++){                               //Pętla tworząca 60 obiektów
        var radius = Math.random()*30+1                     //Ustalenie losowej wielkości promienia
        var x= randomINT(radius*2,canvas.width-radius*2)    //Ustalenie losowej pozycji na osi X (niemniejszej niż 2 promienie oraz niewiększej niż szerokość ekranu pomniejszona o 2 promienie aby zapobiec tworzenia obiektu połowicznie poza obszarem dedykowanym)
        var y= randomINT(radius*2,canvas.height-radius*2)   //Ustalenie losowej pozycji na osi Y (niemniejszej niż 2 promienie oraz niewiększej niż wysokość ekranu pomniejszona o 2 promienie aby zapobiec tworzenia obiektu połowicznie poza obszarem dedykowanym)
        var dx= Math.random() * 3                           //Ustalenie losowej prędkości w osi X 
        var dy= Math.random() * 3                           //Ustalenie losowej prędkości w osi Y
        
        circleArray.push(new Circle(x,y,dx,dy,radius))      //Wrzucenie obiektu z powyższymi wartościami do tablicy
    }
}
function connection(){                                                              //Funkcja odpowiadająca za linie między obiektami
    for(let circle1=0; circle1<circleArray.length; circle1++){                      //Pętla przechodząca po wszystkich obiektach umiejscowionych w tablicy
        for(let circle2=circle1; circle2<circleArray.length;circle2++){             //Druga pętla przechodząca po tych samych obiektach (Tworzenie iloczynu kartezjańskiego każdy element z każdym)
            let distance= Math.sqrt(Math.pow((circleArray[circle1].x-circleArray[circle2].x),2)+ Math.pow((circleArray[circle1].y-circleArray[circle2].y),2))   //Obliczanie dystansu w px między obiektem pierwszym a drugim (w pętli będzie obliczać dystans między pierwszym a drugim, pierwszym a trzecim, pierwszym a czwartym i tak do 60 bo tyle ustawiono tych obiektów) 
            if(distance<100){                                                       //Sprawdzenie czy dystans zachowany między 'pierwszym' a 'drugim' obiektem jest mniejszy niż 300 pixeli
                let opacityValue=1-(distance/100)                                   //Jeśli jest mniejszy to przezroczystoć lini będzie zmniejszana o odległość/100 czyli np odległość mamy 80px to 1-80/100 = 0.2 czyli linia jest ledwo widzialna 
                context.strokeStyle='rgba( 189, 224, 56,' + opacityValue + ')';     //Ustawienie koloru lini i wstawienie do przezroczystoci obliczoną wyżej jej wartość 
                context.lineWidth=2                                                 //Ustawienie grubości lini
				context.beginPath();                                                //Rozpoczęcie rysowania ścieżki (obowiązkowe!)
				context.moveTo(circleArray[circle1].x, circleArray[circle1].y);     //Ustawienie początkowej pozycji X oraz Y lini  (metoda moveTo przyjmuje dwa argumenty X oraz Y)
				context.lineTo(circleArray[circle2].x, circleArray[circle2].y);     //Ustawienie końcowej pozycji X oraz Y lini  (metoda lineTo przyjmuje dwa argumenty X oraz Y)
				context.stroke();                                                   //Narysowanie lini
            }
        }
    }
}

function animate(){                                         //Wymagana funkcja która na bieżąco zapętla powyższe akcje tak aby w czasie rzeczywistym koło 'zmieniało pozycje' (w rzeczywistości jest tworzone nowe takie samo a stare zostaje wymazane) lub linia podążała za pozycjami kół
    requestAnimationFrame(animate)                          //Funkcja która zapętla funkcje podaną w argumencie
        context.clearRect(0,0,innerWidth,innerHeight)       //Czyszczenie całego obszaru roboczego (w celu uniknięcia nakładania się na siebie obiektów)
    for(var i = 0; i<circleArray.length; i++){              //Pętla przechodząca po wszystkich elementach(naszych obiektach w tym przypadku) tablicy 
        circleArray[i].update()                             //Dla każdego elementu tablicy przypisujemy metode update która sprawia że wszystkie obiekty są rysowane oraz poruszają się nie wychodząc poza obszar oraz mają dodaną interakcje w postaci powiększenia promienia po najechaniu w ich obszar
    }         
    connection()                                             //Wywołanie funkcji która odpowiada za rysowanie lini od obiektu A do obiektu B poza pętlą gdyż wtedy obiekt A posiadałby 60 połączeń z obiektem B
}



window.addEventListener('mousemove', (event)=>{             //Zdarzenie ustawione na całą strone przekazujące argument event wywoływane wjechaniem myszki oraz jej poruszaniem na obszarze strony
    mouse.x=event.x                                         //Przypisanie pozycji X myszy za pomocą pozyskania pozycji X eventu
    mouse.y=event.y                                         //Przypisanie pozycji Y myszy za pomocą pozyskania pozycji Y eventu
})
window.addEventListener('mouseout', ()=>{                   //Zdarzenie ustawione na całą strone wywoływane wyjechaniem myszki z obszaru strony
   // mouse.x=undefined                                       //Ustawienie niezdefiniowanej pozycji X dla X myszy
   // mouse.y=undefined                                       //Ustawienie niezdefiniowanej pozycji Y dla Y myszy
})
window.addEventListener('resize', ()=>{                     //Zdarzenie ustawione na całą strone wywoływane zmniejszeniem jej rozmiaru 
    canvas.width=window.innerWidth/2                        //Dopasowanie szerokości obszaru roboczego do szerokości strony 
    canvas.height=window.innerHeight/2                      //Dopasowanie wysokości obszaru roboczego do wysokości strony 
    canvas2.width=window.innerWidth/2
    canvas2.height=window.innerHeight/2
    canvas3.width=window.innerWidth/2
    canvas3.height=window.innerHeight/2
    canvas4.width=window.innerWidth/2
    canvas4.height=window.innerHeight/2
    init()                                                  //Wywołanie ponownie funkcji odpowiadającej za nadawanie wartości kół w celu odświeżenia ich pozycji
    createParticle()
    createCircular()
    item()
})

init()                                                      //Wywołanie funkcji odpowiadającej za nadawanie wartości kół wraz z otwarciem strony
animate()                                                   //Wywołanie funkcji odpowiadającej za zapętlenie wszystkich akcji


//Particle/Collision

var canvas2 = document.querySelector('#canv2')
canvas2.width=window.innerWidth/2
canvas2.height=window.innerHeight/2
var ctx = canvas2.getContext('2d')

function Particle(x,y,radius,color){
    this.x = x
    this.y = y
    this.velocity = {
        x: randomINT(-0.5, 4),
        y: randomINT(-0.5, 4)
    }
    this.radius = radius
    this.color = color
    this.mass = 1

    this.draw = ()=>{
        ctx.beginPath()
        ctx.arc(this.x,this.y,this.radius,Math.PI*2,false)
        ctx.fill()
        ctx.fillStyle = this.color
    }

    this.update = particlesArray =>{
        this.draw()
        for(let i=0;i<particlesArray.length;i++){
            if(this===particlesArray[i]) continue
            if(distance(this.x,this.y,particlesArray[i].x,particlesArray[i].y)-this.radius*2<0){
                resolveCollision(this, particlesArray[i])
            }
        }
        if(this.x+this.radius>canvas2.width || this.x-this.radius<0 )
        {
            this.velocity.x = -this.velocity.x
        }
        if(this.y+this.radius>canvas2.height || this.y-this.radius<0 )
        {
            this.velocity.y = -this.velocity.y
        }
        
        this.x+= this.velocity.x
        this.y+= this.velocity.y
    }
}

let particlesArray

function createParticle(){
    particlesArray=[]
    for(var i=0; i<20;i++){
        const radius=15
        var x=randomINT(radius,canvas2.width-radius)
        var y=randomINT(radius,canvas2.height-radius)
        const color=randomColorPicker(colorPallette)

        if(i!==0){
            for(var j=0;j<particlesArray.length;j++){
                if(distance(x,y,particlesArray[j].x,particlesArray[j].y)-radius*2<0){
                    x=randomINT(radius*2,canvas2.width-radius*2)
                    y=randomINT(radius*2,canvas2.height-radius*2)
                    j=-1
                }
            }
        }

        particlesArray.push(new Particle(x,y,radius,color))
    }
}

function render(){
    requestAnimationFrame(render)
        ctx.clearRect(0,0,innerWidth,innerHeight)

    for(var i=0;i<particlesArray.length;i++)
    {
        particlesArray[i].update(particlesArray)
    }
}

createParticle()
render()

//Spirala

var canvas3 = document.querySelector('#canv3')
canvas3.width=window.innerWidth/2
canvas3.height=window.innerHeight/2
var c = canvas3.getContext('2d')


function Circular(x,y,radius,color,velocity){
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.radians = Math.random() * Math.PI * 2
    this.velocity= velocity
    this.distance= randomINT(50,400)
    this.lastMouse={
        x: x,
        y: y
    }
    this.update = ()=>{
        const lastPoint={
            x:this.x,
            y:this.y
        }
        this.radians+=this.velocity
        this.lastMouse.x += (mouse.x - this.lastMouse.x)* 0.05
        this.lastMouse.y += (mouse.y - this.lastMouse.y)* 0.05

        this.x = x+Math.cos(this.radians)*this.distance
        this.y = y+Math.sin(this.radians)*this.distance

        this.draw(lastPoint)
    }
    this.draw = lastPoint =>{
        c.beginPath()
        c.arc(this.x, this.y, this.radius, Math.PI*2, false)
        c.fill()
        c.fillStyle = this.color
    }
}

let circularParticles
var velocity
function createCircular(){
    circularParticles = []
    for(var i=0;i<150;i++){
        const radius = randomINT(3, 10)
        velocity= Math.random()*(0.07-0.01)+0.01
        circularParticles.push(new Circular(canvas3.width/2,canvas3.height/2,radius,randomColorPicker(colorPallette2),velocity))
    }
}
function pushSpeed(){
    for(var i=0;i<circularParticles.length;i++){
        circularParticles[i].velocity=-circularParticles[i].velocity
    }
}
canvas3.addEventListener('click', ()=>{
    pushSpeed()
})


function display(){
    
    requestAnimationFrame(display)
        c.clearRect(0,0,innerWidth,innerHeight)
    for(let i=0;i<circularParticles.length;i++)
    {
        circularParticles[i].update()
    }
}

createCircular()
display()

//Gravitation 

var canvas4=document.querySelector('#canv4')
canvas4.width=window.innerWidth/2
canvas4.height=window.innerHeight/2
var ct = canvas4.getContext('2d')


var gravity=1
var pull = 0.9
function Ball(x,y,dx,dy,radius,color){
    this.x=x
    this.y=y
    this.dx=dx
    this.dy=dy
    this.radius=radius
    this.color=color

    this.draw = ()=>{
        ct.beginPath()
        ct.arc(this.x,this.y,this.radius,Math.PI*2,false)
        ct.fill()
        ct.fillStyle=this.color
    }
    this.update = ()=>{
        if(this.y+this.radius + this.dy > canvas4.height || this.x+this.radius>canvas4.width || this.x-this.radius<0){
            this.dy=-this.dy*pull
            this.dx=-this.dx
        }
        else{
           this.dy+=gravity
        }
        this.y+=this.dy
        this.x+=this.dx

        this.draw()
    }
}

var itemsArray
function item(){
    itemsArray =[]
    for(var i=0;i<100;i++){
        var radius = randomINT(7,20)
        var x=randomINT(radius,canvas4.width-radius)
        var y=randomINT(0,canvas4.height-200)
        var dx= randomINT(-5,5)
        var dy= randomINT(-5,5)
        var color = randomColorPicker(colorPallette3)

        itemsArray.push(new Ball(x,y,dx,dy,radius,color))
    }
}

canvas4.addEventListener('click', ()=>{
    item()
})

function showBall(){
    requestAnimationFrame(showBall)
        ct.clearRect(0,0,innerWidth,innerHeight)
    for(var i=0;i<itemsArray.length;i++)
    {
        itemsArray[i].update()
    }
}

item()
showBall()