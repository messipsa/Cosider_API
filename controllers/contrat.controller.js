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
    console.log(`${process.cwd()}/Cos.docx`);
    const content = fs.readFileSync(`${process.cwd()}/Cos.docx`, "binary");

    const zip = new PizZip(content);
    const doc = new docxtemplater();
    doc.loadZip(zip);
    //
    doc.setData({
      matricule: employe.matricule,
      numero: employe.contrat.numero,
      entite: employe.projet.entite,
    });

    doc.render();
    //
    const buf = doc.getZip().generate({ type: "nodebuffer" });
    fs.writeFileSync(`${employe.matricule}.docx`, buf);

    const mail = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.user,
        pass: process.env.pass,
      },
    });

    const mailOptions = {
      from: process.env.user,
      to: process.env.user,
      subject: "Mail via nodejs",
      text: "Not important",
      attachments: [
        {
          // utf-8 string as an attachment
          filename: `${employe.matricule}.docx`,
          path: `${process.cwd()}/${employe.matricule}.docx`,
        },
      ],
    };

    mail.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
        fs.unlink(`${process.cwd()}/${employe.matricule}.docx`, (err) => {
          if (err) {
            console.log(err);
          }

          console.log("File is deleted.");
          return res.status(200).json({ message: "Success" });
        });
      }
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
};
