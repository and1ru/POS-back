import z from 'zod'

const max_file_size = 5 * 1024 * 1024
const accepted_image_type = ["image/jpeg", "image/png", "image/webp", "image/jpg"]

export const uploadProduct = z.object({
    image: z
        .instanceof(File, { message: "la imagen es obligatoria" })
        .refine((file) => file.size <= max_file_size, "el tamaño maximo es de 5MB")
        .refine((file) => accepted_image_type.includes(file.type), "Solo se permiten formatos .jpg, .jpeg, .png y .webp"),
    name: z.string()
})

export type uploadProductType = z.infer<typeof uploadProduct>