import supportService from '../services/supportService';

let getDetailSupportById = async (req, res) => {
    try {
        let infor = await supportService.getDetailSupportById(req.query.id);
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

let getListPatientForSupport = async (req, res) => {
    try {
        let infor = await supportService.getListPatientForSupport(req.query.doctorId, req.query.date);
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

let getAllSupports = async (req, res) => {
    try {
        let doctors = await supportService.getAllSupports();
        return res.status(200).json(doctors)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let postInforSupport = async (req, res) => {
    try {
        let response = await supportService.saveDetailInforSupport(req.body);
        return res.status(200).json(response)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}


module.exports = {
    getListPatientForSupport: getListPatientForSupport,
    getDetailSupportById: getDetailSupportById,
    getAllSupports: getAllSupports,
    postInforSupport: postInforSupport
}