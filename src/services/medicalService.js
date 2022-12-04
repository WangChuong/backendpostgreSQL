import db from '../models/index';
require('dotenv').config();
import emailService from './emailService';



let createMedical = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.imageBase64 || !data.descriptionHTML || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
            } else {
                await db.Medical.create({
                    name: data.name,
                    image: data.imageBase64,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown
                })
                resolve({
                    errCode: 0,
                    errMessage: 'Ok'
                })

            }
        } catch (e) {
            reject(e);
        }
    })
}

let getAllMedical = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Medical.findAll({
               
            });
            if (data && data.length > 0) {
                data.map(item => {
                    item.image = Buffer.from(item.image, 'base64').toString('binary');
                    return item;
                })
            }
            resolve({
                errMessage: 'Ok',
                errCode: 0,
                data
            })
        } catch (e) {
            reject(e);
        }
    })
}

let getDetailMedicalById = (inputId, location) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId || !location){
                resolve({
                    errMessage: 'Ok',
                    errCode: 0,
                    data
                })
            }else{
                let data = await db.Medical.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: ['descriptionHTML', 'descriptionMarkdown'],
                })

                if(data){
                    let doctorMedical = [];
                    if(location === 'ALL'){
                        doctorMedical = await db.Doctor_Infor.findAll({
                            where: {medicalId: inputId},
                            attributes: ['doctorId','medicationId'],
                        })
                    }else{
                        doctorMedical = await db.Doctor_Infor.findAll({
                            where: {
                                medicalId: inputId,
                                medicationId: location
                            },
                            attributes: ['doctorId', 'medicationId'],
                        })
                    }
                    data.doctorMedical = doctorMedical;
                }else data = {}
                resolve({
                    errMessage: 'Ok',
                    errCode: 0,
                    data
                })
            }           
        } catch (e) {
            reject(e);
        }
    })
}
module.exports = {
    createMedical: createMedical,
    getAllMedical: getAllMedical,
    getDetailMedicalById: getDetailMedicalById
}