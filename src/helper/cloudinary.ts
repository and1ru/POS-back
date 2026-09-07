import cloudinary from "./cloudinary.config"
import type { UploadApiResponse } from "cloudinary"

export const uploadImage = (buffer: Buffer): Promise<UploadApiResponse> => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                resource_type: "image"
            },
            (error, result) => {
                if (error) {
                    reject(error)
                    return
                }

                if(!result){
                    reject(new Error("cloudinary no devolvio el resultado"))
                    return
                }

                resolve(result)
            }
        )
        stream.end(buffer)
    })
}