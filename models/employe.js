const {model , Schema} = require('mongoose');


const employeSchema = new Schema({
  nom : {
      type : String,
      required : [true , 'le champs nom ne doit pas etre vide']
  },
  matricule : {
      type : Number,
      unique : false,
      required : [true , 'le champs matricule ne doit pas etre vide']
  },
  lieu_naissance : {
      type : String,
      required : [true , 'le champs lieu de naissance ne doit pas etre vide']
  },
  date_naissance :{
      type : Date,
      required : [true , 'le champs date de naissance ne doit pas etre vide']
  },
  adresse :{
      type : String,
      required : [true , 'le champs adresse ne doit pas etre vide']
  },
  projet : {
      type : Schema.Types.ObjectId,
      ref : 'Projet'
  },
  contrat : {
   // required : [true , 'le champs contrat ne doit pas etre vide'],
      numero : {
          type : String,
          unique : true,
          required : [true , 'le champs numero de contrat ne doit pas etre vide']
      },
      salaire  : {
          type : Number,
          required : [true , 'le champs salaire ne doit pas etre vide']
      },
      salaire_lettres : {
          type : String,
          required : [true , 'le champs salaire en lettres ne doit pas etre vide']
      },
      groupe : {
        type : String,
        required : [true , 'le champs groupe ne doit pas etre vide']  
      },
      section: {
        type : String,
        required : [true , 'le champs section ne doit pas etre vide']  
      },
      affectation : {
        type : String,
        required : [true , 'le champs affectation ne doit pas etre vide']  
      },
      poste_travail : {
        type : String,
        required : [true , 'le champs poste de travail ne doit pas etre vide']  
      },
      statut : {
        type : String,
        required : [true , 'le champs statut ne doit pas etre vide']  
      },
      categorie : {
        type : String,
        required : [true , 'le champs categorie ne doit pas etre vide']  
      },
      periode_essai : {
        type : String,
        required : [true , "le champs periode d'éssai ne doit pas etre vide"]  
      },
      date_debut : {
        type : Date,
        required : [true , 'le champs date de debut de contrat ne doit pas etre vide']  
      },
      date_fin : {
        type : Date,
        required : [true , 'le champs date de fin de contrat ne doit pas etre vide']  
      }
 
  }
},
{timestamps : true}
);

const Employe = model('employe' , employeSchema);

module.exports = Employe;