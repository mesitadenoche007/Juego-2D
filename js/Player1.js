export default class Player extends Phaser.Physics.Matter.Sprite {
//creamos una clase aparte para nuestro personaje jugable, la llamaremos Player". Extendemos de la clase phaser.physics... para crear un sprite con fisicas.

spriteArmas = null; //armas

constructor(datos){
    let {scene, x, y, texture, frame} = datos;
    super(scene.matter.world, x, y, texture, frame);
    this.scene.add.existing(this); //aqui phaser dibuja el sprite seleccionado.





    //necesitamos crear un sensor para detectar colisiones. Se crea en el constructor para que se inicialice nada mas se cree el objeto, evitando errores.
    //se quiere tambien hacer mas pequeña la hitbox de nuestro personaje. Las variables se deben de llamar asi para que phaser las reconozca.
    const Body = Phaser.Physics.Matter.Matter.Body;
    const Bodies = Phaser.Physics.Matter.Matter.Bodies;

    let colisionPJ = Bodies.rectangle(this.x,this.y, 15, 24, {isSensor: false, label: "colisionPJ"});
    let sensorPJ = Bodies.rectangle(this.x, this.y, 42, 32, {isSensor: true, label: "sensorPJ"});

    const cuerpoCompleto = Body.create ({

        parts: [colisionPJ, sensorPJ],
        frictionAir: 0.35 //añadimos friccion para que el personaje no se sienta tan liviano y arcade. Que se sienta un cuerpo fisico con un peso.
    });

    this.setExistingBody(cuerpoCompleto);
    //lo que pasa es que los personajes al no ser cuerpos estaticos giran al entrar en contacto con otra entidad. Para arreglarlo, se debe isar FixedRotation para bloquear su eje.
    this.setFixedRotation(cuerpoCompleto);
    this.setOrigin(0.5, 0.6); //el sprite no quedaba centrado, para hacerlo usamos setOrigin para darle punto de partida al sprite y asi poder quedar centrado. Es la mejor manera de hacerlo segun phaser.







    //COOLDOWN DE ARMAS, PARA MAS INFO IR AL METODO "USARARMAS".
    // Permite saber si podemos empezar un nuevo ataque
    this.siAlAtaque = true;
    
    
    
}




create(){//instancia todo lo que se ve en pantalla

//antes que nada, capturamo el puntero para usarlo despues. Esto se empleara para cambiar la direccion del sprite dependiendo de a donde apuntemos con el raton.

    this.raton = this.scene.input.activePointer; // accedemos al puntero (el raton).

        
    //CREO LA ANIMACION DEL JUGADOR TANTO DEL GIRO EN 45 GRADOS COMO LA DE CAMINAR.
    //GIRO 45 GRADOS.
    this.anims.create({
        key: "giro",
        frames: this.anims.generateFrameNames("pj1", { //crea un array de objetos para los sprites/frames.
            prefix: "PJ1 ", //se llama asi en el json.
            start: 0,
            end: 2,
            suffix: ".aseprite"
        }),
        frameRate: 10,
        repeat: 0 //con 0 no se repite
    });

    //GIRO 45 GRADOS DE VUELTA
    //al no querer que los frames duren los mismo, debemos crear un array de objetos para los frames afectados.
    this.anims.create({
        key: "giroDeVuelta",
        frames: [
            {key: "pj1", frame: "PJ1 1.aseprite", duration: 150},//primer array parta el segundo frame
            {key: "pj1", frame: "PJ1 0.aseprite", duration: 50}
        ],
        repeat: 0
    });
    //CAMINAR/CORRER---------------------------------------------------------------------------------------------------------------------
    this.anims.create({
        key: "caminar",
        frames: this.anims.generateFrameNames("pj1", {
            prefix: "PJ1 ",
            start: 3,
            end: 14,
            suffix: ".aseprite"
        }),
        frameRate: 10,
        repeat: -1 // al poner "-1", la aniamcion se repetira indefinidamente.
    });






    //COGED LAS ARMAAAAAAAAAS XD-------------------------------------------------------------------------------------

    //creamos el cuerpo fisico de arma.
    this.spriteArmas = new Phaser.GameObjects.Sprite(this.scene, 0, 0, "objetos", 1);
    //dibujamos el sprite en la escena.
    this.scene.add.existing(this.spriteArmas);
    this.spriteArmas.setScale(1.3);
    this.spriteArmas.setOrigin(0.15, 0.55); //desplazamos el arma para que de la sensacion de la tiene en mano.

   
}



update(){ //conectas la logica del juego
    console.log("Hola esto esta actualizandose");
    
    const velocidad = 2; //velocidad de nuestro jugador.
    const vp = new Phaser.Math.Vector2(); //usamos esta clase que nos permitira trabajar de forma mas comodas con vectores x & y.

    //indicamos que direccion toma el personaje dependiendo de lo que pulsemos.
    if(this.wasd.derecha.isDown || this.flechasTeclado.right.isDown) {
        vp.x = 1;
      
    }
    else if (this.wasd.izquierda.isDown || this.flechasTeclado.left.isDown) {
        vp.x = -1;
    }

    if(this.wasd.arriba.isDown || this.flechasTeclado.up.isDown) {
        vp.y = -1;
    }
    else if (this.wasd.abajo.isDown || this.flechasTeclado.down.isDown) {
        vp.y = 1;
    }






    //debemos crear una constante para percibir si nuestro personaje se mueve o no.
    const seMueve = vp.length() >  0; //por que el .lenght en vp? Vp es un vector con dos componentes x e y. El lenght() nos permite calcular la longitud del vector y asi determinar si a habido movimiento o no.

    if (seMueve && !this.seMueve2){
        this.play("giro");
        this.play("caminar");
        this.seMueve2 = true;        
    }
    else if (!seMueve && this.seMueve2){
        this.seMueve2 = false;
        this.play("giroDeVuelta");
    }
    //falta por explicar, concepto de la velocidad y los vectoriales.
    vp.normalize(); //se normaliza los vectores para que cuando se vaya en diagonal, no se sumen las velocidades.
    vp.scale(velocidad);
    this.setVelocity(vp.x, vp.y);





    //ARMAAAAA----------------------------------------------------------------------------------------------------------------------------------
    this.spriteArmas.setPosition(this.x, this.y); //aqui le decimos que esta posicionado en las coordenadas en las que se encuentre el objecto Player1. Es su nuevo punto de anclaje.
    this.usarArmas();



    

    //animacion en reversa para cunado el personaje gire a la izuierda y la animacion con el.    

    this.posicionRaton = this.raton.worldX;

    if (this.posicionRaton < this.x){
        this.setFlipX(true); //si retecta que el valor de x es menor que 0 (izquierda), el sprite se invertira.
    }
    else if(this.posicionRaton > this.x){
        this.setFlipX(false); // se devuelve a su estado original si no se va a la izquierda.
    }

   
}




//necesitamos crear una funcion para poder usar las armas

usarArmas(){
    //Hay dos opciones, se pueden usar las teclas para atacar o el raton. 

    //el problema que tenemos es que la animacion de golpear ocurre muy rapido. Para hacerlo mas lento usaremos lo que en js es un setTimeout. Tras x ms, se ejecutara la accion. (puede resumirse en que es un evento que crea delay)
    //para ello declaramos en el constructor de player un flag para comprobar si esta atacando o no. Se pone en el construcotr pk son propiedades del propio jugador. 
   

    this.spriteArmas.setAngle(this.rotacionArmas);

    if((this.raton.isDown || this.wasd.atacar.isDown) && this.siAlAtaque){
        this.rotacionArmas += 5; // si no ponemos el  "+=" y lo dejamos con un "=" como se muestra aquí: this.rotacionArmas = 5;. El arma cambiara instantaneamente de posicion, haciendo que el personaje agite el arme de forma antinatural.
                                //Para hacerlo mas natural, ponemos el + y asi el arma gira poco a poco, incrementando el angulo. ¿El problema? Que si dejamos pulsado el click, el arma gira por infinito.
    }
    else{
        this.rotacionArmas = 0;
    }

    //ahora haremos que cuando el arma llegue a cierto angulo, al angulo 20 por ejemplo, se resetee. Asi no rotara por infinito.

    if(this.rotacionArmas >70){
        this.rotacionArmas = 0;
        this.siAlAtaque = false;
        //el eventlistener para agregarle cooldown
        this.scene.time.delayedCall(300, () => {
            //uan vez terminado el cooldown, damos el visto bueno para que vuelva a ocurrir la animacion.
            this.siAlAtaque = true;
        } );
    }

    //tambien debemos hacer que el arma rote cuando nuestro jugador lo haga. 
    if(this.flipX){
        this.spriteArmas.setAngle(-this.rotacionArmas +200).setFlipY(true).setOrigin(0.2, 0.55); //he de decir, que inverti una hora y media solo tocando los parametros para que el querido arma gire con el personaje correctamente. jeje que divertido.
        
    }
    else {
        this.spriteArmas.setFlipY(false).setAngle(this.rotacionArmas).setOrigin(0.15, 0.55);
    }
    
    
}
}