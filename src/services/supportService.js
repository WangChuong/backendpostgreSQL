import db from '../models/index';
require('dotenv').config();
import _ from 'lodash';
import emailService from '../services/emailService';

let getListPatientForSupport = (supportId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!supportId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'

                })
            } else {
                let data = await db.Booking.findAll({
                    where: {
                        statusId: 'R4',
                        supportId: supportId,
                        
                    },
                    include: [
                        {
                            model: db.User, as: 'patientData',
                            attributes: ['email', 'firstName', 'address', 'gender'],
                            include: [
                                {
                                    model: db.Allcode, as: 'genderData',
                                    attributes: ['valueEn', 'valueVi']
                                }
                            ]
                        },
                        {
                            model: db.Allcode, as: 'timeTypeDataPatient', attributes: ['valueEn', 'valueVi']
                        }
                    ],
                    raw: false,
                    nest: true
                })
                resolve({
                    errCode: 0,
                    data: data
                })

            }
        } catch (e) {
            reject(e)
        }
    })
}


let getDetailSupportById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
            } else {
                let data = await db.User.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: ['description', 'contentHTML', 'contentMarkdown']
                        },
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                        {
                            model: db.Support,
                            attributes: {
                                exclude: ['id', 'supportId']
                            }
                        },
                    ],
                    raw: false,
                    nest: true
                })
                if (data && data.image) {
                    data.image = Buffer.from(data.image, 'base64').toString('binary');
                }
                if (!data) data = {};
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        }
        catch (e) {
            reject(e);
        }
    })
}

let getAllSupports = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let supports = await db.User.findAll({
                where: { roleId: 'R4' },
                attributes: {
                    exclude: ['password', 'image']
                },
            })
            resolve({
                errCode: 0,
                data: supports
            })
        } catch (e) {
            reject(e);
        }
    })
}

let checkRequiredFields = (inputData) => {
    let arrFields = ['supportId', 'contentHTML', 'contentMarkdown', 'action', 'note']
    let isValid = true;
    let element = '';
    for (let i = 0; i < arrFields.length; i++) {
        if (!inputData[arrFields[i]]) {
            isValid = false;
            element = arrFields[i]
            break;
        }
    }
    return {
        isValid: isValid,
        element: element
    }
}


let saveDetailInforSupport = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            let checkObj = checkRequiredFields(inputData);
            if (checkObj.isValid === false) {
                resolve({
                    errCode: 1,
                    errMessage: `Missing parameter: ${checkObj.element}`
                })
            } else {
                if (inputData.action === 'CREATE') {
                    await db.Markdown.create({
                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description,
                        supportId: inputData.supportId
                    })
                } else if (inputData.action === 'EDIT') {
                    let supportMarkdown = await db.Markdown.findOne({
                        where: { supportId: inputData.supportId },
                        raw: false
                    })

                    if (supportMarkdown) {
                        supportMarkdown.contentHTML = inputData.contentHTML;
                        supportMarkdown.contentMarkdown = inputData.contentMarkdown;
                        supportMarkdown.description = inputData.description;
                        supportMarkdown.updateAt = new Date();
                        await supportMarkdown.save()
                    }
                }
                let support = await db.Support.findOne({
                    where: {
                        supportId: inputData.supportId,
                    },
                    raw: false
                })
                if (support) {
                    support.supportId = inputData.supportId;
                   
                    support.note = inputData.note;
                  
                    await support.save()
                } else {
                    await db.Support.create({
                        supportId: inputData.supportId,
                       
                        note: inputData.note,
                      
                    })
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Save infor doctor successfully'
                })
            }
        }
        catch (e) {
            reject(e);
        }
    })
}


module.exports = {
    getListPatientForSupport: getListPatientForSupport,
    getDetailSupportById: getDetailSupportById,
    getAllSupports: getAllSupports,
    saveDetailInforSupport: saveDetailInforSupport
}