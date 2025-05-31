import Player1 from "./Player1.js";
import decoracionLVL1 from "./decoracionLVL1.js";
export default class Escena1 extends Phaser.Scene{



constructor(){ //inicializando 
super("Nivel_1");
}

preload(){ //metodo que hara que se carguen recursos antes de empezar el juego
   
    this.load.atlas("pj1", "sprites/assets/PJ1.png", "sprites/assets/PJ1.json"); //con esto cargamos el json y la imagen con el sprite del personaje.
    this.load.image("patron", "sprites/assets/patrones.png"); //aqui cargamos la imagen de los patrones en memoria.
    this.load.tilemapTiledJSON("mapa_lvl1", "sprites/assets/mapa.json"); //exactamente lo mismo pero con el json. usamos patron y mapa como keys para emplear y aplicar cuando nos apetezca.
    this.load.spritesheet("objetos", "sprites/assets/objetos.png", {frameWidth: 32, frameHeight: 32}); //cuando usamos .spritesheet, le debemos decir a phaser la altura y anchura de nuestros sprites.
    this.load.atlas("decoracion", "sprites/assets/decoracion.png", "sprites/assets/decoracion.json"); //cargamos el atlas con la decoracion. De momento solo tiene el cofre que dara armas. Se puedes añadir mas sobre la marcha. De ahi el nombre y el atlas.
}

create(){//instancia todo lo que se ve en pantalla

   

    //Se crea el personaje-------------------------------------------------------
    this.mapa   = this.make.tilemap({ key: 'mapa_lvl1' }); //aqui implementamos el json que fue cargado en memoria y lo ponemos en la constante map. Ademas, convertimos el json en un objeto tilemap. Lo que nos permite configurar cosas como el tamaño del mapa.
    const setPatron = this.mapa.addTilesetImage('patrones', 'patron', 32, 32, 0, 0); //primero le indicamos el nombre del json y luego la key, indicando los pixeles que debe de recortar de la imagen. Cada 32x32.
   //ahora dibujamos el mapa
    this.capa1  = this.mapa.createLayer('Capa de patrones 1', setPatron, 0, 0); // 
    //ahora se trabajaran las colisiones
    this.capa1.setCollisionByProperty({colision: true}); // el nombre debe ser igual al de la propiedad de tiled. En este caso la llamamos colision, por ende aqui debe llamarse igual.
    //y ahora se lo tenemos que decir al motor de fisicas de phaser
    this.matter.world.convertTilemapLayer(this.capa1);



 //llamamos al metodo ponerDecoracion para que ponga los elementos en el mapa. Se debe poner despues de que el mapa este dibujado, si no, no se vera.
    

    this.cofre = new decoracionLVL1({
        scene: this,
        x: 50,
        y:50,
        texture: "decoracion",
        frame: "Sprite-0003.",
    }).setRectangle(28, 22).setOrigin(0.5, 0.6).setFixedRotation(this.cofre).setFrictionAir(1);
        
      
         //lo mismo que con el personaje, fijamos su eje de rotacion y le añadimos friccion para que se sienta pesado y no se deslice.
   




    //creamos el personaje--------------------------
    this.personaje = new Player1({
    scene:this, 
    x: 100, 
    y: 100,
    texture: "pj1", 
    frame: "PJ1 0.aseprite"
    });
  
   this.personaje = new Player1({
    scene:this, 
    x: 100, 
    y: 100,
    texture: "pj1", 
    frame: "PJ1 0.aseprite"
    });



    

     //creo el movimiento del jugador con las teclas wasd y las flechas.
     //NOTA: NO SE PUEDE METER EL MOVIMIENTO DEL JUGADOR EN PLAYER1 PK ESA CLASE SOLO ES APTA PARA FISICAS Y SPRITES, NO PARA TECLADOS. POR ESO NO ME FUNCIONABA. TONTO QUE ERES TONTO.
    this.personaje.flechasTeclado = this.input.keyboard.createCursorKeys();
    //phaser configuta de forma automatica las flechas del teclado pero no wasd, por lo que debemos configurarlo nosotros.
    this.personaje.wasd = this.input.keyboard.addKeys({
        derecha: Phaser.Input.Keyboard.KeyCodes.D,
        izquierda: Phaser.Input.Keyboard.KeyCodes.A,
        arriba: Phaser.Input.Keyboard.KeyCodes.W,
        abajo: Phaser.Input.Keyboard.KeyCodes.S,
        atacar: Phaser.Input.Keyboard.KeyCodes.SPACE, //aparte, añadimos espacio para que pueda atacar.
    })

    //instancio el create de player1.
    this.personaje.create();



   
}




   

update(){ 
    //instancio el update de player1.

    this.personaje.update();
}
}
