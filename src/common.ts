import * as _ from 'lodash'
const moment = require('moment')
const AWS = require('aws-sdk')
const fs = require('fs')
const uuid = require('uuid/v4')

AWS.config.update({
  accessKeyId: process.env.AWSAccessKeyId,
  secretAccessKey: process.env.AWSSecretKey,
  region: process.env.S3_REGION
})

let s3 = new AWS.S3()

export const uploadImageS3 = (file: any, folderPath: string) => {
  return new Promise(async (resolve, reject) => {
    let fileName = file.originalname
    let params = {
      Bucket: process.env.S3_BUCKET + '/' + folderPath,
      Key: fileName,
      Body: fs.createReadStream(file.path),
      ContentType: file.mimetype,
      ACL: 'public-read'
    }
    try {
      const result = await s3.upload(params).promise()
      fs.unlink(file.path, function (err: any) {
        if (err) {
          console.log(err)
        }
        file.destination = result.Key
        file.path = result.Key
        resolve(file)
      })
    } catch (err) {
      console.log(err)
      resolve(false)
    }
  })
}

export const uploadDocumentS3 = (file: any, folderPath: string) => {
  return new Promise(async (resolve, reject) => {
    let fileName = file.originalname
    console.log(process.env.S3_BUCKET + '/' + 'Shipping' + folderPath)
    let params = {
      Bucket: process.env.S3_BUCKET + '/' + 'Shipping' + '/' + folderPath,
      Key: fileName,
      Body: fs.createReadStream(file.path),
      ContentType: file.mimetype,
      ACL: 'public-read'
    }
    try {
      const result = await s3.upload(params).promise()
      fs.unlink(file.path, function (err: any) {
        if (err) {
          console.log(err)
        }
        file.destination = result.Key
        file.path = result.Key
        resolve(file)
      })
    } catch (err) {
      console.log(err)
      resolve(false)
    }
  })
}

export const moveImagesS3 = async (file: any, folderPath: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const url = file.path.split('temp/')[0]

      let image = process.env.S3_BUCKET + file.path.split('.com')[1]
      image = image.split("?")[0]

      let copyParams = {
        Bucket: process.env.S3_BUCKET + '/' + folderPath,
        CopySource: image,
        Key: image.split('temp/')[1],
        ACL: 'public-read'
      }

      const delParams = {
        Bucket: process.env.S3_BUCKET + '/temp',
        Key: image.split('temp/')[1]
      }

      const result = await s3.copyObject(copyParams).promise()
      const result1 = await s3.deleteObject(delParams).promise()
      let path = url + folderPath + '/' + file.path.split('temp/')[1]
      file.path = `${folderPath}/${file.filename}`
      file.destination = `${folderPath}/${file.filename}`
      resolve(file)
    } catch (e) {
      console.log(e)
      reject(e.statusCode)
    }
  });
}

export const getSignUrl = async (fileName: String, fileType: String) => {
  return new Promise((resolve, reject) => {
    const bucket = process.env.S3_BUCKET;
    AWS.config.update({ accessKeyId: process.env.AWSAccessKeyId, secretAccessKey: process.env.AWSSecretKey, signatureVersion: 'v4' })
    const s3 = new AWS.S3({ region: process.env.S3_REGION, signatureVersion: 'v4' })
    const s3Params = {
      Bucket: bucket,
      Key: 'temp/' + fileName,
      ContentType: fileType,
      ACL: 'bucket-owner-full-control'
    };
    try {
      s3.getSignedUrl('putObject', s3Params, (err: any, data: any) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    } catch (e) {
      throw error(500, 'Internal Server Error')
    }
  })

}