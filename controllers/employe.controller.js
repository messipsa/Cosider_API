const Employe = require("../models/employe");
const Projet = require("../models/projet");

module.exports.addNewEmployee = async (req, res) => {
  const {
    nom,
    matricule,
    lieu_naissance,
    date_naissance,
    adresse,
    entite,
    contrat,
  } = req.body;
  try {
    const project = await Projet.findOne({ entite: entite }).orFail();
    console.log(project);
    console.log(project._id);
    const employe_meme_matricule = await Employe.find({
      matricule: matricule,
      projet: project,
    });
    console.log(employe_meme_matricule);
    if (employe_meme_matricule.length !== 0) {
      return res.status(400).json({ message: "Matricule dupliqué" });
    }
    console.log(matricule);
    const emp = await Employe.create({
      nom,
      matricule,
      lieu_naissance,
      date_naissance,
      adresse,
      projet: project._id,
      contrat,
    });

    return res.status(200).json(emp);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong", error: err });
  }
};

module.exports.getEmployees = async (req, res) => {
  try {
    const employes = await Employe.find().populate(
      "projet",
      "-__v -createdAt -updatedAt -directeur -lieu"
    );
    return res.status(200).json(employes);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong", error: err });
  }
};

module.exports.getEmployeeById = async (req, res) => {
  const id = req.params.id;
  try {
    const employee = await Employe.findById(id)
      .populate("projet", "-__v -createdAt -updatedAt -directeur -lieu")
      .orFail();
    return res.status(200).json(employee);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong", error: err });
  }
};

module.exports.updateEmployee = async (req, res) => {
  const id = req.params.id;
  const { nom, matricule, date_naissance, lieu_naissance, adresse } = req.body;
  console.log(id);
  try {
    const employe = await Employe.findById(id).populate("projet").orFail();
    console.log(employe);
    employe.nom = nom || employe.nom;
    employe.adresse = adresse || employe.adresse;
    employe.matricule = matricule || employe.matricule;
    employe.date_naissance = date_naissance || employe.date_naissance;
    employe.lieu_naissance = lieu_naissance || employe.lieu_naissance;

    await employe.save();

    return res.status(200).json(employe);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong", idemp: id, error: err });
  }
};

module.exports.deleteEmployee = async (req, res) => {
  const id = req.params.id;
  try {
    await Employe.findByIdAndDelete(id).orFail();

    return res.status(200).json("Employe supprimé avec succes");
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong", error: err });
  }
};

module.exports.getEmployeeByEntite = async (req, res) => {
  const entite = req.params.entite;
  try {
    const entity = await Projet.findOne({ entite: entite }).orFail();
    const employes = await Employe.find({ projet: entity.id });

    return res.status(200).json(employes);
  } catch (err) {
    return res.status(500).json({ message: "Entite inexistante", error: err });
  }
};
