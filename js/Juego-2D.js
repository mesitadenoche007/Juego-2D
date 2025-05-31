//Lo primero que debemos hacer es configurar la ventana, es decir el juego.
//Su anchura, su altura, su fondo, etc.
//Para ello se debera crear un objeto.

import Nivel_1 from "./Escena1.js";
const config = {
    type: Phaser.AUTO,                                                           /*aqui le estamos diciendo a phaser como queremos el tipo de renderizacion.
                                                                                Si onemos "AUTO", Phaser eligira automaticamente entre WebGL o Canvas, segun el navegador. */
    width: 320,
    height: 320,
                                                                            //aqui decidimos la anchura/altura. Queremos que ocupe la pantalla.
    
    backgroundColor: 0xff99cc,
    pixelArt: true,                                                     //hace que el juego no suavice los bordes. 
    parent: 'Juego-2D',                                                 //parent es una propiedad que usamos para indicar donde queremos posicionar el cambas dentro de nuestro html. El div de index es el espacio.
    scene: [Nivel_1],
    physics: {                                                          //aqui vamos a implementar las fisicas.
        default:'matter',
        matter: {
            debug: true,                                                //funcion que genera siluetas en los sprites. Las hitboxes.Util para detectar errores.
            gravity: {y:0}                                                 //al ser un juego top-down, no necesita gravedad en vertical.
        }
    },
    scale: {                                                            //scale es una propiedad que tiene varios objetos dentro.
    mode: Phaser.Scale.FIT,                                             //hace que el canvas se ajuste a la ventana del usuario si esta cambia de tamaño
    autoCenter: Phaser.Scale.CENTER_BOTH,                                //centra el juego en horizontal y vertical
    },
    //para hacernos la vida muuuucho mas facil (pero mucho) se estudio que existe un plugin que facilita la deteccion de colisiones.
   plugins: {
    scene: [
      {
        plugin: PhaserMatterCollisionPlugin.default, // The plugin class
        key: "matterCollision", // Where to store in Scene.Systems, e.g. scene.sys.matterCollision
        mapping: "matterCollision" // Where to store in the Scene, e.g. scene.matterCollision

        // Note! If you are including the library via the CDN script tag, the plugin 
        // line should be:
        // plugin: PhaserMatterCollisionPlugin.default
      }
    ]
  }
    
}

const juego = new Phaser.Game(config);