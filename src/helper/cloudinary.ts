import cloudinary from "./cloudinary.config"

export const uploadImage = (buffer:Buffer, mimeType:string):Promise<any> => {
    return new Promise((resolve, reject) =>{
        const stream = cloudinary.uploader.upload_stream(
            {
                resource_type: "image"
            },
            (error, result) => {
                if(error){
                    reject(error)
                    return
                }
                resolve(result)
            }
        )
        stream.end(buffer)
    })
}