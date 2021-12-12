const Employe = require('../models/employe');
const Projet = require('../models/projet');

module.exports.addNewEmployee = async(req,res)=>{
    const {
        nom , 
        matricule ,
         lieu_naissance, 
         date_naissance , 
         adresse , 
         projetId ,  
         contrat
         } = req.body;
         try{
            const project = await Projet.findById(projetId).orFail();
           const emp = await Employe.create({nom , matricule , lieu_naissance,date_naissance , adresse , projet : project.id  , contrat})
           return res.json(emp); 
        }
         catch(err){
            return res.status(500).json({message : 'Something went wrong',error : err});
         }
}


module.exports.getEmployees = async(req,res)=>{
   try{
        const employes = await Employe.find().populate('projet' , ('-__v -createdAt -updatedAt -directeur -lieu'));
        return res.json(employes); 
   }
   catch(err){
      return res.status(500).json({message : 'Something went wrong',error : err});
   }
}


module.exports.getEmployeeById = async(req,res)=>{
   const id = req.params.id;
   try{
      const employee = await Employe.findById(id)
      .populate('projet' , '-__v -createdAt -updatedAt -directeur -lieu').orFail();
      return res.json(employee);
   }
   catch(err){
      return res.status(500).json({message : 'Something went wrong',error : err});
   }
}


module.exports.updateEmployee = async(req,res)=>{
   const id= req.params.id;
   const{nom , matricule , date_naissance , lieu_naissance , adresse , projet} = req.body;
   try{
      const employe = await Employe.findById(id).orFail();
      
      const project = await Projet.findById(projet).orFail();
      
      employe.nom = nom || employe.nom;
      employe.adresse = adresse ||employe.adresse;
      employe.matricule = matricule || employe.matricule;
      employe.date_naissance = date_naissance || employe.date_naissance;
      employe.lieu_naissance = lieu_naissance || employe.lieu_naissance;
      employe.projet = project.id || employe.projet;

      await employe.save();

      return res.json(employe);
   }
   catch(err)
   {
      return res.status(500).json({message : 'Something went wrong',error : err});
   }
}


module.exports.deleteEmployee = async(req,res)=>{
   const id = req.params.id;
   try{
     await Employe.findByIdAndDelete(id).orFail();

     return res.json('Employe supprimé avec succes');
   }
   catch(err)
   {
      return res.status(500).json({message : 'Something went wrong',error : err});
   }
}


module.exports.getEmployeeByEntite = async(req,res)=>{
   const entite = req.params.entite;
   try{
     const entity = await Projet.findOne({entite : entite}).orFail();
     const employes = await Employe.find({projet : entity.id});
     /*if(employes.length === 0)
     {
        return res.json({message : "Aucun employe n'a été affecté au projet"});
     }*/
     return res.json(employes); 
   }
   catch(err)
   {
      return res.status(500).json({message : 'Entite inexistante',error : err});
   }
}