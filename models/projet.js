const {model , Schema} = require('mongoose');

const projectSchema = new Schema({
    entite : {
        type : String,
        unique : true,
        required : [true , 'le champ entite ne doit pas entre vide']
    },
    lieu:{
        type : String,
        required : [true, 'le champ lieu de projet ne doit pas entre vide']
    },
    directeur:{
        type : String,
        required : [true , 'le champ directeur de projet ne doit pas entre vide']
    }
},
{timestamps : true}
);

const Projet = model('Projet' , projectSchema);

module.exports = Projet;
