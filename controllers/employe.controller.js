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