import medicalService from '../services/medicalService';

let createMedical = async (req, res) => {
    try {
        let infor = await medicalService.createMedical(req.body);
        return res.status(200).json(
            infor
        )
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}

let getAllMedical = async (req, res) => {
    try {
        let infor = await medicalService.getAllMedical();
        return res.status(200).json(
            infor
        )
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}

let getDetailMedicalById = async (req, res) => {
    try {
        let infor = await medicalService.getDetailMedicalById(req.query.id, req.query.location);
        return res.status(200).json(
            infor
        )
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}
module.exports = {
    createMedical: createMedical,
    getAllMedical: getAllMedical,
    getDetailMedicalById: getDetailMedicalById

}