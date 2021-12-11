const Projet = require('../models/projet');

module.exports.getAllProjects = async(req,res)=>{
    try{
        const projets = await Projet.find().orFail();
        return res.json(projets);
    }
    catch(err){
        return res.status(500).json({message : 'Something went wrong',error : err});
    }
}


module.exports.addProject = async(req,res)=>{
    const{entite , lieu , directeur} = req.body;
    try{
         const projet = await Projet.create({entite , lieu , directeur});
         return res.json(projet);
    }
    catch(err){
       return res.status(500).json({message : 'Something went wrong',error : err});
    }
}