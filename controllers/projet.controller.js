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


module.exports.getProjectById = async(req,res)=>{
    const id = req.params.id;
    try{
       
          const projet = await Projet.findById(id).orFail();
          return res.json(projet);
    }
    catch(err){
        return res.status(500).json({message : 'Something went wrong',error : err});
    }
}


module.exports.Modify = async(req,res)=>{
    const id = req.params.id;
    const{lieu , directeur} = req.body;
    try{
       const projet = await Projet.findById(id).orFail();
       projet.lieu = lieu || projet.lieu;
       projet.directeur = directeur || projet.directeur;

       await projet.save();

       return res.json(projet);
    }
    catch(err){
        return res.status(500).json({message : 'Something went wrong',error : err});
    }
}


module.exports.deleteProject = async (req,res)=>{
    const id = req.params.id;
    try{
           await Projet.findByIdAndDelete(id).orFail();

           return res.json('user deleted successfully');
    }
    catch(err){
        return res.status(500).json({message : 'Something went wrong',error : err});
    }
}