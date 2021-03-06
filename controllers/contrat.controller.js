const Employe = require("../models/employe");
const Projet = require("../models/projet");
const fs = require("fs");
const PizZip = require("pizzip");
const docxtemplater = require("docxtemplater");
const nodemailer = require("nodemailer");

module.exports.renouvelerContrat = async (req, res) => {
  const id = req.params.id;

  const {
    numero,
    salaire,
    groupe,
    section,
    affectation,
    date_debut,
    date_fin,
    poste_travail,
    statut,
    salaire_lettres,
    categorie,
    periode_essai,
    classification,
    entite,
  } = req.body;
  try {
    const project = await Projet.findOne({ entite: entite }).orFail();
    const employe = await Employe.findById(id).orFail();

    if (employe.projet._id.toString() !== project._id.toString()) {
      const employe_meme_matricule = await Employe.find({
        matricule: employe.matricule,
        projet: project,
      });
      if (employe_meme_matricule.length !== 0) {
        return res.status(400).json({ message: "Matricule dupliqué" });
      }
    }

    employe.contrat.numero = numero || employe.contrat.numero;
    employe.contrat.salaire = salaire || employe.contrat.salaire;
    employe.contrat.groupe = groupe || employe.contrat.groupe;
    employe.contrat.salaire_lettres =
      salaire_lettres || employe.contrat.salaire_lettres;
    employe.contrat.date_fin = date_fin || employe.contrat.date_fin;
    employe.contrat.date_debut = date_debut || employe.contrat.date_debut;
    employe.contrat.affectation = affectation || employe.contrat.affectation;
    employe.contrat.section = section || employe.contrat.section;
    employe.contrat.poste_travail =
      poste_travail || employe.contrat.poste_travail;
    employe.contrat.statut = statut || employe.contrat.statut;
    employe.contrat.categorie = categorie || employe.contrat.categorie;
    employe.contrat.periode_essai =
      periode_essai || employe.contrat.periode_essai;
    employe.contrat.classification = classification;
    employe.projet = project._id || employe.projet;

    await employe.save();

    const employ = await Employe.findById(id)
      .populate("projet", "-__v -createdAt -updatedAt -directeur -lieu")
      .orFail();

    return res.status(200).json(employ);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong", error: err });
  }
};

module.exports.downloadContrat = async (req, res) => {
  try {
    const employe = await Employe.findById(req.params.id)
      .populate("projet", "-__v -createdAt -updatedAt")
      .orFail();

    const doc = new docxtemplater();

    const mail = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.user,
        pass: process.env.pass,
      },
    });

    const content = fs.readFile(
      `${process.cwd()}/Cos.docx`,
      "binary",
      (err, data) => {
        if (err) {
          res.status(500).json({ success: false, error: err.message });
        }
        const zip = new PizZip(data);
        doc.loadZip(zip);

        doc.setData({
          entite: employe.projet.entite,
          directeur: employe.projet.directeur,
          lieu: employe.projet.lieu,
          matricule: employe.matricule,
          nom: employe.nom,
          date_naissance: modifyDate(employe.date_naissance),
          lieu_naissance: employe.lieu_naissance,
          adresse: employe.adresse,
          numero: employe.contrat.numero,
          categorie: employe.contrat.categorie,
          section: employe.contrat.section,
          affectation: employe.contrat.affectation,
          groupe: employe.contrat.groupe,
          date_fin: modifyDate(employe.contrat.date_fin),
          date_debut: modifyDate(employe.contrat.date_debut),
          poste: employe.contrat.poste_travail,
          classification: employe.contrat.classification,
          salaire: employe.contrat.salaire,
          salaire_lettres: employe.contrat.salaire_lettres,
          periode: employe.contrat.periode_essai,
          statut: employe.contrat.statut,
        });

        doc.render();
        //
        const buf = doc.getZip().generate({ type: "nodebuffer" });
        fs.writeFile(`${employe.matricule}.docx`, buf, (err, data) => {
          if (err) {
            return res.status(500).json({ success: false, error: err.message });
          }

          const mailOptions = {
            from: process.env.user,
            to: process.env.reciever,
            subject: `[Mail automatique ] Renouvelement de contrat de ${employe.nom}`,
            text: `Veuillez trouver ci-joint le contrat de l'employe ${employe.matricule} - ${employe.nom}  `,
            attachments: [
              {
                // utf-8 string as an attachment
                filename: `${employe.matricule} - ${employe.nom}.docx`,
                path: `${process.cwd()}/${employe.matricule}.docx`,
              },
            ],
          };

          mail.sendMail(mailOptions, function (error, info) {
            if (error) {
              return res
                .status(500)
                .json({ success: false, error: err.message });
            } else {
              console.log("Email sent: " + info.response);
              fs.unlink(`${process.cwd()}/${employe.matricule}.docx`, (err) => {
                if (err) {
                  return res
                    .status(500)
                    .json({ success: false, error: err.message });
                }

                console.log("File is deleted.");
                return res.status(200).json({ message: "Success" });
              });
            }
          });
        });
      }
    );

    //
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
};

const modifyDate = (mongooseDate) => {
  let date = JSON.stringify(mongooseDate).substring(1, 11);
  let day = date.substring(8, 10);
  let month = date.substring(5, 7);
  let year = date.substring(0, 4);
  return day + "/" + month + "/" + year;
};
