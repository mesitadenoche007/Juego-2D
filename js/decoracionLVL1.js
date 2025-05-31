export default class Decoracion extends Phaser.Physics.Matter.Sprite{
//creamos una clase para añadir la decoracion en el mapa.
//de momento solo tenemos el cofre que da las armas.
//se crea una clase aparte por si e el futuro se decide añadir arboles, rocas, barriles, u otros assets.

constructor(datos){

let {scene, x, y, texture, frame} = datos;

super(scene.matter.world, x, y, texture, frame);
this.scene.add.existing(this);

}

}