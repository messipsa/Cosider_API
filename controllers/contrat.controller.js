const Employe = require('../models/employe');
const Projet = require('../models/projet');


module.exports.renouvelerContrat = async(req,res)=>{
    console.log(req.body);
    const id = req.params.id;
    const {
        numero,
        salaire,
        groupe,
        section,
        affectation, 
        date_debut, 
        date_fin ,
        poste_travail, 
        statut ,
        salaire_lettres, 
        categorie, 
        periode_essai
    } = req.body;
    try{
        const employe = await Employe.findById(id).orFail();

        employe.contrat.numero = numero || employe.contrat.numero;
        employe.contrat.salaire = salaire || employe.contrat.salaire;
        employe.contrat.groupe = groupe || employe.contrat.groupe;
        employe.contrat.salaire_lettres = salaire_lettres || employe.contrat.salaire_lettres;
        employe.contrat.date_fin = date_fin || employe.contrat.date_fin ;
        employe.contrat.date_debut = date_debut || employe.contrat.date_debut;
        employe.contrat.affectation = affectation || employe.contrat.affectation;
        employe.contrat.section = section || employe.contrat.section;
        employe.contrat.poste_travail = poste_travail || employe.contrat.poste_travail;
        employe.contrat.statut = statut || employe.contrat.statut;
        employe.contrat.categorie = categorie || employe.contrat.categorie;
        employe.contrat.periode_essai = periode_essai || employe.contrat.periode_essai ;

        await employe.save();

        return res.json(employe);
    }
    catch(err)
   {
      return res.status(500).json({message : 'Something went wrong',error : err});
   }
}
        