const Employe = require('../models/employe');
const Projet = require('../models/projet');
const Excel = require('exceljs');
const xlsx = require('xlsx');
let workbook = new Excel.Workbook();
let worksheet = workbook.addWorksheet('Cosider');


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
        worksheet.columns = [
            {header: 'Matricule', key: 'matricule' , width: 15},
            {header: 'Nom', key: 'nom' , width: 15},
            {header: 'Date Naissance', key: 'dnaissance' , width: 15},
            {header: 'Lieu Naissance', key: 'lnaissance' , width: 15},
            {header: 'Adresse', key: 'adr' , width: 15},
            {header: 'Numero Contrat', key: 'num' , width: 15},
            {header: 'Date Debut', key: 'ddebut' , width: 15},
            {header: 'Date Fin', key: 'dfin' , width: 15},
            {header: 'Entite', key: 'structure' , width: 15},
            {header: 'Lieu', key: 'lieu' , width: 15},
            {header: 'Directeur', key: 'directeur' , width: 15},
            {header : 'Salaire' , width : 15},
            {header : 'Salaire Lettres' , width : 15},
            {header : 'Statut' , width : 15},
            {header : 'Poste Travail' , width : 15},
            {header : 'Groupe' , width : 15},
            {header : 'Section' , width : 15},
            {header : 'Affectation' , width : 15},
            {header : 'Categorie' , width : 15},
            {header : 'Duree Essais' , width : 15}
        ]

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

     const employ = await Employe.findById(id).orFail();

     const prjp = await Projet.findById(employ.projet).orFail();
      
     console.log(employ.contrat.date_debut)
        worksheet.addRow([
            employ.matricule ,
             employ.nom,
             employ.date_naissance,
             employ.lieu_naissance,
             employ.adresse,
             employ.contrat.numero,
             employ.contrat.date_debut,
             employ.contrat.date_fin,
             prjp.entite,
             prjp.lieu,
             prjp.directeur,
             employ.contrat.salaire,
             employ.contrat.salaire_lettres,
             employ.contrat.statut,
             employ.contrat.poste_travail,
             employ.contrat.groupe,
             employ.contrat.section,
             employ.contrat.affectation ,
             employ.contrat.categorie,
             employ.contrat.periode_essai
        ] );

        workbook.xlsx.writeFile('./Cosider.xlsx');

        return res.json(employe);
    }
    catch(err)
   {
      return res.status(500).json({message : 'Something went wrong',error : err});
   }
}
        