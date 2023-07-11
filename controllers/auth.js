//para recuperar el tipado
const {response}= require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

//controllers
// para la ayuda se agrega la parte de express
const crearUsuario= async(req,res=response)=>{
	let {email,password}=req.body;
	try {
		let usuario=await Usuario.findOne({email});
		if (usuario) {
			return res.status(400).json({
				ok:false,
				mensaje:'Un usuario existe con ese correo'
			})
		}
		
		usuario= new Usuario(req.body);
		//	Encriptar contraseña
		const salt=bcrypt.genSaltSync();
		usuario.password=bcrypt.hashSync(password,salt);
		
		await usuario.save();

		const token=await generarJWT(usuario.id,usuario.name);
		
		res.status(201).json({
			ok:true,
			uid:usuario.id,
			name:usuario.name,
			token
		});

	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok:false,
			mensaje:'Por favor hable con el administrador'
		})
	}
}
const loginUsuario= async(req,res=response)=>{
	let {email,password}=req.body;
	try {

		let usuario=await Usuario.findOne({email});
		if (!usuario) {
			return res.status(400).json({
				ok:false,
				mensaje:'El usuario no existe'
			})
		}

		//confirmar los password
		const validPassword=bcrypt.compareSync(password,usuario.password);
		if (!validPassword) {
			return res.status(400).json({
				ok:false,
				mensaje:'Password incorrecto'
			})
		}

		//Generar JWT
		const token=await generarJWT(usuario.id,usuario.name);

		res.json({
			ok:true,
			mensaje:'login',
			uid:usuario.id,
			name:usuario.name,
			token
		})
		
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok:false,
			mensaje:'Por favor hable con el administrador'
		})
	}

}
const revalidarToken= async(req,res=response)=>{
	const {uid,name}=req;
	//Generar JWT
	const token=await generarJWT(uid,name);
	res.json({
		ok:true,
		token
	})
}

module.exports = {
	crearUsuario,
	loginUsuario,
	revalidarToken
};